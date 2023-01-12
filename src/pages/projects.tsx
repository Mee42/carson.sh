import React, { useState } from "react";

import Header from "../Header"
import styles from '../../styles/projects.module.scss'
import Image from 'next/image'

export const config = {unstable_runtimeJS: false}




type ProjectData = {
	title: string,
	desc: JSX.Element,
	icon: string | JSX.Element,
	alt?: string,
	id: string,
}

const emptyBox = <div style={{width: '100px', height: '100px'}}></div>;


const projects: ProjectData[] = [
	{
		title: "https://carson.sh",
		id: "site",
		desc: <div>
			This website you're reading right now!
		</div>,
		icon: "/favicon.ico",
		alt: "A blue triangle, the favicon",
	},
	{
		title: "Weather Box",
		id: "weather",
		desc: <div>
			A tiny box that tells you the weather and the forcast!
		</div>,
		icon: emptyBox, alt: "an empty square",
	},
	{
		title: "16bit CPU",
		id: "cpu",
		desc: <div>
			A "functional" (in progress) CPU build entirely on breadboards with 74-series logic chips
		</div>,
		icon: emptyBox, alt: "an empty square",
	},
	{
		title: "KSP Control Panel",
		id: "ksp",
		desc: <div>
			A physical rocket cockpit control board to sit below my monitor, to control rockets in Kerbal Space Program with.
		</div>,
		icon: emptyBox, alt: "an empty square",
	},
	{
		title: "Whiteboard bot",
		id: "whiteboard",
		desc: <div>
			A robot to draw arbitrary lines on huge whiteboards with high precision
		</div>,
		icon: emptyBox, alt: "an empty square",
	},
	{
		title: "Xenon",
		id: "xenon",
		desc: <div>
			A compiler built for a custom designed, C-like language that compiled directly to x86_64 assembly
		</div>,
		icon: emptyBox, alt: "an empty square",
	},
	{
		title: "Threeboard",
		id: "threeboard",
		desc: <div>
			A project to build a functional keyboard on a custom designed PCB.
			Firmware built from the ground up on ATSAMD THUMB processors. USB HID code never worked.
		</div>,
		icon: emptyBox, alt: "an empty square",
	},

	
];



export default function Projects() {
	return <div>
		<Header title={"projects"} />
		<div style={{ color: "#000", background: "#fff", height: '100vh', textAlign: 'center', display: 'block' }}>
			<div className={styles.projectBox}>
				{projects.map((it, i) => <Project project={it} key={i}/>)}
			</div>
		</div>
	</div>
}

function Project(props: { project: ProjectData, key: number }): JSX.Element {

	const [visible, setVis] = useState(false);

	return <div key={props.key} onClick={() => setVis(!visible)}>
		<div className={styles.project}> 
			<div className={styles.projectTop}>
				{(typeof props.project.icon) === "string" ? 
					<Image src={props.project.icon as string} alt={props.project.alt} width="100" height="100" style={{ zIndex: 0 }}/>
					: props.project.icon
				}
				<div className={styles.projectContent}>
					<h2>
						{props.project.title}
					</h2>
					{props.project.desc}
				</div>
			</div>
			<div className={styles.projectBottom} id={props.project.id}
				 style={{ display: visible?"block":"none"}}>
				Hello, world!
				this is some text that I wrote! I hope you enjoy
				this is some text that I wrote! I hope you enjoy
				this is some text that I wrote! I hope you enjoy
				this is some text that I wrote! I hope you enjoy
				this is some text that I wrote! I hope you enjoy
				this is some text that I wrote! I hope you enjoy
				this is some text that I wrote! I hope you enjoy
				this is some text that I wrote! I hope you enjoy
			</div>
		</div>
	</div>
}
