"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  credentialsSignIn,
  oauthSignIn,
} from "../repositories/signin.repository";
import { SignInResponse } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result: SignInResponse | undefined = await credentialsSignIn({
      email,
      password,
    });

    if (result?.ok) {
      // Authentication successful
      router.push("/article");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button type="submit">Sign In</button>
      </form>

      <button onClick={() => oauthSignIn("google")}>Sign in with Google</button>

      <button onClick={() => oauthSignIn("github")}>Sign in with GitHub</button>
    </>
  );
}
