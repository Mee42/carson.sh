import styles from '../../styles/index.module.scss'
import React, { JSX } from "react";
import Header from "../Header";
import { GetStaticProps } from 'next';
import fs from 'fs';
import {BlogPost, parsePost} from "../lib/blogParser";
import path from "path";

export const config = {unstable_runtimeJS: false}

export default function Main(props: { blogPosts: BlogPost[]}) {
  return <div>
    <Header title={null}/>
    <MainPage blogPosts={props.blogPosts}/>
  </div>
}
function MainPage(props: { blogPosts: BlogPost[] }) {
  return <div className={styles.body}>
    <h1 className={styles.title}>Carson Graham</h1>
    <div className={styles.posts}>
      {(() => {
        const filtered = props.blogPosts
            .filter(post => post.tags.indexOf('unreleased') == -1).reverse()
        if(filtered.length == 0) return <span className={styles.filteredOutEverything}>There doesn't seem to be any posts here</span>
        return makePostList(filtered)

      }).call(null)}
    </div>
  </div>
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

export const getBlogPosts: (any) => Promise<BlogPost[]> = async (fs) => {
  const dir = path.join(process.cwd(), 'posts')
  const posts = fs.readdirSync(dir)
  const result = posts.map((filename: string) => {
    const filepath = path.join(dir, filename)
    return fs.readFileSync(filepath, 'utf8')
  })
  return result.map(parsePost)
}


export const getStaticProps: GetStaticProps = async () => {
  const x = await getBlogPosts(fs)
  x.forEach(x => x.content = "")
  return { props: { blogPosts: x } }
}

