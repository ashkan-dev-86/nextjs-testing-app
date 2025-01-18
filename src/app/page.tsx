"use client";

import Link from "next/link";
import { ToastProvider } from "./components/toast/toast.context";
import ToastContainer from "./components/toast/toast";

export default function Home() {
  return (
    <ToastProvider>
      <ToastContainer />

      <main className="flex-1 flex flex-col justify-center items-center">
        <h1 className="pt-24 txt-4xl font-medium mb-5 capitalize">Home Page</h1>

        <Link href="/article" className="underline">
          Article
        </Link>

        <Link href="/prisma-db/posts" className="underline">
          Posts
        </Link>
      </main>
    </ToastProvider>
  );
}
