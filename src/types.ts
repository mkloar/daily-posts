export type APIResponse = {
    headers: { [key: string]: string | boolean | number };
    statusCode: number;
    body: string;
};

export type PostResponse = {
    [source in "reddit" | "medium"]: Categories;
};

export type Categories = {
    [key: string]: Post[] | RedditPost[];
};

export type Posts = {
    source: "reddit" | "medium";
    category: string;
    posts: Post[] | RedditPost[];
};

export interface Post {
    title: string;
    description: string;
    postUrl: string;
}

export interface RedditPost extends Post {
    url: string;
    upVotes: number;
}
