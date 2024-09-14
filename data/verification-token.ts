//12.0: resuable verification token data

import prisma from "@/lib/db";


//12.0: add verification schema in prisma schema and define resuable data for email verification
export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        return verificationToken;
    } catch  {
        return null;
    }
}


//12.0: add verification schema in prisma schema and define resuable data for email verification
export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { email }
        });

        return verificationToken;
    } catch {
        return null;
    }
}