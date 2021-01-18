import React, { useState } from "react";
import Header from "../Header";
import styles from "../../styles/blog.module.scss";
import { BlogPost, parsePost } from "../lib/blogParser";
import { GetStaticProps } from 'next'

import fs from 'fs';
import path from 'path';

export default function Blog(props: { blogPosts: BlogPost[] }) {
    return <div>
        <Header/>
        <Body blogPosts={props.blogPosts}/>
    </div>
}



function Body(props: { blogPosts: BlogPost[] }): JSX.Element {

    return <div className={styles.body}>
        <h3 className={styles.title}>Blog</h3>
        {(() => {
            const filtered = props.blogPosts
                .filter(post => post.tags.indexOf('unreleased') == -1)
            if(filtered.length == 0) return <span className={styles.filteredOutEverything}>There doesn't seem to be any posts here</span>
            return makePostList(filtered) 

        }).call(null)}
    </div>
}
function all<T>(array: T[], pred: (T) => boolean): boolean {
    for(const elem of array) {
        if(!pred(elem)) return false;
    }
    return true;
}

function makePostLink(post: BlogPost): JSX.Element {
    return <a href={"/blog/" + post.id + "#" + post.url} key={post.id}>
        <span className={styles.blogPostDate}>{post.date}</span>
        <span className={styles.blogPostTitle}>{post.title}</span>
    </a>
}
export function makePostList(posts: BlogPost[]): JSX.Element {
    return <ul id="HELO" className={styles.blogPostList}>
        {posts.map(x => <li key={x.id}>{makePostLink(x)}</li>)}
    </ul>
}


// noinspection JSUnusedGlobalSymbols
export const getStaticProps: GetStaticProps = async (contexto) => {
    return {
        props: {
            blogPosts: await getBlogPosts(fs)
        }
    }
}

export const getBlogPosts: (any) => Promise<BlogPost[]> = async (fs) => {
    const dir = path.join(process.cwd(), 'posts')
    const posts = fs.readdirSync(dir)
    const result = posts.map(filename => {
        const filepath = path.join(dir, filename)
        return fs.readFileSync(filepath, 'utf8')
    })
    return result.map(parsePost)
}