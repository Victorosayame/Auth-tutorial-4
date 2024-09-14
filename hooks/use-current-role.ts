//20.1:hook to directly fetch the role

import { useSession } from "next-auth/react"


export const useCurrentRole = () => {
    const session = useSession();

    return session.data?.user.role;
}