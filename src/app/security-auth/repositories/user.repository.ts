'use server';

import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { cache } from "react";
import { Role } from "../enums/roles";
import { logger } from "../log/logger";
import { User } from "@prisma/client";

export const fetchExistingUser = cache(async (email: string) => {
    const existingUser: NextResponse = NextResponse.json(await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    }));

    if (existingUser.ok) {
        return existingUser.json();
    }

    throw new Error(existingUser.statusText);
});

export const registerNewUser = cache(async (data: {
    email: string;
    name: string;
    password: string;
    role: Role;
}) => {
    const newUserResponse = NextResponse.json(await prisma.user.create({
        data: {
            email: data.email.toLowerCase(),
            name: data.name,
            password: data.password,
            role: data.role
        }
    }));

    if (newUserResponse.ok) {
        logger.logAuth('register', true, { email: data.email });

        const newUser: User = await newUserResponse.json();

        return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        };
    }

    throw new Error(newUserResponse.statusText);
});