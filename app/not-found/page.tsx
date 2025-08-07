"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  Construction,
  Home,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* Error Code */}
          <div className="space-y-2">
            <div className="text-8xl font-bold text-gray-800 select-none">
              404
            </div>
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
              <Construction className="size-5" />
              <span className="text-lg font-semibold">Under Construction</span>
              <Construction className="size-5" />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-800">
              Page Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              The page you&apos;re looking for is currently under development.
              Our engineers are working hard to bring you something amazing.
            </p>
          </div>

          {/* Technical Details */}
          <div className="bg-slate-100 rounded-lg p-4 text-left space-y-2 text-slate-700">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-sm">
              <AlertTriangle className="size-4 text-amber-500" />
              <span className="text-slate-700">Status: Resource not found</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-sm">
              <RefreshCw className="size-4 text-blue-500" />
              <span className="text-slate-700">Expected completion: Soon™</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-sm">
              <Construction className="size-4 text-orange-500" />
              <span className="text-slate-700">
                Development status: In progress
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild className="gap-2">
              <Link href="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
          </div>

          {/* Footer Message */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              If you believe this is an error, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
