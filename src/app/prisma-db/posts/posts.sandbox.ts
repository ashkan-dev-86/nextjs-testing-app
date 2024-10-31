import { IPost } from "./models/post";
import { IPostInsert } from "./models/post-insert";
import { create } from "./posts.repository";

export class PostSandbox {
    public static async create(post: IPostInsert): Promise<IPost> {
        const insertedPost: IPost = await create(post);
        return insertedPost;
    }
}