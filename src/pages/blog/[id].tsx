import {getBlogPosts, makeTagList} from "../blog";
import fs from 'fs';
import {BlogPost} from "../../lib/blogParser";
import Header from "../../Header";
import React from "react";
import styles from "../../../styles/blogPost.module.scss";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import CodeBlock from "../../lib/CodeBlock";
import {useRouter} from "next/router";

export default function Main(props: { id: number, post: BlogPost }) {
    const { id, post } = props
    const router = useRouter()
    return <div className={styles.main}>
        <Header/>
        <div className={styles.titleBar}>
            <div className={styles.title}>{post.title}</div>
            <div className={styles.desc}>{post.desc}</div>
            <div className={styles.tags}>{ makeTagList(post.tags, (tag) => {
                router.push('/blog/?initial=' + tag);
            })}</div>
        </div>
        <div className={styles.content + ' ' + styles.post}>
            { render(post.content) }
        </div>
    </div>
}
function render(post: string): JSX.Element {
    const plugins = []
    return <ReactMarkdown escapeHtml={false}
                          source={post}
                          plugins={plugins}
                          renderers={{ code: CodeBlock }}/>
}



// noinspection JSUnusedGlobalSymbols
export async function getStaticProps(context) {
    const posts = await getBlogPosts(fs)
    return {
        props: {
            id: context.params.id,
            post: posts.filter(p => p.id == context.params.id)[0]
        }
    }
}
// noinspection JSUnusedGlobalSymbols
export async function getStaticPaths() {
    const posts = await getBlogPosts(fs)
    return {
        paths: posts.map(x => ({params: {id: "" + x.id}})),
        fallback: false
    }
}