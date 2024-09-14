//7.2

// import { auth } from "@/auth"

//7.4:modify our imports to use none edge adapter config features from auth.config file
import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

const { auth } = NextAuth(authConfig)
 
export default auth((req) => {
    //8.1
   const { nextUrl } = req;
   const isLoggedIn = !!req.auth;

   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
   const isAuthRoute = authRoutes.includes(nextUrl.pathname);

   if(isApiAuthRoute) {
    return;
   }

   if(isAuthRoute) {
    if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return;
   }

   if(!isLoggedIn && !isPublicRoute) {
    //23.0:modify middleware for logout redirect,this redirects to where we logged out from
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
        callbackUrl += nextUrl.search;
    }

    //23.1:
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    //23.2:append it in our redirect url

    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
   }

   return;
})

//this will invoke the middleware everywhere,this doesnt protect your routes
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
      ],
  }