//1.3

"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Header from "./Header";

import BackButton from "./BackButton";
import Social from "./Social";
  

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean
}

const CardWrapper = ({ children, headerLabel, backButtonLabel, backButtonHref, showSocial}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
        <CardHeader>
            <Header
             label={headerLabel}
             />
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        {showSocial && (
            <CardFooter>
                <Social />
            </CardFooter>
        )}
        <CardFooter>
          <BackButton 
            label={backButtonLabel}
            href={backButtonHref}
          />
        </CardFooter>
    </Card>
  )
}

export default CardWrapper