import { signIn } from "next-auth/react";
import { LoginInput } from "../validations/auth";
import { AuthErrors } from "../enums/auth-errors.enum";

export const credentialsSignIn = async (credentials: LoginInput, callbackUrl = "/article") => {
    const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false, // Set to false to handle redirect manually
        callbackUrl // Where to redirect after success
    });

    if (result?.error) {
      // Authentication failed
      throw new Error(AuthErrors.INVALID_EMAIL_PASSWORD);
    }

    return result;
}

// For OAuth providers (Google, GitHub, etc.)
export const oauthSignIn = async (provider: string, callbackUrl = "/article") => {
    await signIn(provider, { callbackUrl });
}