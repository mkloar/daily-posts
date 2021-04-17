import {
    APIGatewayEvent,
    APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";
import { getMediumCategories } from "./scrape-medium";
import { getRedditCategories } from "./scrape-reddit";
import { APIResponse, Categories, PostResponse } from "./types";

import { response } from "./util";

let mediumPosts: Categories | undefined = undefined;
let redditPosts: Categories | undefined = undefined;

export async function handler(event: APIGatewayEvent): Promise<APIResponse> {
    const query: APIGatewayProxyEventQueryStringParameters | null =
        event.queryStringParameters;
    const allPosts = query && query["all"] ? true : false;

    let postResponse: PostResponse = {
        medium: {},
        reddit: {},
    };

    if (mediumPosts && redditPosts) {
        postResponse = {
            medium: mediumPosts,
            reddit: redditPosts,
        };
    } else {
        mediumPosts = await getMediumCategories(allPosts);
        redditPosts = await getRedditCategories(allPosts);
        // cache posts?
        postResponse = {
            medium: mediumPosts,
            reddit: redditPosts,
        };
    }

    return response(200, postResponse);
}
