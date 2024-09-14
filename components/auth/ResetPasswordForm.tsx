"use client"
//15.2:copy the login form and make changes

import CardWrapper from "./CardWrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ResetPasswordSchema } from "@/schemas"
import FormError from "../form-error"
import FormSuccess from "../form-success"
import { resetPassword } from "@/actions/resetpassword.action"
import { useState, useTransition } from "react"

const ResetPasswordForm = () => {

    //: to disable input field and button when loading
    const [isPending, startTransition] = useTransition();

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    //15.4:we will define our form and use resetpasswordschema
    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
          email: "",
        },
      })

      const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
        setError("")
        setSuccess("")
        {/**15.6: call the resetpassword action here */}
        startTransition(() => {
            resetPassword(values)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success)
            })
        });
      }

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input 
                                 {...field}
                                 disabled={isPending}
                                 placeholder="bishopjs@example.com"
                                 type="email"
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
                    Send reset email
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

export default ResetPasswordForm;

//15.7:create password reset token in our prisma schema