import { cache } from "react";
import { IArticleGet } from "./article.get-model";
import prisma from "@/lib/db";

export const fetchArticles = cache(async (): Promise<IArticleGet[]> => {
    const articles: IArticleGet[] = await prisma.article.findMany({
        select: {
            authorEmail: true,
            title: true,
            content: true
        }
    });

    return articles;
});