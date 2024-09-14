"use server"

//16.6:actions to verify and change passowrd to new password
import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import { NewPasswordSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db"

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null,) => {
    if (!token) {
        return { error: "Missing token!" }
    }

    //validate fields,server side validation incase front end validation is bypassed
    const validatedFields =  NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    //extract the password from validated fields
    const { password } = validatedFields.data;

    //token validation
    const existingToken = await getPasswordResetTokenByToken(token);

    if(!existingToken) {
        return { error: "Invalid token!" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token expired!" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Email does not exist!"}
    }

    //has new password and update the user
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "Password updated!" }
    
}