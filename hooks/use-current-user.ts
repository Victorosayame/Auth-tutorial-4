//18.3:hooks to fetch user details

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const session = useSession();

    return session.data?.user
}