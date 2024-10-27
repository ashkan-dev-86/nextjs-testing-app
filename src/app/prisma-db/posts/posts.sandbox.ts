import { IPost } from "./models/post";
import { IPostInsert } from "./models/post-insert";
import { create } from "./posts.repository";

export class PostSandbox {
    public static async create(post: IPost): Promise<IPost> {
        const postInsert: IPostInsert= {
            title: post.title,
            content: post.content as string
        };

        const insertedPost: IPost = await create(postInsert);
        return insertedPost;
    }
}