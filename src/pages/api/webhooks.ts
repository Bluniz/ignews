import { NextApiRequest, NextApiResponse } from "next";
import { types } from "node:util";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

// Função para converter uma stream em algo que possamos usar.
async function buffer(readable: Readable) {
  const chunks = []; // Pedaços da Stream

  // Aguarda novos chungs e vai adicionando
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}
// Por padrão do Next, toda requisição vem com JSON, formulário e etc.
// Como a requisição está vindo como Stream, precisa desabilitar a configuração padrão
export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantsEvents = new Set(["checkout.session.completed"]);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];

    // Eventos que vem do webhook
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if (relevantsEvents.has(type)) {
      try {
        switch (type) {
          case "checkout.session.completed":
            //! Todos os eventos do stripe tem tipagens genéricas de evento
            //? Assim dei uma tipagem e podemos saber tudo que tem dentro do checkout
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString()
            );
            break;

          default:
            throw new Error("Unhandled event");
        }
      } catch (err) {
        return res.json({ error: "Webhook handler failed" });
      }
    }

    return res.json({ received: true });
  } else {
    // Explicando pro FRONTEND que essa rota aceita apenas POST
    res.setHeader("Allow", "POST");
    res.status(405).send("Method not allowed");
  }
}
