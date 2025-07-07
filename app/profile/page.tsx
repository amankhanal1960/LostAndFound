"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Calendar,
  Edit3,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Heart,
  Share2,
  Settings,
  Mail,
  Phone,
} from "lucide-react";
import Header from "@/components/header";

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "(555) 123-4567",
  joinDate: "January 2023",
  location: "New York, NY",
  avatar: "/placeholder.svg?height=120&width=120",
};

// Mock reports data (items user has lost)
const mockReports = [
  {
    id: 1,
    title: "iPhone 14 Pro Max",
    category: "Electronics",
    description: "Black iPhone 14 Pro Max with blue case",
    location: "Central Park",
    date: "2024-01-15",
    status: "active",
    views: 45,
    responses: 3,
    reward: "$200",
    images: ["https://i.ibb.co/Y4jPVD7P/i-Phone-16-Pro-Max-Gold-Titanium.jpg"],
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Brown Leather Wallet",
    category: "Personal Items",
    description: "Brown wallet with initials M.R.",
    location: "Starbucks, 5th Ave",
    date: "2024-01-10",
    status: "resolved",
    views: 23,
    responses: 1,
    reward: "$50",
    images: [],
    postedDate: "1 week ago",
    resolvedDate: "3 days ago",
  },
  {
    id: 3,
    title: "Car Keys with Honda Fob",
    category: "Keys",
    description: "Honda key fob with blue lanyard",
    location: "Times Square Station",
    date: "2024-01-08",
    status: "expired",
    views: 12,
    responses: 0,
    reward: "$75",
    images: ["/placeholder.svg?height=200&width=200"],
    postedDate: "2 weeks ago",
  },
];

// Mock claims data (items user has found)
const mockClaims = [
  {
    id: 1,
    title: "Blue Nike Backpack",
    category: "Bags & Luggage",
    description: "Navy blue Nike backpack with laptop inside",
    location: "Columbia University Library",
    date: "2024-01-12",
    status: "pending",
    claimDate: "2024-01-13",
    ownerName: "Emily Chen",
    images: ["https://i.ibb.co/pjLpKFPf/cartoombagpack.jpg"],
    postedDate: "5 days ago",
  },
  {
    id: 2,
    title: "Gold Wedding Ring",
    category: "Jewelry & Watches",
    description: "14k gold wedding band with engraving",
    location: "Washington Square Park",
    date: "2024-01-05",
    status: "verified",
    claimDate: "2024-01-06",
    ownerName: "Jennifer Martinez",
    images: ["https://i.ibb.co/Kz9m8qF6/61-FS1-m-Dc-L.jpg"],
    postedDate: "2 weeks ago",
    verifiedDate: "1 week ago",
  },
  {
    id: 3,
    title: "Black Ray-Ban Sunglasses",
    category: "Clothing & Accessories",
    description: "Classic black Wayfarer sunglasses",
    location: "Bryant Park",
    date: "2024-01-01",
    status: "returned",
    claimDate: "2024-01-02",
    ownerName: "David Kim",
    images: [
      "https://i.ibb.co/d4kr7X1Q/01-1-Sunglasses-Huzzah1600x1600-10.jpg",
    ],
    postedDate: "3 weeks ago",
    returnedDate: "2 weeks ago",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
    case "pending":
      return "bg-blue-100 text-blue-800";
    case "resolved":
    case "verified":
    case "returned":
      return "bg-green-100 text-green-800";
    case "expired":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
    case "pending":
      return <AlertCircle className="h-4 w-4" />;
    case "resolved":
    case "verified":
    case "returned":
      return <CheckCircle className="h-4 w-4" />;
    case "expired":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("reports");
  const [filterStatus, setFilterStatus] = useState("all");

  const ReportCard = ({ item }: { item: (typeof mockReports)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardContent className="p-0">
        <div className="flex">
          {/* Image */}
          <div className="relative w-32 h-32 bg-gray-100 flex-shrink-0">
            {item.images.length > 0 ? (
              <Image
                src={item.images[0] || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover rounded-l-lg"
                sizes="128px"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Eye className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {item.title}
                </h3>
                <Badge variant="outline" className="text-xs mb-2">
                  {item.category}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(item.status)}>
                  {getStatusIcon(item.status)}
                  <span className="ml-1 capitalize">{item.status}</span>
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Report
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{item.views} views</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{item.responses} responses</span>
                </div>
              </div>
              {item.reward && (
                <Badge className="bg-green-100 text-green-800">
                  {item.reward}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ClaimCard = ({ item }: { item: (typeof mockClaims)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardContent className="p-0">
        <div className="flex">
          {/* Image */}
          <div className="relative w-32 h-32 bg-gray-100 flex-shrink-0">
            {item.images.length > 0 ? (
              <Image
                src={item.images[0] || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover rounded-l-lg"
                sizes="128px"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Eye className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {item.title}
                </h3>
                <Badge variant="outline" className="text-xs mb-2">
                  {item.category}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(item.status)}>
                  {getStatusIcon(item.status)}
                  <span className="ml-1 capitalize">{item.status}</span>
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Owner
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Owner:</span> {item.ownerName}
              </div>
              <div className="text-xs text-gray-500">
                Claimed {item.postedDate}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16">
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* User Info */}
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userData.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>{userData.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Joined {userData.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="flex items-center bg-transparent"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-6">
              {/* <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="reports" className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  My Reports ({mockReports.length})
                </TabsTrigger>
                <TabsTrigger value="claims" className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  My Claims ({mockClaims.length})
                </TabsTrigger>
              </TabsList> */}
              <div className="grid grid-cols-2 border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === "reports"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  My Reports ({mockReports.length})
                </button>
                <button
                  onClick={() => setActiveTab("claims")}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === "claims"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Award className="h-4 w-4 mr-2" />
                  My Claims ({mockClaims.length})
                </button>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="reports" className="space-y-4">
              {mockReports.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <TrendingUp className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Reports Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven&apos;t reported any lost items yet.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Report Lost Item
                  </Button>
                </Card>
              ) : (
                mockReports.map((item) => (
                  <ReportCard key={item.id} item={item} />
                ))
              )}
            </TabsContent>

            <TabsContent value="claims" className="space-y-4">
              {mockClaims.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Award className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Claims Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven&apos;t claimed any found items yet.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Browse Lost Items
                  </Button>
                </Card>
              ) : (
                mockClaims.map((item) => (
                  <ClaimCard key={item.id} item={item} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Achievement Section */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Helper Hero
                </h3>
                <p className="text-sm text-gray-600">
                  Helped 10+ people find their items
                </p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Quick Responder
                </h3>
                <p className="text-sm text-gray-600">
                  Average response time under 3 hours
                </p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Community Star
                </h3>
                <p className="text-sm text-gray-600">
                  Highly rated by the community
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
