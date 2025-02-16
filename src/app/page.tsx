"use client";

// import Link from "next/link";
// import ErrorBoundary from "./components/error-boundary/error-boundary";
import { useToast } from "./components/toast/toast.hook";

export default function Home() {
  const { showToast } = useToast();

  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <button
        style={{ background: "white", color: "black", marginTop: "15px" }}
        onClick={() =>
          showToast("This is an error message to show toast component", "error")
        }
      >
        Press
      </button>

      {/* <h1 className="pt-24 txt-4xl font-medium mb-5 capitalize">
            Home Page
          </h1>

          <Link href="/article" className="underline">
            Article
          </Link>

          <Link href="/prisma-db/posts" className="underline">
            Posts
          </Link> */}
    </main>
  );
}
