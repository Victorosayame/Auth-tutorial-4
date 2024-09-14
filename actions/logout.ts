"use server"

import { signOut } from "@/auth";

//18.2:a logout functionlity which is a combination of a server and client action



export const logout = async () => {
    //if you want to do some server stuff before you logout the user
    await signOut();
};