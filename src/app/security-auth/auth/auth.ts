import { DefaultSession, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthErrors } from "../enums/auth-errors.enum";
import prisma from "@/lib/db";
import { logger } from "../log/logger";
import { Role } from '../enums/roles';
import { compare, hash } from "bcryptjs";
import { loginSchema, registerSchema } from '../validations/auth';
import { ICreateUserResult, IRegisterUser } from "../models/register-user.model";

// Extend the built-in session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            email: string;
            name: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: string;
        email: string;
        password?: string;
        name: string;
        emailVerified?: Date;
        isActive?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user: User = await authenticateUser(credentials, req.headers?.["x-forwarded-for"] as string);

                if (!!user) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                }

                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            // Handle session updates
            if (trigger === "update" && session) {
                token.role = session.role;
            }

            return token;
        },

        async session({ session, token }) {
            // Add custom claims to session
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }

            return session;
        },

        async signIn({ user, account }) {
            // For OAuth providers, create/update user in database
            if (account?.provider === "google") {
                // Check if user exists in database
                const existingUser: User | null = await getUserByEmail(user.email!);

                // Attach role to user object
                user.role = existingUser?.role || "user";
            }

            return true;
        },
    },

    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.AUTH_SECRET,

    // Security headers
    useSecureCookies: process.env.NODE_ENV === "production",

    // Enable debug in development only
    debug: process.env.NODE_ENV === "development"
};

// Mock functions - replace with actual database queries
async function authenticateUser(credentials: Record<"email" | "password", string>, ip: string): Promise<User> {
    const validatedData = loginSchema.safeParse(credentials);
    if (!validatedData.success) {
        throw new Error(AuthErrors.INVALID_CREDENTIALS_FORMAT);
    }

    const { email, password } = validatedData.data;

    // Rate limiting by email
    const identifier = email.toLowerCase();
    if (!checkRateLimit(identifier)) {
        await logLoginAttempt('login', email, false, ip);
        throw new Error(AuthErrors.TOO_MANY_ATTEMPTS);
    }

    const user: User = await getUserByEmail(email);
    if (!user) {
        // Use timing-safe comparison to prevent user enumeration
        await compare(password, "$2a$10$dummyHashToPreventTimingAttacks");
        await logLoginAttempt('login', email, false, ip);
        throw new Error(AuthErrors.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
        await logLoginAttempt('login', email, false, ip);
        throw new Error(AuthErrors.ACCOUNT_DISABLED);
    }

    if (!user.emailVerified) {
        throw new Error(AuthErrors.EMAIL_NOT_VERIFIED);
    }

    const isPasswordValid: boolean = await compare(password, (user.password || ""));
    if (!isPasswordValid) {
        await logLoginAttempt('login', email, false, ip);
        throw new Error(AuthErrors.INVALID_CREDENTIALS);
    }

    await logLoginAttempt('login', email, true, ip);

    loginAttempts.delete(identifier);

    // Mock response
    return {
        id: "1",
        email: email,
        name: "Test User",
        role: "admin",
        password: "$2a$10$dummyHashToPreventTimingAttacks",
        isActive: true,
        emailVerified: user.emailVerified
    };
}

export async function createUser(user: IRegisterUser): Promise<ICreateUserResult> {
    const validatedData = registerSchema.parse(user);
    const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email.toLowerCase() },
    });

    if (!!existingUser) {
        logger.logAuth('register', false, { email: validatedData.email });

        return {
            success: false,
            error: AuthErrors.EMAIL_EXISTS
        };
    }

    const hashedPassword = await hash(validatedData.password, 10);
    const newUser = await prisma.user.create({
        data: {
            email: validatedData.email.toLowerCase(),
            name: validatedData.name,
            password: hashedPassword,
            role: user.role || Role.USER
        }
    });

    logger.logAuth('register', true, { email: validatedData.email });

    return {
        success: true,
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        }
    };
}

// Rate limiting storage (use Redis in production)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

// Rate limiting helper
function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const attempt = loginAttempts.get(identifier);

    if (!attempt || now > attempt.resetAt) {
        loginAttempts.set(identifier, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 min window
        return true;
    }

    if (attempt.count >= 5) {
        return false; // Max 5 attempts per 15 minutes
    }

    attempt.count++;
    return true;
}

async function logLoginAttempt(
    action: "login" | "logout" | "register" | "password_change" | "password_reset",
    email: string,
    success: boolean,
    ip?: string
): Promise<void> {
    console.log({
        email,
        success,
        ip,
        timestamp: new Date(),
    });

    logger.logAuth(
        action,
        success,
        {
            email,
            ip
        }
    );
}

async function getUserByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { email } });

    return {
        id: user?.id,
        role: !!user ? Role[user.role].toString() : '',
        email: user?.email,
        password: user?.password,
        name: user?.name,
        emailVerified: user?.emailVerified,
        isActive: user?.isActive
    } as User;

    // For demo purposes:
    //   return {
    //     id: "1",
    //     email: "user@example.com",
    //     password: "$2a$10$...", // hashed password
    //     name: "John Doe",
    //     emailVerified: new Date(),
    //     isActive: true,
    //     role: "user",
    //   };
}