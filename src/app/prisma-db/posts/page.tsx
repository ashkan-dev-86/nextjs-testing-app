'use client';

import Post from "../../components/post/post";
import { PostInsert } from "@/app/components/post-insert/post-insert";
import { useMemo, useState } from "react";
import { IPost } from "./models/post";
import { fetchEndWithPost, getPostCount } from "./posts.repository";

export default function Posts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postCount, setCount] = useState<number>(0);
  const [newPost, setNewPost] = useState<IPost>({
    content: "",
    title: "post",
    published: true,
  });

  useMemo(async (): Promise<void> => {
    if (!!newPost) {
      const posts = await fetchEndWithPost();

      setPosts(posts);

      const postCount: number = await getPostCount();
      setCount(postCount);
    }
  }, [newPost]);

  const postsUpdated = (post: IPost) => {
    setNewPost(post);
  };

  return (
    <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
      <h1 className="text-3xl font-semibold">All posts ({postCount})</h1>

      <ul className="border-t border-b border-gray/10 py-5 leading-8">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between px-5">
            <Post post={post} />
          </li>
        ))}
      </ul>

      <PostInsert postInserted={postsUpdated}></PostInsert>
    </main>
  );
}
