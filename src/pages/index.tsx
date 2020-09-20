import styles from '../../styles/index.module.scss'
import React from "react";
import Header from "../Header";
import { GetStaticProps } from 'next';
import { getBlogPosts, makePostCard } from './blog';
import fs from 'fs';
import { BlogPost } from "../lib/blogParser";
import {useRouter} from "next/router";

export default function Main(props: { blogPosts: BlogPost[]}) {
  return <div>
    <Header/>
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
    <div className={styles.linkbox}>
      <a href="mailto:carson42g@gmail.com">carson42g@gmail.com</a> <br/>
      <a href="https://github.com/mee42">github.com/mee42</a> <br/>
    </div>

    <code className={styles.gpgbox}>GPG: BB881A11F78A79D93FAB707D67D77A4726CF8D6F</code>
  </div>
}
function Right(props: { blogPosts: BlogPost[]}) {
  const router = useRouter()
  return <div className={styles.right}>
    <span>Latest Post:</span>
    { makePostCard(props.blogPosts[0], tag => {
      router.push('/blog/?initial=' + tag); // go to that page
    }) }

    
  </div>
}

export const getStaticProps: GetStaticProps = async (context) => {
  const x = await getBlogPosts(fs)
  x.forEach(x => x.content = "")
  return {
        props: {
            blogPosts: x
        }
    }
}
