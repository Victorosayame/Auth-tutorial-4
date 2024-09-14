"use client"

import { admin } from "@/actions/admin";
import RoleGate from "@/components/auth/role-gate";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role"
import { currentRole } from "@/lib/auth"
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

//20.0:create admin page

const AdminPage =  () => {
    //20.2:get the role client side
    // const role = useCurrentRole();
    //20.4:get the role server side
    // const role = await currentRole();

    //20.13:
    const onServerActionClick = () => {
        admin()
          .then((data) => {
            if (data.error) {
                toast.error(data.error)
            }

            if (data.success) {
                toast.success(data.success)
            }
          })
    }

    //20.8:
    const onApiRouteClick = () => {
        fetch("/api/admin")
         .then((response) => {
            if(response.ok) {
                //20.11
                toast.success("Allowed API Route")
            } else {
                toast.error("Forbidden API Route")
            }
         })
    }

  return (
    <Card className="sm:w-[600px] w-[450px]">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">
                Admin
            </p>
        </CardHeader>
        <CardContent className="space-x-4">
            <RoleGate allowedRole={UserRole.ADMIN}>
                <FormSuccess message="You are allowed to see this content!"/>
            </RoleGate>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                <p className="text-sm font-medium">
                    Admin-only API Route
                </p>
                <Button onClick={onApiRouteClick}>
                    Click to test
                </Button>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                <p className="text-sm font-medium">
                    Admin-only Server Action
                </p>
                <Button onClick={onServerActionClick}>
                    Click to test
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default AdminPage