import Head from "next/head";
import styles from "./styles.module.scss";
import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a monorepo & Yarn Workspaces </strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared
            </p>
          </a>

          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a monorepo & Yarn Workspaces </strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared
            </p>
          </a>

          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a monorepo & Yarn Workspaces </strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "post")],
    {
      //! Definir dados que quer no retorno
      //? Data vem em todos
      //* Slug(id) vem por por padrão
      fetch: ["post.title", "post.content"],
      //! Limite de items por pag
      pageSize: 100,
    }
  );

  // a resposta vem com alguns dados que não conseguimos ver oq tem dentro
  // para resolver isto, faremos os seguinte:
  console.log(JSON.stringify(response, null, 2));
  //? Primeiro parametro: OBJETO
  //? Segundo: Null
  //? Identação

  return {
    props: {},
  };
};
