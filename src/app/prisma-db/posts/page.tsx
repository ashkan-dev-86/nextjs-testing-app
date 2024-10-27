import prisma from "@/lib/db";
import Post from "../../components/post/post";
import { PostInsert } from "@/app/components/post-insert/post-insert";

export default async function Posts() {
  const posts = await prisma.post.findMany({
    where: {
      title: {
        endsWith: 'post'
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      title: true,
      published: true
    }
  });

  const postCount: number = await prisma.post.count();

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

      <PostInsert></PostInsert>
    </main>
  );
}
