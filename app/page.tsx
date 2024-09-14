import LoginButton from "@/components/auth/login-button";
import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-white">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold drop-shadow-md">Auth</h1>
        <p className="text-lg">
          A simple OAuth Server Authentication tutorial
        </p>
        <div>
          {/**22.2:change login mood in login button */}
          <LoginButton asChild>
            <Button variant="default" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
