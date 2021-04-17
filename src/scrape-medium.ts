import { Categories, Post } from "./types";

const cheerio = require("cheerio");
const axios = require("axios");

const topics = [
    { category: "fitness", url: "https://medium.com/topic/fitness" },
    { category: "mindfullness", url: "https://medium.com/topic/mindfulness" },
    { category: "productivity", url: "https://medium.com/topic/productivity" },
    {
        category: "software-engineering",
        url: "https://medium.com/topic/software-engineering",
    },
    {
        category: "programming",
        url: "https://medium.com/topic/programming",
    },
    {
        category: "javascript",
        url: "https://medium.com/topic/javascript",
    },
];

export async function getMediumCategories(
    printAll: boolean
): Promise<Categories> {
    const categories: Categories = {};

    for (const topic of topics) {
        categories[topic.category] = await getArticlesByUrl(
            topic.url,
            printAll
        );
    }
    return categories;
}

export async function getArticlesByUrl(
    url: string,
    returnAll: boolean
): Promise<Post[]> {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const sections = $("section").get();
    const articles: Post[] = [];

    for (const section of sections) {
        const $section = $(section);
        const main = $section.find("div > section > div > div > div");
        const heading = $(main).find("h3 a").first();
        const headingText = heading.text();
        let headingUrl = heading.attr("href");

        const description = $(main).find("h3 a").last().text();

        if (headingUrl && headingText) {
            // console.log(headingText);
            // console.log(headingUrl);
            // console.log(description);
            // console.log(
            //     "........................................................"
            // );
            headingUrl = headingUrl.replace(/\?source=.*/g, "");
            headingUrl = !headingUrl.startsWith("https://")
                ? `https://medium.com${headingUrl}`
                : headingUrl;
            articles.push({
                title: headingText,
                postUrl: headingUrl,
                description,
            });
        }
        //console.log(section);
    }

    return returnAll ? articles : articles.slice(0, 3);
}

export function constructMediumUrl(topicName: string): string {
    return `https://medium.com/topic/${topicName}`;
}
