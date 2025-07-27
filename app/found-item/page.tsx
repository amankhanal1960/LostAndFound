"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Search, Filter, Eye, Loader2 } from "lucide-react";
import Header from "@/components/header";
import { ItemCard } from "@/components/ui/item-card";
import { useSession } from "next-auth/react";

interface Item {
  itemid: number;
  userid: number;
  name: string;
  description: string | null;
  image: string | null;
  reportedby: number;
  reporter_name: string;
  reporter_image: string | null;
  reportedat: string;
  updatedat: string;
  status: "OPEN" | "RESOLVED";
  type: "lost" | "found";
  location: string | null;
  category: string | null;
  contactnumber: string | null;
}

const categories = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Accessories",
  "Documents",
  "Keys",
  "Bags",
  "Jewelry",
  "Sports Equipment",
  "Books",
  "Other",
];

export default function FoundItemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const { data: session } = useSession();
  const currentUserId = session?.user?.id ? Number(session.user.id) : null;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/items/browse/found?limit=${limit}&offset=${offset}`
        );
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();

        // Append on load-more, replace on initial load
        setItems((prev) =>
          offset === 0 ? data.items : [...prev, ...data.items]
        );

        // Check if there are more items to load
        setHasMore(data.items.length === limit);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [limit, offset]);

  // Filter and sort items whenever search, category, or sort changes
  useEffect(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description &&
            item.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (item.location &&
            item.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.reportedat).getTime() - new Date(a.reportedat).getTime()
          );
        case "oldest":
          return (
            new Date(a.reportedat).getTime() - new Date(b.reportedat).getTime()
          );
        case "location":
          return (a.location || "").localeCompare(b.location || "");
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory, sortBy]);

  const loadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Items
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold my-2">Found Items</h1>
              <p className="text-black text-sm mx-auto">
                Browse through reported found items and help reunite them with
                their owners. Every item has a story, and you could be part of a
                happy ending.
              </p>
              <div className="mt-4 flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
                      <span>{items.length} Found Items</span>
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
        <div className="bg-white border-b border-gray-200  top-16 z-55">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search Bar */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search found items by title, description, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-gray-300 lg:focus:border-blue-500 lg:focus:ring-0 text-xs"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="lg:flex items-center space-x-2 hidden ">
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
                  <SelectContent className="z-100">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="z-100">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="location">By Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Showing {filteredItems.length} results
                </span>
                {(selectedCategory !== "all" || searchQuery.trim()) && (
                  <div className="flex items-center space-x-2">
                    {selectedCategory !== "all" && (
                      <Badge
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>Category: {selectedCategory}</span>
                        <button
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          onClick={() => setSelectedCategory("all")}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {searchQuery.trim() && (
                      <Badge
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>Search: {searchQuery}</span>
                        <button
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          onClick={() => setSearchQuery("")}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              {(selectedCategory !== "all" || searchQuery.trim()) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading && offset === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading items...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or check back later for new
                items.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.itemid}
                    item={item}
                    type="found"
                    currentUserId={currentUserId}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 bg-transparent"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load More Items"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
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
                  onClick={() => router.push("/report-item")}
                >
                  Report Lost Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/lost-item")}
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
