//12.1:to generate tokens and remove existing token if it exists

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { v4 as uuidv4 } from "uuid";
import prisma from "./db";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import crypto from "crypto"

//17.2:create lib to generate the 2fa token
export const generateTwoFactorToken = async (email: string) => {
    //generate the token
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);
    
    if (existingToken) {
        await prisma.twoFactorToken.delete({
            where: { id: existingToken.id }
        })
    }

    //create new 2fa token
    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return twoFactorToken;
}

//15.9:generate token for passowrd reset
export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4()
    //token expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id }
        });
    }
     
    //create passowrd reset token
    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return passwordResetToken;
}

export const generateVerificationToken = async (email: string) => {
    //12.2:we will use uuid to generate the token,install it npm i uuid
    const token = uuidv4();
    //token expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id,
            }
        });
    }

    //generate new existing token
    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return verificationToken
    //12.3:use inside the registeration actions
};

