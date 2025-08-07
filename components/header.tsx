"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Bell,
  LogOut,
  Search,
  Settings,
  User,
  XIcon,
  Menu,
  Home,
  Plus,
  List,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Header() {
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            onClick={() => router.push(item.href)}
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className={`w-full justify-start ${
              item.active
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Plus, label: "Report Lost Item", href: "/report-item" },
    { icon: List, label: "All Lost Items", href: "/lost-item" },
    { icon: User, label: "My Reports", href: "/profile?tab=my-items" },
    { icon: MessageSquare, label: "My Claims", href: "/profile?tab=claims" },
    {
      icon: MessageSquare,
      label: "Claims On My Items",
      href: "/profile?tab=claims-on-items",
    },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const router = useRouter();

  //session will be your full NextAuth session object (or undefined if not signed in)
  //status is one of loading, authenticated or unauthenticated
  const { data: session, status } = useSession();

  //Now that you know session exists, you grab its .user field, which holds { name, email, image, id }.
  const user = session?.user;
  //Provide safe defaults
  //The ?. is optional chaining. It means “if user is non‑null/undefined, read its .name property; otherwise return undefined without throwing an error.”
  //The ?? is the nullish coalescing operator. It returns the thing on its left if it’s neither null nor undefined; otherwise it returns the thing on its right.
  const userName = user?.name ?? "Guest";
  const userEmail = user?.email ?? "";
  const userImage = user?.image ?? "/placeholder.svg?height=32&width=32";

  useEffect(() => {
    if (status !== "authenticated") return;

    async function loadNotification() {
      try {
        const res = await fetch(
          `/api/claims-on-my-items?countOnly=true&reportedby=${session?.user?.id}`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setPendingCount(Number(data.count) || 0);
      } catch (err) {
        console.error("Error loading Notification stats:", err);
      }
    }
    loadNotification();
  }, [session?.user?.id, status]);

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 z-50 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-6">
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
                  <h1 className="text-lg font-bold text-gray-900">
                    Lost & Found
                  </h1>
                  <p className="text-xs text-gray-600">Management System</p>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => router.push("/profile?tab=claims-on-items")}
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userImage} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 z-100"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button
                    className="flex"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button className="flex" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Mobile menu button */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="absolute top-0 right-0"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                </SheetClose>
                <div className="pt-6 h-full">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
