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
        const readTimeDiv = $(main.last()).find("div > div > div > div");
        const readTimeText = /(\d{1,}) min read/g.exec(readTimeDiv.text());
        const heading = $(main).find("h3 a").first();
        const headingText = heading.text();
        let headingUrl = heading.attr("href");

        const description = $(main).find("h3 a").last().text();

        if (headingUrl && headingText) {
            headingUrl = headingUrl.replace(/\?source=.*/g, "");
            headingUrl = !headingUrl.startsWith("https://")
                ? `https://medium.com${headingUrl}`
                : headingUrl;

            const articleObj = {
                title: headingText,
                postUrl: headingUrl,
                description,
            };

            if (readTimeText !== null) {
                Object.assign(articleObj, {
                    readTime: parseInt(readTimeText[1]),
                });
            }
            articles.push(articleObj);
        }
    }

    return returnAll
        ? sortPostsByReadTime(articles)
        : sortPostsByReadTime(articles.slice(0, 3));
}

export function constructMediumUrl(topicName: string): string {
    return `https://medium.com/topic/${topicName}`;
}

function sortPostsByReadTime(posts: Post[]): Post[] {
    return posts.sort((a, b) => {
        if (a.readTime && b.readTime) {
            return b.readTime - a.readTime;
        }
        return 1;
    });
}
