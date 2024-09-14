"use client"

import { logout } from "@/actions/logout"
import { signOut } from "next-auth/react"

//18.7:reusable logout button

interface LogoutButtonProps {
    children?: React.ReactNode
}

//....personal changes,called signout using signout from next auth react

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const onClick = () => {
        signOut()
    }
    
  return (
    <span onClick={onClick} className="cursor-pointer">
        {children}
    </span>
  )
}
