"use client"

import { settings } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SettingsSchema } from "@/schemas"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/use-current-user"
import FormError from "@/components/form-error"
import FormSuccess from "@/components/form-success"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@prisma/client"
import { Switch } from "@/components/ui/switch"

//8.0:
//9.2:add the log out button
//18.0:change to a client component

// import { auth, signOut } from "@/auth"


const SettingsPage = () => {
  //21.18: use use current hook to feel the input field with name
  const user = useCurrentUser();

  //21.16:state to show error and success messages
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  //21.5
  const { update } = useSession();

  //21.4
  const [isPending, startTransition] = useTransition();

  //21.14:define form and build form
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      //21.19:modify using the user we just defined using the hook
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    }
  })

  //21.15
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  }

  //21.3
  // const onClick = () => {
  //   startTransition(() => {
  //     settings({
  //       name: "Something different!"
  //     })
  //     //21.8: use session called once but updates name on every page
  //     .then(() => {
  //       update();
  //     })
  //   })
  // }
   
    // const session = useSession()
    //18.4:
    // const user = useCurrentUser();
    //21.2:create settings page
  return (
    <Card className="sm:w-[600px] w-[450px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Settings</p>
      </CardHeader>
      <CardContent>
        {/* <Button onClick={onClick} disabled={isPending}>
          Update name
        </Button> */}
        {/*21.17:render form element */}
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Bishop Js"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
             />
             {/*20.20: hide this field if is OAuth user */}
             {user?.isOAuth === false && (
              <>
              <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="bishopjs@gmail.com"
                      type="email"
                      disabled={isPending}
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
             />
              <FormField 
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
             />
             </>
            )}
              <FormField 
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>
                        Admin
                      </SelectItem>
                      <SelectItem value={UserRole.USER}>
                        User
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
             />
             {/*20.21: hide this field if is OAuth user */}
             {user?.isOAuth === false && (
             <FormField 
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable two factor authentication for your account
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
             />
            )}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SettingsPage