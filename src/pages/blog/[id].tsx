import { makeTagList, getBlogPosts } from "../blog";
import fs from 'fs';
import {BlogPost} from "../../lib/blogParser";
import Header from "../../Header";
import React from "react";
import styles from "../../../styles/blogPost.module.scss";

export default function Main(props: { id: number, post: BlogPost }) {
    const { id, post } = props
    return <div>
        <Header/>
        <div className={styles.titleBar}>
            <div className={styles.title}>{post.title}</div>
            <div className={styles.desc}>{post.desc}</div>
            <div className={styles.tags}>{ makeTagList(post.tags, () => {})}</div>
        </div>
        <div>
            {post.content}
        </div>
    </div>
}

export async function getStaticProps(context) {
    const posts = await getBlogPosts(fs)
    return {
        props: {
            id: context.params.id,
            post: posts.filter(p => p.id == context.params.id)[0]
        }
    }
}
export async function getStaticPaths() {
    const posts = await getBlogPosts(fs)
    const x ={
        paths: posts.map(x => ({ params: { id: "" + x.id } }) ),
        fallback: false
    }
    return x
}