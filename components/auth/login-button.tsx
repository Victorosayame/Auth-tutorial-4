"use client"

import { useRouter } from "next/navigation";

//1.0:we will create the login button

//22.0:implement dialog login
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import LoginForm from "./LoginForm";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect",
    asChild?: boolean
}



const LoginButton = ({children, mode = "redirect", asChild}: LoginButtonProps) => {
    //1.1:
    const router = useRouter();
    const onClick = () => {
        router.push("/auth/login");
    }

    if(mode === "modal") {
        return(
            <Dialog>
                {/*22.1: implement dialog modal */}
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <LoginForm />
                </DialogContent>
            </Dialog>
        )
    }
  return (
    <span className="cursor-pointer" onClick={onClick}>
        {children}
    </span>
  )
}

export default LoginButton