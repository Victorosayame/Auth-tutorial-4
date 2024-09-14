"use client"

import { FcGoogle } from "react-icons/fc"
import { Button } from "../ui/button"
import { FaGithub } from "react-icons/fa"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

//1.5: install react icons for our social logins icons
//11.1: we will login in client side

const Social = () => {
  //24.0:also implement callback url to login back the exact page logged out from
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  //11.2: create onclick function
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      //24.1:pass the callback url as second param
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  }
  return (
    <div className="flex items-center w-full gap-x-2">
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={() => onClick("google")}
        >
            <FcGoogle className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={() => onClick("github")}
        >
            <FaGithub className="h-5 w-5" />
        </Button>
    </div>
  )
}

export default Social