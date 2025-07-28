"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useSnackbar } from "notistack";
import useSound from "use-sound";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Chrome, Facebook, Eye, EyeOff, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, seterror] = useState<string | null>(null);
  //creates a form object in state, with three fields
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [playError] = useSound("/error.mp3");
  const [playSuccess] = useSound("/success.mp3");

  async function onSubmit(e: React.FormEvent) {
    //stops the browser from reloading on form submit
    e.preventDefault();
    setIsSubmitting(true);

    //clears any previous errors
    seterror(null);

    if (!form.email || !form.password) {
      enqueueSnackbar("Please enter both Email and Password.", {
        variant: "error",
      });
      playError();
      return;
    }

    //calls nextauths credentials authentication flow
    const result = await signIn("credentials", {
      //tells nextauth not to automatically navigate on success or failure
      redirect: false,
      //email and password come from your state
      email: form.email,
      password: form.password,
    });

    if (result?.error) {
      seterror("Invalid email or password");
      enqueueSnackbar("Login Failed!", { variant: "error" });
      playError();
      setIsSubmitting(false);

      return;
    } else {
      playSuccess();
      enqueueSnackbar("Login Successful! ", { variant: "success" });
      router.push("/dashboard"); // Redirect after successful login
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Logo Top-Left */}
        <div className="flex items-center space-x-6 absolute top-4 left-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Search
              className="h-4 w-4 text-white cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>
          <div>
            <button className="cursor-pointer" onClick={() => router.push("/")}>
              <h1 className="text-lg font-bold text-gray-900">Lost & Found</h1>
              <p className="text-xs text-gray-600">Management System</p>
            </button>
          </div>
        </div>

        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-blue-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-blue-600">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-8 py-2">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full lg:hover:ring-0 lg:hover:border-blue-700 bg-white text-black"
                onClick={() => signIn("google")}
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
            {/* Login Form */}
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) =>
                    //if you remove the ...f ,Your form.name and form.password become undefined, so any inputs bound to those keys will break.
                    // ...f takes all the existing keys (name, email, password) and copies them into the new object.
                    // Then you overwrite just email with the latest value.

                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
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
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        password: e.target.value,
                      }))
                    }
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

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="bg-blue-600" />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-blue-700 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
              {error && (
                <p className="flex text-red-600 text-sm justify-center">
                  {" "}
                  {error}
                </p>
              )}
            </form>
            {/* Signup Redirect */}
            <div className="text-center text-sm">
              <Link href="/auth/register">
                <span className="text-blue-600">
                  {"Don't have an account? "}
                </span>
                <Button
                  className="p-0 h-auto font-semibold text-blue-700 hover:text-blue-800"
                  variant="link"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
