import { GetStaticProps } from "next";
import styles from "./styles.module.scss";

import { getPrismicClient } from "../../services/Prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
import Head from "next/head";

import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

type TAbout = {
    title: string;
    description: string;
    banner: string;
    instagram: string;
    github: string;
    linkedin: string;
}

interface IAbout {
    about: TAbout;
}

export default function Sobre({ about }: IAbout) {
    return (
        <>
            <Head>
                <title>Quem somos?</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.containerHeader}>
                    <section className={styles.ctaText}>
                        <h1>{about.title}</h1>
                        <p>{about.description}</p>

                        <a href={about.instagram}>
                            <FaInstagram 
                                size={40}
                            />
                        </a>

                        <a href={about.github}>
                            <FaGithub 
                                size={40}
                            />
                        </a>

                        <a href={about.linkedin}>
                            <FaLinkedin 
                                size={40}
                            />
                        </a>
                    </section>

                    <img src={about.banner} />
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.Predicates.at('document.type', 'about')
    ]);

    const {
        title,
        description,
        banner,
        instagram,
        github,
        linkedin
    } = response.results[0].data;  

    const about = {
        title: RichText.asText(title),
        description: RichText.asText(description),
        banner: banner.url,
        instagram: instagram.url,
        github: github.url,
        linkedin: linkedin.url
    }

    return {
        props: {
            about
        },
        revalidate: 60 * 60 * 2
    }
}