"use server"

//14.6: verification actions
import prisma from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if(!existingToken) {
        return { error: "Token does not exist!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired) {
        return { error: "Token has expired!" }
    }

    //find the user we are suppose to validate using this token
    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Email does not exist!" }
    }

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    })

    //we can go ahead and remove the verification token
    await prisma.verificationToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Email verified" }
};