declare class InnerPost {
    post: string;
}
declare class PostGroup {
    list: InnerPost[];
}
export declare class CreateGeneratedPostsDto {
    posts: PostGroup[];
    week: number;
    year: number;
    url: string;
    postId: string;
}
export {};
