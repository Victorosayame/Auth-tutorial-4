"use client"

//14.1:verification page,install react spinners

import CardWrapper from "./CardWrapper"
import { BeatLoader } from "react-spinners"
import { useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { useEffect, useState } from "react"
import { newVerification } from "@/actions/verification.actions"
import FormError from "../form-error"
import FormSuccess from "../form-success"

const NewVerificationForm = () => {
    //14.8:for form error and success message
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    //14.2:
    const searchParams = useSearchParams();

    //14.3:get the token by using search params
    const token = searchParams.get("token");

    //14.4:
    const onSubmit = useCallback(() => {
        //14.10: if we have a success or error break the function
        //add succes and error in dependency array
        if(success || error) return

        //14.8:if no token,break the function
        if(!token) {
            setError("Missing token!")
            return;
        }

        //14.7: call the verification server action
        newVerification(token)
        //14.9:display error or success message
          .then((data) => {
            setSuccess(data.success);
            setError(data.error);
          })
          .catch(() => {
            setError("Something went wrong!")
          })
    }, [token, success, error])

    //14.5:we will call useEffect to call onSubmit once
    useEffect(() => {
        onSubmit()
    }, [])
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
        <div className="flex items-center w-full justify-center">
            {!success && !error && (
                <BeatLoader />
            )}
            <FormSuccess message={success}/>
            {/**14.11: if no success show error */}
            {!success && (
                <FormError message={error} />
            )}
        </div>
    </CardWrapper>
  )
}

export default NewVerificationForm