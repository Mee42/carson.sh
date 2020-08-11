
export class BlogPost {
    id: number
    title: string
    desc: string
    tags: string[]
    content: string

    constructor(id: number, title: string, desc: string, tags: string[], content: string) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.tags = tags;
        this.content = content;
    }
}


export function parsePost(content: string): BlogPost {
    // assumes it to be in the proper format
    const sections: [string, string][] = content
        .split(new RegExp("^=====>>>>>"))
        .map(x => x.trim())
        .filter(x => x != "")
        .map(x => splitByDelim(x, ':'))
    console.log("sections: " + sections)
    const getSection: (string) => string = s => sections.filter(sec => sec[0] === s)[0][1]
    const headerSection = getSection("header").trim()
    const bodyContent = getSection("content").trim()
    const metadata = parseHeader(headerSection)
    return new BlogPost(
        metadata.id,
        metadata.title,
        metadata.desc,
        metadata.tags,
        bodyContent
    )
}

function splitByDelim(str: string, delim: string): [string, string] {
    const a = str.split(delim)
    console.log("str:" + str);
    return [a[0], a.slice(1).reduce((a,b) => a + delim + b)]
}

function parseHeader(header: string): { id: number, title: string, date: Date, tags: string[], desc: string} {
    const obj = {}
    for (const [key, value] of header.split("\n").map(it => it.trim().split(":", 2).map(it => it.trim()))) {
        obj[key] = value
    }
    return {
        id: parseInt(obj['id']),
        title: obj['title'],
        date: new Date(obj['date']),
        tags: obj['tags'].split(" "),
        desc: obj['desc']
    }
}
