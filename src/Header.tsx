import React from "react";
import Link from "next/link";
import styles from "../styles/header.module.scss";

export default function Header() {
    return <header className={styles.header}>
        <Link href="/">
            <a className={styles.mainButton}>
                <code>arson.ml</code>
            </a>
        </Link>
        <HeaderElement href="/" title="Home"/>
        <HeaderElement href="/projects" title="Projects"/>
        <HeaderElement href="/blog" title="Blog"/>
        <HeaderElement href="https://github.com/mee42/" title="Github" internalLink={false}/>
    </header>
}

function HeaderElement(props: { href: string, title: string, internalLink?: boolean }) {
    return <div>
        <div className={styles.withGrow}/>
        {props.internalLink ?? true ?  <Link href={props.href}><a>{props.title}</a></Link> : <a href={props.href}>{props.title}</a>}
        <div className={styles.withGrow}/>
        <div className={styles.bottomBorder}/>
    </div>
}


