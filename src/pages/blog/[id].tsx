import {getBlogPosts} from "../index";
import fs from 'fs';
import {BlogPost} from "../../lib/blogParser";
import Header from "../../Header";
import React, { JSX } from "react";
import styles from "../../../styles/blogPost.module.scss";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import rehypeRaw from 'rehype-raw'

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'


export const config = {unstable_runtimeJS: false}

export default function Main(props: { id: number, post: BlogPost, urlParam: string }) {
    const { id, post } = props
    return <div className={styles.main}>
        <Head>
            <title>mee42.dev | { post.title }</title>
            <meta property="og:site_name" content="Mee42.dev"/>
            <meta property="og:title" content={ post.title } />
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={"https://mee42.dev/blog/" + id+ '#' + post.url}/>
            <meta property="og:description" content={ post.desc }/>
        </Head>


        <Header title={post.title}/>
        <div className={styles.titleBar}>
            <div className={styles.title}>{post.title}</div>
            <div className={styles.info}>
                <div className={styles.author}>{post.author}</div>
                <div className={styles.date}>{post.date}</div>
                <div className={styles.desc}>{post.desc}</div>
            </div>
            {/*TODO add the tags to the blog page anyway*/}
        </div>
        <div className={styles.content + ' ' + styles.post}>
            { render(post.content) }
        </div>
    </div>
}
function render(post: string): JSX.Element {
    const plugins = [];
    const components = {
      code({node, inline, className, children, ...props}) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
          <SyntaxHighlighter
            children={String(children).replace(/\n$/, '')}
            
            language={match[1]}
            PreTag="div"
            {...props}
          />
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        )
      }
    };
    //return <p>todo</p> 
    // @ts-ignore
    return <ReactMarkdown rehypePlugins={[rehypeRaw]} children={post} components={components}/>
//    return <ReactMarkdown 
//                          source={post}
//                          plugins={plugins}
//                          renderers={{ code: CodeBlock }}/>

//    return <p>unimplemented</p>
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
