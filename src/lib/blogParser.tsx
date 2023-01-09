



export type BlogPost = {
    id: number,
    title: string,
    desc: string,
    tags: string[],
    content: string,
    url: string,
    date: string
}


export function parsePost(content: string): BlogPost {
    // assumes it to be in the proper format
    const sections: [string, string][] = content
        .split(new RegExp("=====>>>>>"))
        .map(x => x.trim())
        .filter(x => x != "")
        .map(x => splitByDelim(x, '\n')) //l will need to be changed to the target platform :vomit:

    const getSection: (string) => string = 
        s => sections.filter(sec => sec[0] === s)[0][1]
    
    const headerSection = getSection("header").trim()
    const bodyContent = getSection("content").trim()
    const metadata = parseHeader(headerSection)
    return {
        id: metadata.id,
        title: metadata.title,
        desc: metadata.desc,
        tags: metadata.tags,
        url: metadata.url,
        date: metadata.date,
        content: bodyContent
    }
}

function splitByDelim(str: string, delim: string): [string, string] {
    const a = str.split(delim)
    //console.log("str:" + str);
    return [a[0], a.slice(1).reduce((a,b) => a + delim + b, "")]
}

function parseHeader(header: string): { id: number, title: string, date: string, tags: string[], desc: string, url: string} {
    const obj = {}
    for (const [key, value] of header.split("\n").map(it => it.trim().split(":", 2).map(it => it.trim()))) {
        obj[key] = value
    }
    return {
        id: parseInt(obj['id'] ?? error("can't find post id")),
        title: obj['title'] ?? error("can't find post title"),
        date: obj['date'] ?? error("can't find post date"),
        tags: obj['tags']?.split(" ") ?? error("can't find post tags"),
        desc: obj['desc'] ?? error("can't find post desc"),
        url: obj['url'] ?? 'there-is-no-url-desc-yet'
    }
}

function error(error: string): never {
    throw new Error(error)
}
