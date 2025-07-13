'use server';

import prisma from "@/lib/db"
import { IPostInsert } from "./models/post-insert";
import { IPost } from "./models/post";
import { cache } from "react";

export const create = async (post: IPostInsert): Promise<IPost> => {
    const insertedPost: IPost = await prisma.post.create({
        data: {
            title: post.title,
            content: post.content
        }
    });

    return insertedPost;
};

export const update = async (post: FormData): Promise<void> => {
    await prisma.post.update({
        where: { id: post.get('id') as string },
        data: {
            title: post.get('title') as string,
            content: post.get('content') as string
        }
    });
};

export const fetchAllPosts = cache(async (): Promise<IPost[]> => {
    const posts: Promise<IPost[]> = prisma.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            title: true,
            published: true,
        },
    });

    return posts;
});

export const fetchEndWithPost = cache(async (): Promise<IPost[]> => {
    const posts: Promise<IPost[]> = prisma.post.findMany({
        where: {
            title: {
                endsWith: "post",
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            title: true,
            published: true,
        },
    });

    return posts;
});

export const getPostCount = cache(async (): Promise<number> => {
    const count: Promise<number> = prisma.post.count();
    return count;
});