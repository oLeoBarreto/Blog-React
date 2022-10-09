import React, { useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";

import { FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight} from "react-icons/fi";
import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/Prismic";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

type TPosts = {
    slug: string;
    title: string;
    description: string
    cover: string
    updateAt: string;
}

interface IPostsProps {
    posts: TPosts[];
    page: string;
    totalPages: string;
}

export default function Posts({ posts: postsBlog, page, totalPages }: IPostsProps) {

    const [posts, setPosts] = useState(postsBlog || []);
    const [currentPage, setCurrentPage] = useState(Number(page));

    async function reqPost(pageNumber: number) {
        const prismic = getPrismicClient();

        const response = await prismic.query([
            Prismic.predicates.at("document.type", "post")
        ], {
            orderings: '[document.last_publication_date desc]', 
            fetch: ['post.title, post.description, post.cover'],
            pageSize: 3,
            page: String(pageNumber)
        });

        return response;
    }

    async function NavigatePage(pageNumber: number) {
        const response = await reqPost(pageNumber);

        if (response.results.length === 0) {
            return;
        }

        const getPosts = response.results.map(post => {
            return {
                slug: post.uid,
                title: RichText.asText(post.data.title),
                description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
                cover: post.data.cover.url,
                updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                    day: '2-digit', 
                    month: 'long',
                    year: 'numeric'
                })
            }
        });

        setCurrentPage(pageNumber);
        setPosts(getPosts);
    }

    return (
        <>
            <Head>
                <title>Blog - Conteudos</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>

                    {posts.map(post => (
                        <Link href={`/posts/${post.slug}`} key={post.slug}>
                            <a key={post.slug}>
                                <Image 
                                    src={post.cover} 
                                    alt={post.title} 
                                    width={720} 
                                    height={410} 
                                    quality={100}
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUKzi8HgAD5wH6gRa8NAAAAABJRU5ErkJggg=="
                                />
                                <strong>{post.title}</strong>
                                <time>{post.updateAt}</time>
                                <p>{post.description}</p>
                            </a>
                        </Link>
                    ))}

                    <div className={styles.buttonNavigate}>
                        {Number(currentPage) >= 2 && (
                            <div>
                                <button
                                    onClick={() => NavigatePage(1)}
                                >
                                    <FiChevronsLeft size={25} color="#FFF"/>
                                </button>
                                <button
                                    onClick={() => NavigatePage(Number(currentPage - 1))}
                                >
                                    <FiChevronLeft size={25} color="#FFF"/>
                                </button>
                            </div>
                        )}

                        {Number(currentPage) < Number(totalPages) && (
                            <div>
                                <button
                                    onClick={() => NavigatePage(Number(currentPage + 1))}
                                >
                                    <FiChevronRight size={25} color="#FFF"/>
                                </button>
                                <button
                                    onClick={() => NavigatePage(Number(totalPages))}
                                >
                                    <FiChevronsRight size={25} color="#FFF"/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.Predicates.at("document.type", "post")
    ], {
        orderings: '[document.last_publication_date desc]', 
        fetch: ['post.title, post.description, post.cover'],
        pageSize: 3
    });

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
            cover: post.data.cover.url,
            updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit', 
                month: 'long',
                year: 'numeric'
            })
        }
    });

    return {
        props: {
            posts,
            page: response.page,
            totalPages: response.total_pages
        },
        revalidate: 60 * 30
    }
}