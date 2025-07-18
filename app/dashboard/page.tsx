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
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return null;
  }

  const user = session?.user;
  const userName = user?.name ?? "Guest";
  const userImage = user?.image ?? "/placeholder.svg?height=32&width=32";

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Plus, label: "Report Lost Item", href: "/report-item" },
    { icon: List, label: "All Lost Items", href: "/lost-item" },
    { icon: User, label: "My Reports", href: "/my-reports" },
    { icon: MessageSquare, label: "My Claims", href: "/my-claims" },
    { icon: Settings, label: "Settings", href: "/settings" },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-blue-50">
      {/* Fixed Header */}
      <Header />
      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 bg-gradient-to-br from-blue-50 via-white to-indigo-50 backdrop-blur-sm border-r border-gray-200/60">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <SidebarContent />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:p-8 px-6 py-4 space-y-10 min-h-screen">
          {/* Welcome Section - Blue theme only here */}
          <div className="py-4">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Welcome back, <span className="text-blue-700">{userName} </span>
            </h1>
            <p className="text-lg max-w-2xl">
              Ready to help reunite lost items with their owners?
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-700">
                        My Reports
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">5</p>
                    <p className="text-sm text-gray-600">
                      Items you&apos;ve reported
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>25% from last month</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-700">
                        Active Claims
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">3</p>
                    <p className="text-sm text-gray-600">
                      Items awaiting response
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <MessageSquare className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-700">
                        Successful Returns
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">
                      Items successfully returned
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>15% from last month</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Quick Actions
            </h2>
            <p className="text-gray-600 text-lg">
              Get started with these common tasks
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Card 1 */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200/60 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-gray-300">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 group-hover:scale-105 transition-transform duration-200">
                      <Plus className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                          Report Item
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          Lost or found something? Report it here and let the
                          community know about it.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        onClick={() => router.push("/report-item")}
                      >
                        Report Now
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200/60 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-gray-300">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 group-hover:scale-105 transition-transform duration-200">
                      <Search className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                          Browse Found Items
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          Check if someone has found your lost item or help
                          others by claiming found items.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                        onClick={() => router.push("/found-item")}
                      >
                        Browse Items
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200/60 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-gray-300">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 group-hover:scale-105 transition-transform duration-200">
                      <List className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                          View Lost Items
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          See all lost reports in your area and help reunite
                          items with owners.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        onClick={() => router.push("/lost-item")}
                      >
                        View All
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200/60 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-gray-300">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 group-hover:scale-105 transition-transform duration-200">
                      <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
                    </div>
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                          My Profile
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          View your profile and manage your claims and
                          communications with other users.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                        onClick={() => router.push("/my-claims")}
                      >
                        View Claims
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
