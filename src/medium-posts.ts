import {
    APIGatewayEvent,
    APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";
import { constructMediumUrl, getArticlesByUrl } from "./scrape-medium";
import { APIResponse, Post } from "./types";

import { response } from "./util";

let mediumPosts: Post[] | undefined = undefined;
let lastMediumTopic: string | undefined = undefined;

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

    const shouldContinue = query && query["topic"] ? true : false;
    if (!shouldContinue) {
        return response(400, {
            status: 400,
            type: "error",
            message: "Please provide valid medium topic name.",
        });
    }

    try {
        const mediumTopic = query["topic"] as string;
        const url = constructMediumUrl(mediumTopic);
        let posts = [];
        if (mediumPosts && lastMediumTopic === mediumTopic) {
            posts = mediumPosts;
        } else {
            posts = await getArticlesByUrl(url, true);
            mediumPosts = posts;
            lastMediumTopic = mediumTopic;
        }

        return response(200, {
            posts,
        });
    } catch (err) {
        return response(500, {
            status: 500,
            type: "error",
            message: `Sorry, can not get medium posts. ${err}`,
        });
    }
}
