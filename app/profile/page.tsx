"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemCard } from "@/components/ui/item-card";
import { ClaimCard } from "@/components/ui/claim-card";
import { ClaimsOnMyItemCard } from "@/components/ui/claims-on-my-items-card";
import { SkeletonItemCard } from "@/components/ui/skeleton";
import { SkeletonClaimCard } from "@/components/ui/skeleton";
import {
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
  Share2,
  Settings,
  Mail,
  Loader2,
} from "lucide-react";
import Header from "@/components/header";

// Types for real data
interface MyItems {
  itemid: number;
  name: string;
  description: string | null;
  image: string | null;
  type: "LOST" | "FOUND";
  reportedat: string;
  updatedat: string;
  status: "OPEN" | "RESOLVED";
  location: string | null;
  category: string | null;
}

interface MyClaim {
  claimid: number;
  itemid: number;
  claimtext: string;
  claimedat: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  item_name: string;
  type: "LOST" | "FOUND";
  item_image: string | null;
}

interface ClaimForMyItem {
  claimid: number;
  itemid: number;
  claimerid: number;
  claimtext: string;
  claimedat: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  item_name: string;
  type: "LOST" | "FOUND";
  claimer_name: string;
  claimer_image: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useSearchParams();

  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const { data: session } = useSession();
  //controls the dropdown filter (all, open, pending, resolved, accepted, rejected)
  const [filterStatus, setFilterStatus] = useState("all");
  //the claims the user has made on ohters items
  const [myItems, setMyItems] = useState<MyItems[]>([]);

  const [claims, setClaims] = useState<MyClaim[]>([]);
  //the claims that the other users have made on this users items
  const [claimsForMyItems, setClaimsForMyItems] = useState<ClaimForMyItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const initialTab = params.get("tab") ?? "my-items";

  const [activeTab, setActiveTab] = useState(initialTab);

  // whenever activeTab changes, update the URL
  useEffect(() => {
    // avoid pushing if it’s already the same
    if (params.get("tab") !== activeTab) {
      router.replace(`${window.location.pathname}?tab=${activeTab}`);
    }
  }, [activeTab, params, router]);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, claimsRes, claimsOnMyItemsRes] = await Promise.all([
        fetch(
          `/api/items/browse/myItems?limit=${limit}&offset=${offset}&reportedby=${session?.user?.id}`
        ),
        fetch(`/api/claims?limit=${limit}&offset=${offset}`),
        fetch(`/api/claims-on-my-items?limit=${limit}&offset=${offset}`),
      ]);

      if (!itemsRes || !claimsRes || !claimsOnMyItemsRes) {
        console.error({
          items: itemsRes.status,
          claims: claimsRes.status,
          claimsOnMine: claimsOnMyItemsRes.status,
        });
        throw new Error("One of the request failed");
      }

      const { items: fetchedItems } = await itemsRes.json();

      // const { json } = await itemsRes.json();
      // const fetchedItems = json.items;

      const claims = await claimsRes.json();

      const claimsOnMyItems = await claimsOnMyItemsRes.json();

      console.log("Fetched Items:", claimsOnMyItems);

      setMyItems((prev) =>
        offset === 0 ? fetchedItems : [...prev, ...fetchedItems]
      );
      setClaims(claims.claims || []);

      setClaimsForMyItems(claimsOnMyItems.claims || []);

      // Check if there are more items to load
      setHasMore(fetchedItems.length === limit);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, limit, offset]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session, fetchUserData]);

  const loadMore = () => {
    setOffset((prev) => prev + limit);
    fetchUserData();
  };

  const allItems = [...myItems.map((item) => ({ ...item }))];

  const filteredClaims = claims.filter((claim) => {
    if (filterStatus === "all") return true;
    return claim.status.toLowerCase() === filterStatus.toLowerCase();
  });

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
                  <AvatarImage
                    src={session?.user?.image || "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {session?.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {session?.user?.name || "User"}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{session?.user?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Member since {new Date().getFullYear()}</span>
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

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="grid grid-cols-3 border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab("my-items")}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === "my-items"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  My Items ({allItems.length})
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
                  My Claims ({claims.length})
                </button>
                <button
                  onClick={() => setActiveTab("claims-on-items")}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === "claims-on-items"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Claims on My Items ({claimsForMyItems.length})
                </button>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="my-items" className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: limit }).map((_, i) => (
                    <SkeletonItemCard key={i} />
                  ))}
                </div>
              ) : allItems.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <TrendingUp className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Items Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven&apos;t reported any items yet.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Report Item
                  </Button>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allItems.map((item) => (
                      <ItemCard
                        key={item.itemid}
                        item={item}
                        type={item.type === "FOUND" ? "found" : "lost"}
                        currentUserId={
                          session?.user?.id
                            ? Number(session.user.id)
                            : undefined
                        }
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
            </TabsContent>

            <TabsContent value="claims" className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: limit }).map((_, i) => (
                    <SkeletonClaimCard key={i} />
                  ))}
                </div>
              ) : filteredClaims.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Award className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Claims Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven&apos;t made any claims yet.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Browse Items
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClaims.map((claim) => (
                    <ClaimCard
                      key={claim.claimid}
                      type={claim.type === "FOUND" ? "found" : "lost"}
                      claim={claim}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="claims-on-items" className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: limit }).map((_, i) => (
                    <SkeletonClaimCard key={i} />
                  ))}
                </div>
              ) : claimsForMyItems.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Award className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Claims on Your Items
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your items have not been claimed yet.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Browse Items
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {claimsForMyItems.map((claim) => (
                    <ClaimsOnMyItemCard
                      key={claim.claimid}
                      item_type={claim.type === "FOUND" ? "found" : "lost"}
                      claim={claim}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
