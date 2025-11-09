import NextAuth from "next-auth";
import { authOptions } from "@/app/security-auth/auth/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };