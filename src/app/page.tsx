"use client";

import Link from "next/link";
import { useState } from "react";
import Article from "./security-auth/articles/article";
import Posts from "./prisma-db/posts/page";
import LoginForm from "./security-auth/auth/login/page";

type ComponentType = "home" | "article" | "posts" | "signin";

export default function Home() {
  const [currentComponent, setCurrentComponent] =
    useState<ComponentType>("home");

  const renderComponent = () => {
    switch (currentComponent) {
      case "article":
        return <Article />;
      case "posts":
        return <Posts />;
      case "signin":
        return <LoginForm />;
    }
  };

  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <h1 className="pt-24 txt-4xl font-medium mb-5 capitalize">Home Page</h1>

      <Link
        href="#"
        className="underline"
        onClick={() => setCurrentComponent("article")}
      >
        Article
      </Link>

      <Link href="#" className="underline">
        Posts
      </Link>

      <Link href="#" className="underline">
        Signin
      </Link>

      {renderComponent()}
    </main>
  );
}
