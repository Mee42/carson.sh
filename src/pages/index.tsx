import styles from '../../styles/index.module.scss'
import React from "react";
import Header from "../Header"

export default function Main() {
  return <div>
    <Header/>
    <MainPage/>
  </div>
}
function MainPage() {
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
      <Right/>
    </div>
  </div>
}

function Left() {
  return <div className={styles.left}>
    {/*carson@arson.ml <br/>*/}
    <div className={styles.linkbox}>
      <a href="mailto:graham.@arson.ml">graham@c.arson.ml</a> <br/>
      <a href="mailto:carson42g@gmail.com">carson42g@gmail.com</a> <br/>
      <a href="https://github.com/mee42" style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center', display: 'flex'}}>
        <img width="30px" src="GitHub-Mark.png" alt="the github logo"/>
        <span>mee42</span>
      </a> <br/>
    </div>

    <code className={styles.gpgbox}>GPG: BB881A11F78A79D93FAB707D67D77A4726CF8D6F</code>
  </div>
}
function Right() {
  return <div className={styles.right}>
    cool stuff I'm currently working on (?)
    chat (????)

    {/*{{ test }}*/}
  </div>
}