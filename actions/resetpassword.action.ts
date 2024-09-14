"use server"

//15.5: define reset password server actions

import { ResetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { z } from "zod";

export const resetPassword = async (values: z.infer<typeof ResetPasswordSchema>) => {
    //validate fields,server side validation incase front end validation is bypassed
    const validatedFields =  ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" }
    }

    //extract the email from validated field
    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email not found!" };
    }

    //TODO:Generate token and send email
    //15.11
    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token,
    );

    return { success: "Reset email sent!" }
}