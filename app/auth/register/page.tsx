"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function SignupForm() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Logo Top-Left */}
      <div
        className="absolute top-4 lg:left-12 left-4 flex items-center cursor-pointer gap-2"
        onClick={() => router.push("/")}
      >
        <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-base md:text-lg">
          L
        </span>
        <span className="hidden md:block text-xl md:text-2xl font-bold text-blue-800">
          Lost & Found
        </span>
      </div>

      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-blue-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-blue-600">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8 py-2 bg-white">
          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full hover:bg-blue-50 hover:border-blue-200 bg-white text-black"
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-blue-50 hover:border-blue-200 bg-white text-black"
            >
              Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-blue-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              Create account
            </Button>
          </form>

          {/* Login Redirect */}
          <div className="text-center text-sm">
            <span className="text-blue-600">Already have an account? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-blue-700 hover:text-blue-800"
              onClick={() => router.push("/auth/login")}
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupForm;
