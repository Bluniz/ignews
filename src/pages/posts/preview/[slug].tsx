import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a> Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
//! Formas de gerar páginas estáticas no Next
/*
  ! Forma 1
  ? * Gerar as páginas estáticas durante a build -> Ao tu dar o next build para
  ? * produção, ele já irá criar TODAS as páginas estáticas previamente. 
  
  ! Forma 2
  ? * Gerar a página estática no primeiro acesso -> Quando a primeira pessoa acessar
  ? * a página do produto, ai sim irá gerar as pag estáticas
  
  ! Forma 3
  ? * Metade, gerar alguns durante a build e depois gerar durante o acesso.
  
*/

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking", //? true, false, ou blocking.

    /* 
    ! true -> Se alguem tentar acessar um post que ainda não foi gerado de forma estática, 
    !  que carregue a página do lado do browser.
    ? Problemas de usar o true
    * Layout Shift -> Carregar a página sem o conteudo e depois preencher
    * Não é bom para SEO. 

    
    ! false -> Se a página não foi gerada de forma estática ainda, retorna um 404.


    ! blocking -> Parecido com o true, porém quando acessar um conteudo que ainda não foii
    ! gerado de forma estatica, ele vai tentar carregar o conteudo novo na camada no next,
    ! executando um serverSide Rendering


    ? Na grande maioria das vezes você irá acabar utilizando ou o blocking
    ? que vai utilizar quando tu tem um conteudo que pode surgir novos no futuro
    ? ou quando você não carrega todos os conteudos. Ou você irá utilizar o false
    ? quando você já gerou todos os conteudos estáticos definidos pelo path e 
    ? o que não estiver no paths, não é para ser carregado e dar erro 404.
     
    */
  };
};

// Unica forma para garantir que o usuário não vá ter acesso ao conteudo se não estiver logado
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID("post", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.slice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutos
  };
};
