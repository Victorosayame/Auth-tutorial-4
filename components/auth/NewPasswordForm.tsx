"use client"
//16.1:copy the reset password form and make changes

import CardWrapper from "./CardWrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NewPasswordSchema } from "@/schemas"
import FormError from "../form-error"
import FormSuccess from "../form-success"
import { newPassword } from "@/actions/newpassword.action"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

const NewPasswordForm = () => {
    //16.4:
    const searchParams = useSearchParams();

    //16.5:extract token using searchparams from our url
    const token = searchParams.get("token");

    //: to disable input field and button when loading
    const [isPending, startTransition] = useTransition();

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    //16.3:we will define our form and use newpasswordschema
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
          password: "",
        },
      })

      const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("")
        setSuccess("")
        {/**16.7: call the newpassword action here and pass in the token alongside the value */}
        startTransition(() => {
            newPassword(values, token)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success)
            })
        });
      }

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
             className="space-y-6"
            >
                <div className="space-y-4">
                    <FormField 
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Password
                            </FormLabel>
                            <FormControl>
                                <Input 
                                 {...field}
                                 disabled={isPending}
                                 type="password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                    />                   
                </div>
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button type="submit" className="w-full"
                disabled={isPending}>
                    Reset password
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

export default NewPasswordForm;

