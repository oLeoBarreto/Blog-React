import { GetServerSideProps } from "next";
import styles from "./post.module.scss";

import { getPrismicClient } from "../../services/Prismic";
import { RichText } from "prismic-dom";
import Head from "next/head";
import Image from "next/image";

type TPost = {
    slug: string,
    title: string,
    description: string,
    cover: string,
    updatedAt: string;
}

interface IPost {
    post: TPost;
}

export default function Post({ post }: IPost) {
    return (
        <>
            <Head>
                <title>{post.title}</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <Image 
                        src={post.cover} 
                        width={720} 
                        height={410} 
                        alt={post.title} 
                        quality={100}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUKzi8HgAD5wH6gRa8NAAAAABJRU5ErkJggg=="
                    />

                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.description }}></div>
                </article>
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

    const { slug } = params;
    const prismic = getPrismicClient(req);

    const response = await prismic.getByUID('post', String(slug), {});

    if (!response) {
        return {
            redirect: {
                destination: '/posts',
                permanent: false
            }
        }
    }

    const post = {
        slug: slug,
        title: RichText.asText(response.data.title),
        description: RichText.asHtml(response.data.description),
        cover: response.data.cover.url,
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post
        }
    }
}