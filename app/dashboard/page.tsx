"use client";

// import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  //  CardHeader, CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";

import {
  Search,
  Home,
  Plus,
  List,
  User,
  Settings,
  MessageSquare,
  TrendingUp,
  Users,
  // Clock,
  // MapPin,
  // Calendar,
  // Eye,
} from "lucide-react";
import Header from "@/components/header";

export default function DashboardPage() {
  const userName = "John Doe";

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Plus, label: "Report Lost Item", href: "/report" },
    { icon: List, label: "All Lost Items", href: "/items" },
    { icon: User, label: "My Reports", href: "/my-reports" },
    { icon: MessageSquare, label: "My Claims", href: "/my-claims" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <Header />

      <div className="flex pt-16">
        {/* Desktop Sidebar - Now properly sticky */}
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <SidebarContent />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-8 min-h-screen">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-blue-100 text-[15px]">
                Ready to help reunite lost items with their owners? Check your
                dashboard below for recent activity and quick actions.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      My Reports
                    </p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                    <p className="text-xs text-gray-500">
                      Items you&apos;ve reported
                    </p>
                    <div className="text-xs text-green-600">
                      ↗ 25% from last month
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Active Claims
                    </p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-xs text-gray-500">
                      Items awaiting response
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Successful Returns
                    </p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-500">
                      Items successfully returned
                    </p>
                    <div className="text-xs text-green-600">
                      ↗ 15% from last month
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Community Impact
                    </p>
                    <p className="text-2xl font-bold text-gray-900">47</p>
                    <p className="text-xs text-gray-500">
                      People you&apos;ve helped
                    </p>
                    <div className="text-xs text-green-600">
                      ↗ 8% from last month
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Report Lost Item
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Lost something? Report it here and let the community
                          help you find it.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Report Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-green-100">
                      <Search className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Browse Found Items
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Check if someone has found your lost item or help
                          others by claiming found items.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Browse Items
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <List className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          View All Reports
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          See all lost and found reports in your area and help
                          reunite items with owners.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        View All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-green-100">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          My Claims
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Manage your claims and communications with other
                          users.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        View Claims
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Reports */}
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Recent Activity
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <Image
                          width={64}
                          height={64}
                          src="/placeholder.svg?height=64&width=64"
                          alt="iPhone 14 Pro"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            iPhone 14 Pro
                          </h3>
                          <Badge className="ml-2 bg-red-100 text-red-800">
                            Lost
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          Black iPhone 14 Pro with blue case, lost near Central
                          Park
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            Central Park, NYC
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />2 days ago
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 bg-transparent"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-gray-400">
                        <Eye className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            Brown Leather Wallet
                          </h3>
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            Found
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          Contains ID and credit cards, found at coffee shop
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            Starbucks, 5th Ave
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />1 day ago
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 bg-transparent"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center text-gray-400">
                        <Eye className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            Blue Backpack
                          </h3>
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            Claimed
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          Nike backpack with laptop inside, successfully
                          returned to owner
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            University Campus
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />3 days ago
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 bg-transparent"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card> */}

            {/* Notifications & Updates */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Notifications & Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        New match found!
                      </p>
                      <p className="text-xs text-gray-600">
                        Someone reported finding an item similar to your lost
                        iPhone
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Item claimed successfully
                      </p>
                      <p className="text-xs text-gray-600">
                        Your brown wallet has been returned to its owner
                      </p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Verification required
                      </p>
                      <p className="text-xs text-gray-600">
                        Please verify your identity to claim the found backpack
                      </p>
                      <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Clock className="mr-2 h-4 w-4" />
                  View All Notifications
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </main>
      </div>
    </div>
  );
}
