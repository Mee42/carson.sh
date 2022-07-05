import styles from '../../styles/index.module.scss'
import React from "react";
import Header from "../Header";
import { GetStaticProps } from 'next';
import { getBlogPosts, makePostList } from './blog';
import fs from 'fs';
import { BlogPost } from "../lib/blogParser";

export const config = {unstable_runtimeJS: false}

export default function Main(props: { blogPosts: BlogPost[]}) {
  return <div>
    <Header title={null}/>
    <MainPage blogPosts={props.blogPosts}/>
  </div>
}
function MainPage(props: { blogPosts: BlogPost[] }) {
  return <div className={styles.mainPage}>
    <div className={styles.centerElement}>
      <h1>Carson Graham</h1>
      <div className={styles.sidebarWrapper}>
        <div className={styles.block}/>
        <p>A High School Software Engineer Living in Fairfax Virginia</p>
      </div>
    </div>
    <div className={styles.columnDiv}>
      <Left/>
      <Right blogPosts={props.blogPosts}/>
    </div>
  </div>
}

function Left() {
  return <div className={styles.left}>
    <span>Contact me.</span>
    <div className={styles.linkbox + " " + styles.monospace}>
      <a href="mailto:carson42g@gmail.com">carson42g@gmail.com</a> <br/>
      <a href="https://github.com/mee42">github.com/mee42</a> <br/>
    </div>

    <code className={styles.gpgbox + " " + styles.monospace}>GPG: BB881A11F78A79D93FAB707D67D77A4726CF8D6F</code>
  </div>
}
function Right(props: { blogPosts: BlogPost[]}) {
  const posts = props.blogPosts.filter(x => x.tags.indexOf('unreleased') == -1)
  
  return <div className={styles.right}>
    <span>Recent Blog Posts. <a href={"/blog/"} style={{fontSize: "90%"}}>See More.</a></span>
    { makePostList(posts.slice(0, 3))}
  </div>
}

export const getStaticProps: GetStaticProps = async (context) => {
  const x = await getBlogPosts(fs)
  x.forEach(x => x.content = "")
  return { props: { blogPosts: x } }
}
