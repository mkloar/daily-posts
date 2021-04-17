import axios from "axios";
import { Categories, RedditPost } from "./types";

const subreddits = [
    {
        category: "NFL",
        url: "https://www.reddit.com/r/nfl",
    },
    {
        category: "Fitness",
        url: "https://www.reddit.com/r/fitness",
    },
    {
        category: "Natural Bodybuilding",
        url: "https://www.reddit.com/r/naturalbodybuilding",
    },
    {
        category: "Personal Finance",
        url: "https://www.reddit.com/r/personalfinance",
    },
    {
        category: "Documentaries",
        url: "https://www.reddit.com/r/documentaries",
    },
    {
        category: "Programming",
        url: "https://www.reddit.com/r/programming",
    },
];

const hotQuery = "/hot/.json?count=10"; // get 10 HOT posts
const topQuery = "/top/.json?count=10"; // get 10 TOP posts

export async function getRedditCategories(
    allPosts: boolean
): Promise<Categories> {
    const redditPosts: Categories = {};

    for (const subreddit of subreddits) {
        const subRedditPosts = await getRedditPostsByUrl(
            subreddit.url,
            allPosts
        );
        redditPosts[subreddit.category] = subRedditPosts;
    }
    return redditPosts;
}

export async function getRedditPostsByUrl(
    url: string,
    allPosts: boolean
): Promise<RedditPost[]> {
    const posts: RedditPost[] = [];
    const postResponse = await axios.get(`${url}${hotQuery}`);
    const data = postResponse.data.data;
    const postChildren = data.children;

    for (const children of postChildren) {
        const { title, ups, url, permalink, selftext } = children.data;
        posts.push({
            title,
            description: selftext,
            upVotes: ups,
            postUrl: `https://reddit.com${permalink}`,
            url,
        });
    }

    return allPosts
        ? sortPostsByVotesDesc(posts)
        : sortPostsByVotesDesc(posts).slice(0, 3);
}

function sortPostsByVotesDesc(posts: RedditPost[]): RedditPost[] {
    return posts.sort((a, b) => b.upVotes - a.upVotes);
}

export function constructRedditUrl(
    subRedditName: string,
    queryType: RedditQueryType
): string {
    return `https://www.reddit.com/r/${subRedditName}${queryType}`;
}

export enum RedditQueryType {
    TOP = "/top/.json?count=10",
    HOT = "/hot/.json?count=10",
}
