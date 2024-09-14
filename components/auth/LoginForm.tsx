"use client"
//1.2:reusable card wrapper for form

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
import { LoginSchema } from "@/schemas"
import FormError from "../form-error"
import FormSuccess from "../form-success"
import { login } from "@/actions/login.action"
import { useState, useTransition } from "react"
//11.6
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const LoginForm = () => {
    //11.6: pass the account not linked error to the form error field as well
    const searchParams = useSearchParams();

    //23.3:
    const callbackUrl = searchParams.get("callbackUrl");


    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

    //17.7: state to show 2fa input field
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    //2.2: to disable input field and button when loading
    const [isPending, startTransition] = useTransition();

    //2.3:
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    //1.8:we will define our form
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })

      //1.9:call login server action
      const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")
        {/**2.1,2.2,2.3: */}
        startTransition(() => {
          //23.4: then we pass the call back url as the second parameter of the login server action
            login(values, callbackUrl)
            .then((data) => {
              //17.8 TODO:when we add 2fa,nodified to show 2fa field
               if (data?.error) {
                form.reset();
                setError(data.error);
               }

               if (data?.success) {
                form.reset();
                setSuccess(data.success)
               }

               if (data?.twoFactor) {
                setShowTwoFactor(true)
               }
            })
            .catch(() => setError("Something went wrong"));
        });
      }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don,t have an account? Sign up"
      backButtonHref="/auth/register"
      showSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
             className="space-y-6"
            >
                <div className="space-y-4">
                  {/**17.9:modify to show 2fa input field when enabled */}
                  {showTwoFactor && (
                    <FormField 
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>
                              Two Factor Code
                          </FormLabel>
                          <FormControl>
                              <Input 
                               {...field}
                               disabled={isPending}
                               placeholder="123456"
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                    )}
                  />
                  )}
                  {!showTwoFactor && (
                    <>
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
                            {/**15.0: password reset link */}
                            <Button
                              size="sm"
                              variant="link"
                              asChild
                              className="px-0 font-normal"
                            >
                              <Link href="/auth/reset">
                                Forgot password?
                              </Link>
                            </Button>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                    </>
                   )
                  }
                </div>
                <FormError message={error || urlError}/>
                <FormSuccess message={success}/>
                <Button type="submit" className="w-full"
                disabled={isPending}>
                  {/**17.10: modify */}
                    {showTwoFactor ? "Confirm" : "Login"}
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

export default LoginForm