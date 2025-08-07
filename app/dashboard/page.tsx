"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Home,
  Plus,
  List,
  User,
  Settings,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { SkeletonStatsCard } from "@/components/ui/skeleton";

interface DashboardStats {
  reportedCount: number;
  activeClaimsCount: number;
  successfulReturnsCount: number;
}

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    reportedCount: 0,
    activeClaimsCount: 0,
    successfulReturnsCount: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Fixed: should be boolean, not string

  const user = session?.user;
  const userName = user?.name ?? "Guest";
  const userImage = user?.image ?? "/placeholder.svg?height=32&width=32";

  const sidebarItems: SidebarItem[] = [
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
    { icon: Settings, label: "Settings", href: "/not-found" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <nav className="flex-1 p-6 space-y-1">
        {sidebarItems.map((item) => (
          <Button
            onClick={() => router.push(item.href)}
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className={`w-full justify-start h-11 ${
              item.active
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
            <AvatarImage src={userImage || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {userName}
            </p>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-xs text-gray-600">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const StatsCard = ({
    title,
    value,
    description,
    color,
    trend,
    Onclick,
  }: {
    title: string;
    value: number;
    description: string;
    color: string;
    trend?: string;
    Onclick: () => void;
  }) => (
    <Card
      className="border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm"
      onClick={Onclick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div
                className={`lg:w-3 lg:h-3 w-2 h-2 ${color} rounded-full`}
              ></div>
              <p className="lg:text-xl text-sm font-medium text-gray-700">
                {title}
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="lg:text-lg text-sm text-gray-600">{description}</p>
            {trend && (
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>{trend}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({
    title,
    description,
    buttonText,
    buttonColor,
    icon: Icon,
    iconColor,
    onClick,
  }: {
    title: string;
    description: string;
    buttonText: string;
    buttonColor: string;
    icon: LucideIcon;
    iconColor: string;
    onClick: () => void;
  }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200/60 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-gray-300">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex items-start space-x-4 sm:space-x-6">
          <div
            className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${iconColor} group-hover:scale-105 transition-transform duration-200`}
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="flex-1 space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {description}
              </p>
            </div>
            <Button
              size="sm"
              className={`${buttonColor} text-white shadow-sm`}
              onClick={onClick}
            >
              {buttonText}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    async function loadStats() {
      try {
        setLoading(true); // Set loading to true at start
        setError(null);

        const res = await fetch("/api/dashboard/summary");

        if (!res.ok) {
          throw new Error(`Failed to fetch stats: ${res.status}`);
        }

        const json = await res.json();

        setStats({
          reportedCount: json.reportedCount || 0,
          activeClaimsCount: json.activeClaimsCount || 0,
          successfulReturnsCount: json.successfulReturnsCount || 0,
        });
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setLoading(false); // Always set loading to false in finally block
      }
    }

    loadStats();
  }, [status]);

  // Unauthenticated state
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <Header />
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 backdrop-blur-sm border-r border-gray-200/60">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <SidebarContent />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:p-8 px-6 py-4 space-y-10 min-h-screen">
          {/* Welcome Section */}
          <div className="py-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Welcome back, <span className="text-blue-700">{userName}</span>
            </h1>
            <p className="text-lg max-w-2xl text-gray-600">
              Ready to help reunite lost items with their owners?
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-600">
                  Error loading dashboard data: {error}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map((i) => <SkeletonStatsCard key={i} />)
            ) : (
              <>
                <StatsCard
                  title="My Reports"
                  value={stats.reportedCount}
                  description="Items you've reported"
                  color="bg-blue-500"
                  Onclick={() => router.push("/profile?tab=my-items")}
                />
                <StatsCard
                  title="Active Claims"
                  value={stats.activeClaimsCount}
                  description="Items awaiting response"
                  color="bg-amber-500"
                  Onclick={() => router.push("/profile?tab=claims-on-items")}
                />
                <StatsCard
                  title="Successful Returns"
                  value={stats.successfulReturnsCount}
                  description="Items successfully returned"
                  color="bg-green-500"
                  Onclick={() => router.push("/profile?tab=claims-on-items")}
                />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Quick Actions
              </h2>
              <p className="text-gray-600 text-lg">
                Get started with these common tasks!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <QuickActionCard
                title="Report Item"
                description="Lost or found something? Report it here and let the community know about it."
                buttonText="Report Now"
                buttonColor="bg-blue-600 hover:bg-blue-700"
                icon={Plus}
                iconColor="from-blue-50 to-blue-100 border-blue-200 text-blue-600"
                onClick={() => router.push("/report-item")}
              />

              <QuickActionCard
                title="Browse Found Items"
                description="Check if someone has found your lost item or help others by claiming found items."
                buttonText="Browse Found Items"
                buttonColor="bg-green-600 hover:bg-green-700"
                icon={Search}
                iconColor="from-green-50 to-green-100 border-green-200 text-green-600"
                onClick={() => router.push("/found-item")}
              />

              <QuickActionCard
                title="View Lost Items"
                description="See all lost reports in your area and help reunite items with owners."
                buttonText="Browse Lost Items"
                buttonColor="bg-blue-600 hover:bg-blue-700"
                icon={List}
                iconColor="from-blue-50 to-blue-100 border-blue-200 text-blue-600"
                onClick={() => router.push("/lost-item")}
              />

              <QuickActionCard
                title="My Profile"
                description="View your profile and manage your claims and communications with other users."
                buttonText="Profile"
                buttonColor="bg-purple-600 hover:bg-purple-700"
                icon={MessageSquare}
                iconColor="from-purple-50 to-purple-100 border-purple-200 text-purple-600"
                onClick={() => router.push("/profile?tab=claims")}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
