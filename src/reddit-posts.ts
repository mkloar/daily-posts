import {
    APIGatewayEvent,
    APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";
import {
    constructRedditUrl,
    getRedditPostsByUrl,
    RedditQueryType,
} from "./scrape-reddit";
import { APIResponse, Categories, RedditPost } from "./types";

import { response } from "./util";

let redditPosts: RedditPost[] | undefined = undefined;
let lastSubRedditName: string | undefined = undefined;

export async function handler(event: APIGatewayEvent): Promise<APIResponse> {
    const query: APIGatewayProxyEventQueryStringParameters | null =
        event.queryStringParameters;

    if (query === null) {
        return response(400, {
            status: 400,
            type: "error",
            message: "Please provide query params.",
        });
    }

    const shouldContinue = query && query["subReddit"] ? true : false;
    if (!shouldContinue) {
        return response(400, {
            status: 400,
            type: "error",
            message: "Please provide valid sub reddit name.",
        });
    }

    try {
        const subRedditName = query["subReddit"] as string;
        const url = constructRedditUrl(subRedditName, RedditQueryType.HOT);
        let posts = [];
        if (redditPosts && lastSubRedditName === subRedditName) {
            posts = redditPosts;
        } else {
            posts = await getRedditPostsByUrl(url, true);
            redditPosts = posts;
            lastSubRedditName = subRedditName;
        }

        return response(200, {
            posts,
        });
    } catch (err) {
        return response(500, {
            status: 500,
            type: "error",
            message: `Sorry, can not get reddit posts. ${err.message}`,
        });
    }
}
