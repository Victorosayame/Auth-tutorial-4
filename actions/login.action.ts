"use server"

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth";
import { z } from "zod"

//2.0:we will create our login server action

//23.5:we will pass the values in our login action as a second value

export const login = async (
    values: z.infer<typeof LoginSchema>,
    callbackUrl?: string | null,
   ) => {
    //validate field on the backend where no one can manipulate it
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Invalid fields!"};
    }

    //9.1:we will call the login function here
    //17.11:we pass in the code to the validated field
    const { email, password, code } = validatedFields.data;

    //12.3:if not verified by email,not authorized to login
    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    //12.4:
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email,);

         //13.2:TODO:send verification token email when login in
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        )

        return { success: "Confirmation email sent!" }
    }

    //17.5:send 2fa code to email
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        //17.11:define 2fa logic, if (code) {logic} else
        if (code) {
            //17.12:verify code
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken) {
                return { error: "Invalid code!" };
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Code expired!" }
            }

            //17.13:remove the 2fa token and create 2fa confirmation so that user can login
            await prisma.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            })

            //17.14:check if we have anexisting confirmation
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if (existingConfirmation) {
                await prisma.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                })
            }

            //17.15
            await prisma.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            });
        } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token,
        );
        
        //this will break the function and give our front end a specific value so we know we have to change the display
        return { twoFactor: true };
       }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            //23.6:we will pass it to the redirect
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        //
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }   
                default:
                    return { error: "Something went wrong!"}
            }
        }
        //throw thw error back,else it will not redirect
        throw error;
    }
}