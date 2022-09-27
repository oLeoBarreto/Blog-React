import Head from "next/head";
import Image from "next/image";
import styles from "../styles/home.module.scss";

import techsImage from "../../public/images/techs.svg";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home - blog</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaTexts}>
            <h1>Levando você ao proximo nível!</h1>
            <span>Uma plataforma com cursos que vão do zero ao profissional na pratica, direto ao ponto aplicando o que usamos no mercado de trabalo.</span>
            <a>
              <button>COMEÇAR AGORA!</button>
            </a>
          </section>

          <img src="/images/banner-conteudos.png" alt="Conteudos"/>
        </div>

        <hr className={styles.divisor}/>

        <div className={styles.sectionContent}>
          <section>
            <h1>Aprenda criar aplicativos para Android e iOS</h1>
            <span>Você vai descobrir o jeito mais moderno de desenvolver apps nativos para iOS e Android, construindo aplicativos do zero até aplicativos.</span>
          </section>

          <img src="/images/financasApp.png" alt="Conteudos mobile" />
        </div>

        <hr className={styles.divisor}/>

        <div className={styles.sectionContent}>
          <img src="/images/webDev.png" alt="Conteudos web" />

          <section>
            <h1>Aprenda criar sistemas web</h1>
            <span>Criar sistemas web, sites usando as tecnologias mais modernas e requisitadas pelo mercado.</span>
          </section>
        </div>

        <div className={styles.footer}>
          <Image src={techsImage} alt="Tecnologias" />
          <h2>Mais de <span className={styles.alunos}>15 mil</span> já levaram sua carreira ao próximo nivel.</h2>
          <span>E você vai perder a chance de evoluir de uma vez por todas?</span>
          <a>
            <button>ACESSAR TURMA</button>
          </a>
        </div>
      </main>
    </>
  )
}
