//17.0:create two factor data

import prisma from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        //get the two factor token from db
        const twoFactorToken = await prisma.twoFactorToken.findUnique({
            where: { token }
        });

        return twoFactorToken;
    } catch {
        return null
    }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        //get the two factor token from db
        const twoFactorToken = await prisma.twoFactorToken.findFirst({
            where: { email }
        });

        return twoFactorToken;
    } catch {
        return null
    }
};