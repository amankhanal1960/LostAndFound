"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  Eye,
  Heart,
  Share2,
} from "lucide-react";
import Header from "@/components/header";

// Mock data for Found items
const mockFoundItems = [
  {
    id: 1,
    title: "iPhone 14 Pro Max",
    category: "Electronics",
    description:
      "Black iPhone 14 Pro Max with a blue MagSafe case. Has a small scratch on the back camera. Contains important work contacts and family photos.",
    location: "Central Park, near Bethesda Fountain",
    date: "2024-01-15",
    time: "14:30",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@email.com",
    contactPhone: "(555) 123-4567",
    images: [],
    reward: "$200",
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Brown Leather Wallet",
    category: "Personal Items",
    description:
      "Brown leather wallet with multiple cards, driver's license, and some cash. Has initials 'M.R.' embossed on the front.",
    location: "Starbucks on 5th Avenue",
    date: "2024-01-14",
    time: "09:15",
    contactName: "Michael Rodriguez",
    contactEmail: "m.rodriguez@email.com",
    contactPhone: "(555) 987-6543",
    images: [],
    reward: "$50",
    postedDate: "3 days ago",
  },
  {
    id: 3,
    title: "Blue Nike Backpack",
    category: "Bags & Luggage",
    description:
      "Navy blue Nike backpack with white logo. Contains MacBook Pro, charger, and university textbooks. Has a small keychain with a red heart.",
    location: "Columbia University Library",
    date: "2024-01-13",
    time: "16:45",
    contactName: "Emily Chen",
    contactEmail: "emily.chen@student.edu",
    contactPhone: "(555) 456-7890",
    images: ["https://i.ibb.co/pjLpKFPf/cartoombagpack.jpg"],
    reward: "",
    postedDate: "4 days ago",
  },
  {
    id: 4,
    title: "Gold Wedding Ring",
    category: "Jewelry & Watches",
    description:
      "14k gold wedding band with engraving 'Forever Yours - J&M 2019' on the inside. Very sentimental value.",
    location: "Washington Square Park",
    date: "2024-01-12",
    time: "11:20",
    contactName: "Jennifer Martinez",
    contactEmail: "j.martinez@email.com",
    contactPhone: "(555) 234-5678",
    images: ["https://i.ibb.co/Kz9m8qF6/61-FS1-m-Dc-L.jpg"],
    reward: "$500",
    postedDate: "5 days ago",
  },
  {
    id: 5,
    title: "Black Ray-Ban Sunglasses",
    category: "Clothing & Accessories",
    description:
      "Classic black Ray-Ban Wayfarer sunglasses. Prescription lenses. In a black leather case with cleaning cloth.",
    location: "Bryant Park",
    date: "2024-01-11",
    time: "13:00",
    contactName: "David Kim",
    contactEmail: "david.kim@email.com",
    contactPhone: "(555) 345-6789",
    images: [
      "https://i.ibb.co/d4kr7X1Q/01-1-Sunglasses-Huzzah1600x1600-10.jpg",
    ],
    reward: "$100",
    postedDate: "6 days ago",
  },
  {
    id: 6,
    title: "Car Keys with Honda Fob",
    category: "Keys",
    description:
      "Honda car key fob with house keys on a blue lanyard. Has a small flashlight and bottle opener keychain attached.",
    location: "Times Square Subway Station",
    date: "2024-01-10",
    time: "08:30",
    contactName: "Lisa Thompson",
    contactEmail: "lisa.t@email.com",
    contactPhone: "(555) 567-8901",
    images: ["/placeholder.svg?height=200&width=200"],
    reward: "$75",
    postedDate: "1 week ago",
  },
];

export default function FoundItemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    "All Categories",
    "Electronics",
    "Clothing & Accessories",
    "Bags & Luggage",
    "Documents & Cards",
    "Jewelry & Watches",
    "Keys",
    "Sports Equipment",
    "Books & Stationery",
    "Personal Items",
    "Other",
  ];

  const router = useRouter();

  const ItemCard = ({ item }: { item: (typeof mockFoundItems)[0] }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm ">
      <CardContent>
        {/* Image Section */}
        <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <div className="absolute top-1 left-1">
            <Badge className="bg-green-100 text-green-500 hover:bg-green-200">
              Found
            </Badge>
          </div>
          {item.images.length > 0 ? (
            <Image
              src={item.images[0] || "/placeholder.svg"}
              alt={item.title}
              layout="responsive"
              width={1920}
              height={1080}
              objectFit="cover"
              className="object-contain group-hover:scale-105 transition-transform 
              duration-300 "
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Eye className="h-12 w-12" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          {item.reward && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Reward: {item.reward}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {item.description}
          </p>

          {/* Location & Date */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
              {item.time && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{item.time}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {item.contactName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Posted {item.postedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <div className="pt-16">
        {/* Page Header */}
        <div className="text-black">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold my-4">Found Items</h1>
              <p className="text-black text-sm mx-auto">
                Browse through reported Found items and help reunite them with
                their owners. Every item has a story, and you could be part of a
                happy ending.
              </p>
              <div className="mt-4 flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
                      <span>{mockFoundItems.length} Found Items</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                      <span>12 Reunited This Month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search Bar */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search Found items by title, description, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Filter by:
                  </span>
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category.toLowerCase().replace(" ", "-")}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="location">By Location</SelectItem>
                    <SelectItem value="reward">Highest Reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Showing {mockFoundItems.length} results
              </span>
              {selectedCategory !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>Category: Electronics</span>
                  <button className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockFoundItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              Load More Items
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border-t border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Lost Something?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                If you&apos;ve lost something, please report it and browse
                through our found items.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/report_item")}
                >
                  Report Lost Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/lost_item")}
                >
                  Browse Lost Items
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
