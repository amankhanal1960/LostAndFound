"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
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
import { ItemCard } from "@/components/ui/item-card";

import {
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Share2,
  Settings,
  Mail,
  Package,
  User,
} from "lucide-react";
import Header from "@/components/header";
import { report } from "process";

// Types for real data
interface UserItem {
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
  pending_claims_count?: number;
}

interface MyClaim {
  claimid: number;
  itemid: number;
  claimtext: string;
  claimedat: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  item_name: string;
  item_type: "LOST" | "FOUND";
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
  item_type: "LOST" | "FOUND";
  claimer_name: string;
  claimer_image: string | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
    case "PENDING":
      return "bg-blue-100 text-blue-800";
    case "RESOLVED":
    case "ACCEPTED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "OPEN":
    case "PENDING":
      return <AlertCircle className="h-4 w-4" />;
    case "RESOLVED":
    case "ACCEPTED":
      return <CheckCircle className="h-4 w-4" />;
    case "REJECTED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export default function ProfilePage() {
  const { data: session } = useSession();
  //which of the three tabs is visible
  const [activeTab, setActiveTab] = useState("reports");
  //controls the dropdown filter (all, open, pending, resolved, accepted, rejected)
  const [filterStatus, setFilterStatus] = useState("all");
  //The items the user has reported(lost or found)
  const [foundItems, setFoundItems] = useState<UserItem[]>([]);
  //the claims the user has made on ohters items
  const [lostItems, setLostItems] = useState<MyClaim[]>([]);
  //the claims that the other users have made on this users items
  const [claimsForMyItems, setClaimsForMyItems] = useState<ClaimForMyItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const [
        foundRes,
        lostRes,
        // ,claimsRes
      ] = await Promise.all([
        fetch(`/api/items/browse/found?reportedby=${session?.user?.id}`),
        fetch(`/api/items/browse/lost?reportedby=${session?.user?.id}`),
        // fetch(`/api/claims?ownerId=${session?.user?.id}`), //claims on your items
      ]);

      if (
        !foundRes ||
        !lostRes
        //  || !claimsRes.ok
      ) {
        throw new Error("One of the request failed");
      }

      const { items: foundItems } = await foundRes.json();
      const { items: lostItems } = await lostRes.json();
      // const claims = await claimsRes.json();

      setFoundItems(foundItems);
      setLostItems(lostItems);
      // setClaimsForMyItems(claims.claims || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session, fetchUserData]);

  const allItems = [
    ...foundItems.map((item) => ({ ...item, type: "FOUND" as const })),
    ...lostItems.map((item) => ({ ...item, type: "LOST" as const })),
  ];

  const filteredClaims = lostItems.filter((claim) => {
    if (filterStatus === "all") return true;
    return claim.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const ClaimCard = ({ claim }: { claim: MyClaim }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardContent className="p-0">
        <div className="flex">
          {/* Image */}
          <div className="relative w-32 h-32 bg-gray-100 flex-shrink-0">
            {claim.item_image ? (
              <Image
                src={claim.item_image || "/placeholder.svg"}
                alt={claim.item_name}
                fill
                className="object-cover rounded-l-lg"
                sizes="128px"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Package className="h-8 w-8" />
              </div>
            )}
          </div>
          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {claim.item_name}
                </h3>
                <Badge
                  className={
                    claim.item_type === "LOST"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }
                >
                  {claim.item_type} Item
                </Badge>
              </div>
              <Badge className={getStatusColor(claim.status)}>
                {getStatusIcon(claim.status)}
                <span className="ml-1 capitalize">{claim.status}</span>
              </Badge>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm text-gray-700 line-clamp-3">
                {claim.claimtext}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Claimed {new Date(claim.claimedat).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ClaimsOnMyItemsCard = ({ claim }: { claim: ClaimForMyItem }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {claim.claimer_image ? (
            <Image
              src={claim.claimer_image || "/placeholder.svg"}
              alt={claim.claimer_name}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{claim.claimer_name}</h3>
                <p className="text-sm text-gray-600">
                  claimed &quot;{claim.item_name}&quot;
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(claim.claimedat).toLocaleDateString()}
                </div>
              </div>
              <Badge className={getStatusColor(claim.status)}>
                {getStatusIcon(claim.status)}
                <span className="ml-1 capitalize">{claim.status}</span>
              </Badge>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">{claim.claimtext}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

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
                  onClick={() => setActiveTab("reports")}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === "reports"
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
                  My Claims ({lostItems.length})
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

            <TabsContent value="reports" className="space-y-4">
              {allItems.length === 0 ? (
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
                        variant={item.type === "FOUND" ? "found" : "lost"}
                        //converting the string that the nextauth provided to number | null | undefined
                        currentUserId={
                          session?.user?.id
                            ? Number(session.user.id)
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="claims" className="space-y-4">
              {filteredClaims.length === 0 ? (
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
                filteredClaims.map((claim) => (
                  <ClaimCard key={claim.claimid} claim={claim} />
                ))
              )}
            </TabsContent>

            <TabsContent value="claims-on-items" className="space-y-4">
              {claimsForMyItems.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <MessageSquare className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Claims on Your Items
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No one has claimed your items yet.
                  </p>
                </Card>
              ) : (
                claimsForMyItems.map((claim) => (
                  <ClaimsOnMyItemsCard key={claim.claimid} claim={claim} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
