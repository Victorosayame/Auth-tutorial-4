//17.1: data for two factor confirmation

import prisma from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        //get two factor confirmation from db
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
            //no need to use the email or the token here because in our schema we have an actual relation with the user,so we know the confirmation is in the user,so we use the userId directly
            where: { userId }
        });

        return twoFactorConfirmation;
    } catch {
        return null
    }
}