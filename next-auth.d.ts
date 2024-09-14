import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
    //19.5
    isTwoFactorEnabled: boolean;
    //21.10
    isOAuth: boolean;
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}