import NextAuth, { AuthOptions, NextAuthOptions, Session } from "next-auth";
import NextAuthConfig from 'next-auth';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { IUserClaim } from "../models/user";
import { JWT } from "next-auth/jwt";
import { IAuthSession } from "../models/session";
import { loginSchema } from "../validations/auth";

interface IArbitraryAuthOptions {
    callbacks: {
        jwt({ token, user }: { token: JWT; user: IUserClaim }): Promise<JWT>;
        authSession({ session, token }: { session: Session, token: JWT }): Promise<Session>;
    },
    pages: {
        signIn: string;
        signUp: string;
        error: string;
    }
}

type ArbitraryNextAuthOptions = Omit<NextAuthOptions, "callbacks" | "pages"> & IArbitraryAuthOptions;

const authOptions: ArbitraryNextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: (Record<"email" | "password", string> | undefined)): Promise<IUserClaim> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const validation = loginSchema.safeParse(credentials);
                if (!validation.success) {
                    throw new Error("Invalid credentials format");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    emailVerified: user.emailVerified
                }
            }
        })
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        async jwt({ token, user }: { token: JWT; user: IUserClaim }): Promise<JWT> {
            if (user) {
                token.role = (user as IUserClaim).role;
            }

            return token;
        },

        async authSession({ session, token }: { session: IAuthSession, token: JWT }): Promise<Session> {
            if (token) {
                session = {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.sub!,
                        role: token.role as string
                    }
                };
            }

            return session;
        }
    },

    pages: {
        signIn: "/auth/signin",
        signUp: "/auth/signup",
        error: "/auth/error"
    },

    secret: process.env.AUTH_SECRET
};

function transformToNextAuthOptions(arbitraryOptions: ArbitraryNextAuthOptions): NextAuthOptions {
    const { callbacks, pages, ...restOptions } = arbitraryOptions;
    
    return {
        ...restOptions,
        callbacks: {...callbacks, ...authOptions.callbacks},
        pages: {
            signIn: pages.signIn,
            signUp: pages.signUp,
            error: pages.error,
            // Add other NextAuth pages as needed
        }
    };
}

// const getAuthOptions : ArbitraryNextAuthOptions = transformToNextAuthOptions(authOptions);

// export default getAuthOptions;

export default NextAuth(authOptions);