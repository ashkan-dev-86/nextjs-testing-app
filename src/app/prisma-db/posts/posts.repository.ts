'use server';

import prisma from "@/lib/db"
import { IPostInsert } from "./models/post-insert";
import { IPost } from "./models/post";

export const create = async (post: IPostInsert): Promise<IPost> => {
    const insertedPost: IPost = await prisma.post.create({
        data: {
            title: post.title,
            content: post.content
        }
    });

    return insertedPost;
}

export const update = async (post: FormData): Promise<void> => {
    await prisma.post.update({
        where: { id: post.get('id') as string },
        data: {
            title: post.get('title') as string,
            content: post.get('content') as string
        }
    });
}