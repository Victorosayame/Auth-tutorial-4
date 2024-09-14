"use client"

//3.2: create register form

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
import { RegisterSchema } from "@/schemas"
import FormError from "../form-error"
import FormSuccess from "../form-success"
import { register } from "@/actions/register.action"
import { useState, useTransition } from "react"

const RegisterForm = () => {
    //: to disable input field and button when loading
    const [isPending, startTransition] = useTransition();

    //:
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    //:we will define our form
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
        },
      })

      //:
      const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("")
        setSuccess("")
       
        startTransition(() => {
            register(values)
            .then((data) => {
                setError(data.error);
                setSuccess(data.success)
            })
        });
      }

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account? Log in"
      backButtonHref="/auth/login"
      showSocial
    >
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
             className="space-y-6"
            >
                <div className="space-y-4">
                <FormField 
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input 
                                 {...field}
                                 disabled={isPending}
                                 placeholder="bishop js"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                    />

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
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button type="submit" className="w-full"
                disabled={isPending}>
                    Create an account
                </Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

export default RegisterForm