"use client";

import Link from "next/link";
import { useShallowRouter } from "@/app/hooks/shallow-router";

export default function Home() {
  const { push } = useShallowRouter();

  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <h1 className="pt-24 txt-4xl font-medium mb-5 capitalize">Home Page</h1>

      <button
        type="button"
        className="text-indigo-600 hover:text-indigo-700 font-medium text-white py-2 px-4 rounded-md bg-indigo-500 hover:bg-indigo-600 transition duration-300 ease-in-out"
        onClick={() => push("/security-auth/articles/article")}
      >
        Article
      </button>

      {/* <Link href="/article" className="underline">
        Article
      </Link> */}

      <Link href="/prisma-db/posts" className="underline">
        Posts
      </Link>

      <Link href="/security-auth/auth/login" className="underline">
        Signin
      </Link>
    </main>
  );
}
