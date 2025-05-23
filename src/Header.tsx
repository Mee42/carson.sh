import React from "react";
import styles from "../styles/header.module.scss";
import Head from 'next/head';


export default function Header(props: { title: String | null }) {

    return <header className={styles.header}>
        <Head>
            <html lang={"en-US"}/>

            <title>{props.title === null ? "carson.sh" : "carson.sh | " + props.title}</title>
        </Head>
        <a href="/" className={styles.mainButton}>
            <code>carson.sh</code>
        </a>
        {/*<HeaderElement href="/" title="Home"/>*/}
        {/*<HeaderElement href="/projects" title="Projects"/>*/}
        {/*<HeaderElement href="/blog" title="Blog"/>*/}
        {/*<HeaderElement href="https://github.com/mee42/" title="Github"/>*/}
    </header>
}

function HeaderElement(props: { href: string, title: string }) {
    return <div>
        <div className={styles.withGrow}/>
        {<a href={props.href}>{props.title}</a>}
        <div className={styles.withGrow}/>
        <div className={styles.bottomBorder}/>
    </div>
}


