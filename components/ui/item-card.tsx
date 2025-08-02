"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommentsPopup } from "./commentPopup";
import { useSnackbar } from "notistack";
import { DeleteMenu } from "./delete-menu";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  MessageCircle,
  Eye,
  Phone,
} from "lucide-react";
import { useSession } from "next-auth/react";

export interface Item {
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
  location: string | null;
  category: string | null;
  contactnumber: string | null;
  type: "LOST" | "FOUND";
}

interface ItemCardProps {
  item: Item;
  currentUserId?: number | null;
}

export const ItemCard = ({ item, currentUserId }: ItemCardProps) => {
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimText, setClaimText] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { enqueueSnackbar } = useSnackbar();

  if (status === "loading" || !session) {
    return null;
  }

  const isOwner = currentUserId === item.reportedby;

  const handleClaimSubmit = async () => {
    if (!session?.user) return;
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.itemid,
          claimerId: session.user.id,
          claimText,
        }),
      });
      if (response.ok) {
        setIsClaiming(false);
        setClaimText("");
        router.refresh();
        enqueueSnackbar("Claim submitted successfully!", {
          variant: "success",
        });
      } else {
        const error = await response.json();
        enqueueSnackbar(`Claim submission failed: ${error.message}`, {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Claim submission failed", error);
      enqueueSnackbar("Claim submission failed. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/items/${item.itemid}`, {
        method: "DELETE",
      });
      if (response.status === 403) {
        // custom unauthorized message
        const body = await response.json();
        enqueueSnackbar(body.error, { variant: "warning" });
        return;
      }
      if (response.ok) {
        enqueueSnackbar("Item deleted successfully!", { variant: "success" });
        router.refresh();
      } else {
        const error = await response.json();
        enqueueSnackbar(`Delete failed: ${error.error}`, { variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      enqueueSnackbar("Delete failed. Please try again.", { variant: "error" });
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm p-0">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-lg">
          <div className="absolute top-1 left-1 z-10">
            <Badge
              className={`${
                item.type === "FOUND"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {item.type === "FOUND" ? "Found" : "Lost"}
            </Badge>
          </div>
          <div className="absolute top-1 right-1 z-10 flex flex-col gap-1">
            {/* Item Status Badge */}
            <Badge
              className={`${
                item.status === "OPEN"
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              {item.status === "OPEN" ? "Open" : "Resolved"}
            </Badge>
          </div>
          {item.image ? (
            <Image
              src={item.image || "/placeholder.svg"}
              fill
              alt={item.name}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Eye className="h-12 w-12" />
            </div>
          )}
        </div>
        {/* Content Section */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {item.name}
              </h3>
              {item.category && (
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              )}
            </div>
          </div>
          {/* Description */}
          {item.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
              {item.description}
            </p>
          )}
          {/* Location & Date */}
          <div className="space-y-2 mb-4">
            {item.location && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span className="truncate">{item.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                <span>{new Date(item.reportedat).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                <span>{new Date(item.reportedat).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          {/* Contact Info */}
          <div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center justify-between mb-3">
                  <Link href="/profile">
                    <div className="flex items-center space-x-2">
                      {item.reporter_image ? (
                        <Image
                          src={item.reporter_image || "/placeholder.svg"}
                          alt={item.reporter_name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {item.reporter_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Posted{" "}
                          {new Date(item.reportedat).toLocaleDateString()}
                        </p>
                        {item.contactnumber && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{item.contactnumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
                <DeleteMenu
                  onDelete={handleDelete}
                  description="Are you sure you want to delete this item? This will delete the item and it's associated data as well. This action cannot be undone."
                />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex space-x-2">
              {/* Comments Button */}
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => setCommentsOpen(true)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments
              </Button>
              {/* Claim Button for Non-owners */}
              {item.status === "OPEN" && !isOwner && (
                //  && !hasClaim
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setIsClaiming(true)}
                >
                  {item.type === "FOUND" ? "Claim Item" : "I Found This"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      {/* Comments Popup */}
      {isCommentsOpen && (
        <CommentsPopup
          open={isCommentsOpen}
          onOpenChange={setCommentsOpen}
          itemId={item.itemid.toString()}
        />
      )}
      {/* Claim Modal */}
      {isClaiming && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="font-semibold mb-4">
              {item.type === "FOUND"
                ? `Claim "${item.name}"`
                : `Report Found: "${item.name}"`}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {item.type === "FOUND"
                ? "Explain why this item belongs to you and provide details to verify ownership."
                : "Explain how you found this item and provide details about when and where."}
            </p>
            <textarea
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder={
                item.type === "FOUND"
                  ? "Describe the item details, when you lost it, where, and any identifying features..."
                  : "Describe when and where you found this item, its condition, and any other relevant details..."
              }
              className="w-full p-3 border rounded-lg mb-4 min-h-[120px] resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsClaiming(false);
                  setClaimText("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleClaimSubmit} disabled={!claimText.trim()}>
                Submit Claim
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
