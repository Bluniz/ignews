import styles from "./styles.module.scss";
import { signIn, useSession } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { useRouter } from "next/router";

export function SubscribeButton() {
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (session?.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error);
    }
  }

  return (
    <button type="button" onClick={handleSubscribe} className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}
