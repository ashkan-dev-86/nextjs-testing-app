import { IPost } from "../../prisma-db/posts/models/post";
import Link from "next/link";

export default function Post({ post }: { post: IPost }) {
  return (
    <Link href={`/components/post/${post.id}`}>
      {post.title}
    </Link>
  );
}
