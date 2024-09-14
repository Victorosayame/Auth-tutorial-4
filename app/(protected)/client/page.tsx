"use client"

//19.6:create client page

import { auth } from "@/auth"
import { UserInfo } from "@/components/user.info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { currentUser } from "@/lib/auth"

const ClientPage =  () => {
    // const session = await auth();
    const user =  useCurrentUser();

  return (
    <UserInfo 
      user={user}
      label="Client component"
    />
  )
}

export default ClientPage;