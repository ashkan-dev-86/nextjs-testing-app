"use client";

import { InternalSwitch } from "@/contexts/router.context";
import Article from "./security-auth/articles/page";
import Sidebar from "./components/sidebar/sidebar";
import Dashboard from "./components/dashboard";
import Posts from "./prisma-db/posts/page";
import LoginForm from "./security-auth/auth/login/page";
import RegisterForm from "./security-auth/auth/registration/page";

export default function Home() {
  return (
    <>
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <InternalSwitch
          routes={[
            { path: "/", component: Dashboard },
            { path: "/articles", component: Article },
            { path: "/posts", component: Posts },
            { path: "/login", component: LoginForm },
            { path: "/signup", component: RegisterForm },
          ]}
        />
      </main>
    </>
  );
}
