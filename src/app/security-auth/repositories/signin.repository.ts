import { signIn } from "next-auth/react";
import { LoginInput } from "../validations/auth";

export const credentialsSignIn = async (credentials: LoginInput) => {
    const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false, // Set to false to handle redirect manually
    });

    return result;
}

// For OAuth providers (Google, GitHub, etc.)
export const oauthSignIn = async (provider: string) => {
    await signIn(provider, { redirect: false });
}