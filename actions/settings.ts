"use server"

import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { SettingsSchema } from "@/schemas"
import bcrypt from "bcryptjs"
import { z } from "zod"

//21.1:server action for settingspage schema


export const  settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" }
    }

    //21.20:modify to handle front end changes when we make a change in our settings page
    //we will check if current user is logged in using oauth or credentials
    if (user.isOAuth) {
        //field will be undefined because oauth user should not be able to change or modify email or password or 2fa
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    //21.22:logic for if user is trying to update thier email
    if (values.email && values.email !== user.email) {
        //check if the user is trying to update email to a new email and it's not used by anoter user
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use!" }
        }

        const verificationToken = await generateVerificationToken(
            values.email
        );
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return { success: "Verification email sent!" }
    }

    //21.23:logic for if user is trying to update thier password
    if (values.password && values.newPassword && dbUser.password) {
        //we check if they have entered a correct password
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        );

        if (!passwordMatch) {
            return { error: "Incorrect password!" }
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 12);
        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    await prisma.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        }
    });

    return { success: "Settings Updated!" }
}