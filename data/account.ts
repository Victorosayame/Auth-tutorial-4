//21.9:data to fetch the account for modification of settings

import prisma from "@/lib/db"

export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await prisma.account.findFirst({
            where: { userId }
        })

        return account;
    } catch {
        return null
    }
};