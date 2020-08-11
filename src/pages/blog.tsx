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



// const blogPostsX: BlogPost[] = [
//     new BlogPost(
//         1,
//         "First Blog Post!",
//         "This is going to be used for testing the UI till I write some better posts",
//         ["kotlin", "haskell", "robotics"]
//     ),
//     new BlogPost(
//         2,
//         "Second Post :D",
//         "This is some additional content that describes the post",
//         ["kotlin"]
//     )
// // ]

function Body(props: { blogPosts: BlogPost[] }): JSX.Element {
    const [selected, setSelected] = useState(["kotlin"])
    const toggleSelectedTag = tag => {
        if(selected.indexOf(tag) == -1) {
            setSelected(selected.slice().concat(tag))
        } else {
            setSelected(selected.slice().filter((t) => t != tag))
        }
    }
    return <div className={styles.body}>
        <span>{ props.blogPosts }</span>
        <h3 className={styles.title}>Blog</h3>
        { Selected(selected, toggleSelectedTag) }
        <ul className={styles.cardList}>
            {
                // blogPosts
                //     .filter(post => selected.length === 0 || all(selected, tag => post.tags.indexOf(tag) != -1))
                //     .map(post => <ul key={post.id}>{makePostCard(post, toggleSelectedTag)}</ul>)
            }
        </ul>
    </div>
}
function all<T>(array: T[], pred: (T) => boolean): boolean {
    for(const elem of array) {
        if(!pred(elem)) return false;
    }
    return true;
}

function Selected(selected: string[], toggleSelectedTag: (string) => void): JSX.Element {
    if(selected.length == 0) return <div/>
    return <div className={styles.selected}>
        <span>Selected: </span>
        {
            selected.map((tag, i) => makeTag(i, tag, () => toggleSelectedTag(tag)))
        }
    </div>
}

function makePostCard(post: BlogPost, toggleSelectedTag: (string) => void): JSX.Element {
    return <div className={styles.card} key={post.id}>
        <div className={styles.cardTitle}>{post.title}</div>
        <div className={styles.cardDesc}>{post.desc}</div>
        {<div className={styles.cardTags}>
            {post.tags.map((tag, i) => makeTag(i, tag, () => toggleSelectedTag(tag)))}
        </div>}
    </div>
}

const tagColor = {
    'kotlin': 'orange',
    'haskell': '#ca49ca',
}

function makeTag(key: any, name: string, onClick: () => void | null): JSX.Element {
   return <div onClick={() => onClick != null && onClick()} key={key} className={styles.tag + ' ' + (onClick == null ? '' : styles.clickableTag)} style={{backgroundColor: tagColor[name] ?? 'white', borderColor: tagColor[name] ?? 'black'}}>{name}</div>
}


export const getStaticProps: GetStaticProps = async (context) => {
    const dir = path.join(process.cwd(), 'posts')
    const posts = fs.readdirSync(dir)
    const result = posts.map(filename => {
        const filepath = path.join(dir, filename)
        return fs.readFileSync(filepath, 'utf8')
    })
    return {
      props: {
          blogPosts: result.map(parsePost)
      }
  }
}