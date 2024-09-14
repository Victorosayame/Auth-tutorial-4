//7.3:we will use this file to trigger the middle ware because by default prisma doesnt work on the edge and in this project we didnt make prisma edge compatible 



import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./schemas"
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs"

export default {
    //9.0:add the credentials login
    providers: [
        //11.0:add github and google provider login
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                //revalidate field again
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    //check if the email passed incredentials provider is connect to any email in the db
                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;

                    //chek if the password match
                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password,
                    );

                    if(passwordMatch) return user;
                }
                return null;
            }
        })
    ],
} satisfies NextAuthConfig