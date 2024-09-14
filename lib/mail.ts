//13.0: use resend for sending of mail,this will be our mail library,install resend


import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

//17.3:create mail utile to get 2fa code
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    //send the mail
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA code: ${token}</p>`
    });
};

//15.10:send password reset email
export const sendPasswordResetEmail = async (email: string, token:string) => {
    //pass the token and stringify it
    const resetLink = `${domain}/auth/new-password?token=${token}`

    
    //send the mail
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    })
}

export const sendVerificationEmail = async (email: string, token: string) => {
    //13.0:generate the confirm link
    //add param for token
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    //send the email
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    });
};


