import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <div>
        <h1 className="txt-4xl font-medium mb-5 capitalize">Home Page</h1>
      </div>

      <Link href="/article" className="underline">
        Article
      </Link>

      <Link href="/components/prisma-db/posts" className="underline">
        Posts
      </Link>
    </main>
  );
}
