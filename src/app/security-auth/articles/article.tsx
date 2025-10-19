"use client";

import { fetchArticles } from "./articles.repository";
import { IArticleGet } from "./article.get-model";
import { useEffect, useState } from "react";

export default function Article() {
  const [data, setData] = useState<IArticleGet[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data: IArticleGet[] = await fetchArticles();
        setData(data);
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "An error occurred"
        );
      }
    };

    loadData();
  }, []);

  return (
    <main className="flex-1 flex flex-col justify-center items-center max-w-[800px] mx-auto px-10 text-center">
      <h1 className="text-4xl font-medium mb-5 capitalize">Article</h1>

      {data && data[0].content}
    </main>
  );
}
