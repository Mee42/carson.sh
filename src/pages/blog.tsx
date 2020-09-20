import React, { useState } from "react";
import Header from "../Header";
import styles from "../../styles/blog.module.scss";
import { BlogPost, parsePost } from "../lib/blogParser";
import { GetStaticProps } from 'next'

import fs from 'fs';
import path from 'path';
import Link from "next/link";
import {useRouter} from "next/router";

export default function Blog(props: { blogPosts: BlogPost[] }) {
    return <div>
        <Header/>
        <Body blogPosts={props.blogPosts}/>
    </div>
}


let firstRender: Boolean = true

function Body(props: { blogPosts: BlogPost[] }): JSX.Element {

    const [selected, setSelected] = useState([])
    const router = useRouter()
    if(router.query != undefined && firstRender) {
        console.log("QUERY DEFINED")
        console.log(router.query)
        const initial = router.query.initial as String | undefined
        console.log("initial: " + initial)
        if(initial != undefined) {
            firstRender = false
            console.log("setting initial")
            setSelected(initial.split("|"))
            router.push('/blog/', undefined, { shallow: true,  });
        }
    }
    const toggleSelectedTag = tag => {
        if(selected.indexOf(tag) == -1) {
            setSelected(selected.slice().concat(tag))
        } else {
            setSelected(selected.slice().filter((t) => t != tag))
        }
    }
    return <div className={styles.body}>
        <h3 className={styles.title}>Blog</h3>
        { Selected(selected, toggleSelectedTag) }
        {/*<ul className={styles.cardList}>*/}
            {(() => {
                const filtered = props.blogPosts
                    .filter(post => selected.length === 0 || all(selected, tag => post.tags.indexOf(tag) != -1))
                if(filtered.length == 0) return <span className={styles.filteredOutEverything}>
                    You're filtered out all the posts. Click tags above to remove them as filters
                </span>
                return <ul className={styles.cardList}>
                    { filtered.map(post => <li key={post.id}>{makePostCard(post, toggleSelectedTag)}</li>) }
                </ul>

            }).call(null)}
        {/*</ul>*/}
    </div>
}
function all<T>(array: T[], pred: (T) => boolean): boolean {
    for(const elem of array) {
        if(!pred(elem)) return false;
    }
    return true;
}

function Selected(selected: string[], toggleSelectedTag: (string) => void): JSX.Element {
    // if(selected.length == 0) return <div/>
    return <div className={styles.selected}>
        <span>Selected{selected.length == 0 ? " All" : ": "}</span>
        {
            selected.map((tag, i) => makeTag(i, tag, () => toggleSelectedTag(tag)))
        }
    </div>
}

export function makePostCard(post: BlogPost, toggleSelectedTag: (string) => void): JSX.Element {
    return <Link href={"/blog/" + post.id} key={post.id}>
        <div className={styles.card}>
            <div className={styles.cardTitle}>{post.title}</div>
            <div className={styles.cardDesc}>{post.desc}</div>
            <div style={{marginTop: "10px"}}> { makeTagList(post.tags, toggleSelectedTag) }</div>
        </div>
    </Link>
}
export function makeTagList(tags: string[], handler: (string) => void): JSX.Element {
   return <div className={styles.cardTags}>
        {tags.map((tag, i) => makeTag(i, tag, () => handler(tag)))}
    </div>
}

const tagColor = {
    'kotlin': 'orange',
    'haskell': '#ca49ca',
}

export function makeTag(key: any, name: string, onClick: () => void | null): JSX.Element {
   return <div onClick={e => {
       if(onClick != null) onClick();
       e.stopPropagation();
   }}
               key={key}
               onMouseDown={e => e.stopPropagation()}
               className={styles.tag + ' ' + (onClick == null ? '' : styles.clickableTag)}
               style={{backgroundColor: tagColor[name] ?? 'white', borderColor: tagColor[name] ?? 'black'}}>
       {name}
   </div>
}


export const getStaticProps: GetStaticProps = async (context) => {
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