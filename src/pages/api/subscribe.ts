import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/faunadb";
import { query as q } from "faunadb";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // Verificando o metodo da request
  if (req.method === "POST") {
    // Vai pegar a sessão do usuário pelos cookies.
    const session = await getSession({ req });

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let costumerId = user.data.stripe_customer_id;

    if (!costumerId) {
      // criando cliente, unico campo obrigatório é o email
      const stripeCostumer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      });

      await fauna.query(
        q.Update(
          // Não da pra atualizar o usuário diretamente, apenas pela referência dele
          q.Ref(q.Collection("users"), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCostumer.id,
            },
          }
        )
      );
      costumerId = stripeCostumer.id;
    }
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      // Quem que está comprando
      customer: costumerId,
      // Metodos de pagamento
      payment_method_types: ["card"],
      // Preencher endereço -> requerido, auto, passivel de configurar
      billing_address_collection: "required",
      // items que a pessoa irá ter dentro do carrinho
      line_items: [
        {
          price: "price_1IYIVwIeUfAo4lsmcZIaKWnL",
          quantity: 1,
        },
      ],
      // Modo, no caso subscription pois é um pagamento recorrente.
      mode: "subscription",
      // Permitir codigos de promoção
      allow_promotion_codes: true,
      // Caso seja sucesso, para onde o usuário será redirecionado
      success_url: process.env.STRIPE_SUCESS_URL,
      // Caso seja cancelado, para onde o usuário será redirecionado
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    // Explicando pro FRONTEND que essa rota aceita apenas POST
    res.setHeader("Allow", "POST");
    res.status(405).send("Method not allowed");
  }
}
