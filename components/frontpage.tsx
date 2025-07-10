"use client";

import { Button } from "@/components/ui/button";
import { Search, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  //if the user is loggedin then there will be session
  const isLoggedIn = Boolean(session?.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Lost & Found</h1>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Sign In
              </Button>
            </Link>

            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Reuniting People with Their
              <span className="text-blue-600 block text-7xl font-extrabold">
                Lost Belongings
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A comprehensive platform to report, track, and recover lost items.
              Join our community and help make lost items found again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            {!isLoggedIn ? (
              <>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-sm"
                  >
                    Get Started – Sign Up
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-sm bg-transparent"
                  >
                    Already have an account? Sign In
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>

          <div className="pt-8">
            <div className="relative max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8  bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Report Lost Items
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quickly report your lost belongings with detailed
                      descriptions
                    </p>
                  </div>

                  <div className="text-center space-y-2 border-l border-gray-300 pl-3">
                    <div className="w-8 h-8  bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Track & Search
                    </h3>
                    <p className="text-sm text-gray-600">
                      Search through found items and track your reports
                    </p>
                  </div>

                  <div className="text-center space-y-2 border-l border-gray-300 pl-3">
                    <div className="w-8 h-8  bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Get Reunited
                    </h3>
                    <p className="text-sm text-gray-600">
                      Connect with finders and recover your belongings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
