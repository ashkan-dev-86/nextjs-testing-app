import { signOut } from "next-auth/react";

export const userSignOut = async (url: string) => await signOut({ redirect: false, callbackUrl: url });