import { GetStaticProps } from "next";

import Head from "next/head";
import Image from "next/image";
import styles from "../styles/home.module.scss";

import techsImage from "../../public/images/techs.svg";

import { getPrismicClient } from "../services/Prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

type TContent = {
  title: string,
  titleContent: string,
  link_action: string,
  mobileTitle: string,
  mobileContent: string,
  mobileBanner: string,
  titleWeb: string,
  webContent: string,
  webBanner: string,
}

interface IContentProps {
  content: TContent;
}

export default function Home({ content }: IContentProps) {
  return (
    <>
      <Head>
        <title>Home - blog</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaTexts}>
            <h1>{content.title}</h1>
            <span>{content.titleContent}</span>
            <a href={content.link_action}>
              <button>COMEÇAR AGORA!</button>
            </a>
          </section>

          <img src="/images/banner-conteudos.png" alt="Conteudos"/>
        </div>

        <hr className={styles.divisor}/>

        <div className={styles.sectionContent}>
          <section>
            <h1>{content.mobileTitle}</h1>
            <span>{content.mobileContent}</span>
          </section>

          <img src={content.mobileBanner} alt="Conteudos mobile" />
        </div>

        <hr className={styles.divisor}/>

        <div className={styles.sectionContent}>
          <img src={content.webBanner} alt="Conteudos web" />

          <section>
            <h1>{content.titleWeb}</h1>
            <span>{content.webContent}</span>
          </section>
        </div>

        <div className={styles.footer}>
          <Image src={techsImage} alt="Tecnologias" />
          <h2>Mais de <span className={styles.alunos}>15 mil</span> já levaram sua carreira ao próximo nivel.</h2>
          <span>E você vai perder a chance de evoluir de uma vez por todas?</span>
          <a href={content.link_action}>
            <button>ACESSAR TURMA</button>
          </a>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at("document.type", "home")
  ]);

  const { 
    title, 
    sub_title, 
    link_action, 
    mobile, 
    mobile_content, 
    mobile_banner, 
    web, 
    web_content, 
    web_banner 
  } = response.results[0].data;

  const content = {
    title: RichText.asText(title),
    titleContent: RichText.asText(sub_title),
    link_action: link_action.url,
    mobileTitle: RichText.asText(mobile),
    mobileContent: RichText.asText(mobile_content),
    mobileBanner: mobile_banner.url,
    titleWeb: RichText.asText(web),
    webContent: RichText.asText(web_content),
    webBanner: web_banner.url,
  };

  return {
    props: {
      content,
    },
    revalidate : 60 * 10,
  }

}