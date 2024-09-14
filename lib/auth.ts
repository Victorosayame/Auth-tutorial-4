
//19.1:reusable lib for server page to fetch user details

import { auth } from "@/auth"

export const currentUser = async () => {
    const session = await auth();

    return session?.user;
}

//20.3:fetching the role server side
export const currentRole = async () => {
    const session = await auth();

    return session?.user.role;
}