import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
  // passa como parâmetro a chave pública

  //! A UNICA FORMA DE ACESSAR UMA CHAVE NO FRONTEND DA APLICAÇÃO É POR NEXT_PUBLIC ANTES DO NOME!!!
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  return stripeJs;
}
