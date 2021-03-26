import { fauna } from "../../../services/faunadb";
import { query as q } from "faunadb";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  // Buscar usuário no banco do fauna com o costumerID
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("users_by_stripe_customer_id"), customerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Salvar os dados da subscription do usuário no FaunaDB

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  };

  await fauna.query(
    q.Create(q.Collection("subscriptions"), { data: subscriptionData })
  );
}
