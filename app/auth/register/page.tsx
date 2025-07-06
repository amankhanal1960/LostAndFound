"use client";

import { useState } from "react";
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
import { Chrome, Facebook, Eye, EyeOff, Search } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Logo Top-Left */}
      <div className="flex items-center space-x-6 absolute top-4 left-4">
        <div className="p-3 bg-blue-600 rounded-lg">
          <Search
            className="h-4 w-4 text-white cursor-pointer"
            onClick={() => router.push("/dashboard")}
          />
        </div>
        <div>
          <button
            className="cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <h1 className="text-lg font-bold text-gray-900">Lost & Found</h1>
            <p className="text-xs text-gray-600">Management System</p>
          </button>
        </div>
      </div>

      <Card className="w-full max-w-lg">
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
              className="w-full lg:hover:ring-0 lg:hover:border-blue-700 bg-white text-black"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full lg:hover:ring-0 lg:hover:border-blue-700 bg-white text-black"
            >
              <Facebook className="mr-2 h-4 w-4" />
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
                className="lg:focus:ring-0 lg:focus:border-blue-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="lg:focus:ring-0 lg:focus:border-blue-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 lg:focus:ring-0 lg:focus:border-blue-700"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-blue-500" />
                  )}
                </Button>
              </div>
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
