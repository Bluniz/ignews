import styles from "../styles/home.module.scss";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        {/* Todo conteudo dentro do Head é jogado lá dentro do document */}
        <title>Ínicio|ig.news</title>
      </Head>
      <h1 className={styles.title}>Hello World</h1>
    </>
  );
}
