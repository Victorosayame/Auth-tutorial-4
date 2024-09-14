"use server"

import { RegisterSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from "bcryptjs"
import  prisma  from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


//3.3:create register server action
//5.0:install bcrypyjs for hashed password

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    //validate field on the backend where no one can manipulate it
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Invalid fields!"};
    }

    //5.1:after we confirm that field are not valide,then we will extract the validated field
    const { name,  email, password } = validatedFields.data;
    //5.2:hash he password
    const hashedPassword = await bcrypt.hash(password, 12);

    //5.3:confirm an email is not taken
    //6.0:use the reusable user function from data/user.ts
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already in use!"}
    }
     
    //5.4:if no existinguser, create new user
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    //12.3:
    const verificationToken = await generateVerificationToken(email);
    //13.1:TODO:send verification token email
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    )
    

    return {success: "Confirmation email sent!"}
}