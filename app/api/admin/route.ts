//20.7:admin only api route

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server"

export async function GET() {
    //20.9:
    const role = await currentRole();

    //20.10
    if (role === UserRole.ADMIN) {
        return new NextResponse(null, { status: 200 })
    }
    
    return new NextResponse(null, { status: 403 });
}