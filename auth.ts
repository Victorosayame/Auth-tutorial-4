//7.0:

import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/db"
import { getUserById } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { UserRole } from "@prisma/client"
import { getAccountByUserId } from "./data/account"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    //11.4: this we redirect us to our own login page when we input the api/auth/signin,we will always be reidrected to our own custom login page
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    //11.3 automatically populate the email verified field when ever some one create an account with oauth providers
    events: {
        async linkAccount({ user }) {
           await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
           })
        },
    },
    callbacks: {
        //12.5:define a calll back
        async signIn({ user, account}) {
            //12.5 allow OAuth without email verification
            if (account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id)

            //12.5 if the user has not verified do not allow to log in
            if (!existingUser?.emailVerified) return false;
            //17.4 TODO: add 2fa check
            if(existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if(!twoFactorConfirmation) return false;

                //TODO: delete 2fa for next signin
                await prisma.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                });
            }
            return true
        },
        //10:0:add callbacks,this defines our session as we are not using db session
        //we can define different types of call backs
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            //10.2
            if(token.role && session.user) {
                session.user.role = token.role as UserRole;
            }
            //19.4:Extend the the jwt and session to accept if the user has 2fa on or off,so we can render that
            if(session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
            }
            //21.7:assign the name and email manually to change on the front end when updated
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email as string;
                //21.13
                session.user.isOAuth = token.isOAuth as boolean;
            }
            return session;
        },
        //we will use token.sub and pass it to the session call back to provide more details to the session
        async jwt({ token }) {
            //10.1:add role to the user schema,we will extend the section to have access to the new role user
            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;

            //21.11:after we confirm they is a user,we will check if they is an existing account
            const existingAccount = await getAccountByUserId(existingUser.id);
            //21.11....



            token.role = existingUser.role;
            //19.3:Extend the the jwt and session to accept if the user has 2fa on or off,so we can render that
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            //21.6:assign the name and email manually to change on the front end when updated
            token.name = existingUser.name;
            token.email = existingUser.email;
            //21.12:
            token.isOAuth = !!existingAccount;
            return token;
        }
    },

    //7.4:spread the authconfig
    adapter: PrismaAdapter(prisma),
    //:we used the strategy jwt session because we cannot use the database session because that work only on the edge and by default prisma is no edge compatible 
    session: { strategy: "jwt" },
  ...authConfig,
})