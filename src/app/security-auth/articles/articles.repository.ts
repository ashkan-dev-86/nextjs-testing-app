'use server';

import { cache } from "react";
import { IArticleGet } from "./article.get-model";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const fetchArticles = cache(async (): Promise<IArticleGet[]> => {
    const articles: NextResponse<IArticleGet[]> = NextResponse.json(await prisma.article.findMany({
        select: {
            authorEmail: true,
            title: true,
            content: true
        }
    }));

    if (articles.status === 200) {
        return articles.json();
    }

    throw new Error(articles.statusText);
});