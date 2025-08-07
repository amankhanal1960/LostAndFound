"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSnackbar } from "notistack";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";

interface ClaimOnMyItem {
  claimid: number;
  itemid: number;
  claimerid: number;
  claimtext: string;
  claimedat: string;
  itemStatus: "OPEN" | "RESOLVED";
  claimStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  name: string;
  image: string | null;
  type: "LOST" | "FOUND";
  claimer_name: string;
  claimer_image: string | null;
}

interface ClaimsOnMyItemCardProps {
  claim: ClaimOnMyItem;
  onStatusUpdate?: (claimId: number, newStatus: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    case "ACCEPTED":
      return "bg-green-100 text-green-700 hover:bg-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-700 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <AlertCircle className="h-4 w-4" />;
    case "ACCEPTED":
      return <CheckCircle className="h-4 w-4" />;
    case "REJECTED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export function ClaimsOnMyItemCard({
  claim,
  onStatusUpdate,
}: ClaimsOnMyItemCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(claim.claimStatus);
  const { enqueueSnackbar } = useSnackbar();

  const handleStatusChange = async (newStatus: "ACCEPTED" | "REJECTED") => {
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/claims-on-my-items/${claim.claimid}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, itemId: claim.itemid }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update claim status");
      }

      setCurrentStatus(newStatus);
      onStatusUpdate?.(claim.claimid, newStatus);

      enqueueSnackbar(
        newStatus === "ACCEPTED"
          ? "Claim accepted successfully!"
          : "Claim rejected successfully!",
        {
          variant: "success",
        }
      );

      if (newStatus === "ACCEPTED") {
        enqueueSnackbar("Item status updated to resolved", { variant: "info" });
      }
    } catch (error) {
      console.error("Error updating claim status:", error);
      enqueueSnackbar("Failed to update claim status", { variant: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm p-0">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-lg">
          <div className="absolute top-1 left-1 z-10">
            <Badge
              className={
                claim.type === "FOUND"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }
            >
              {claim.type === "FOUND" ? "Found" : "Lost"}
            </Badge>
          </div>
          <div className="absolute top-1 right-1 z-10 flex space-x-1">
            <Badge
              className={
                claim.itemStatus === "OPEN"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-green-100 text-green-700"
              }
            >
              {claim.itemStatus.toLowerCase()}
            </Badge>
            <Badge className={getStatusColor(currentStatus)}>
              {getStatusIcon(currentStatus)}
              <span className="ml-1 capitalize">
                {currentStatus.toLowerCase()}
              </span>
            </Badge>
          </div>
          {claim.image ? (
            <Image
              src={claim.image || "/placeholder.svg"}
              fill
              alt={claim.name}
              className="object-contain object-center "
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
                {claim.name}
              </h3>
              <Badge variant="outline" className="text-xs">
                Claim Request
              </Badge>
            </div>
          </div>

          {/* Claim Text */}
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {claim.claimtext}
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              <span>{new Date(claim.claimedat).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>{new Date(claim.claimedat).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Claimer Info */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Link href="/profile">
                <div className="flex items-center space-x-2">
                  {claim.claimer_image ? (
                    <Image
                      src={claim.claimer_image || "/placeholder.svg"}
                      alt={claim.claimer_name}
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
                      {claim.claimer_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Claimed {new Date(claim.claimedat).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Action Buttons */}
            {currentStatus === "PENDING" && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleStatusChange("REJECTED")}
                  disabled={isUpdating}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusChange("ACCEPTED")}
                  disabled={isUpdating}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept
                </Button>
              </div>
            )}

            {currentStatus === "ACCEPTED" && (
              <div className="text-center">
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Claim Accepted - Item Resolved
                </Badge>
              </div>
            )}

            {currentStatus === "REJECTED" && (
              <div className="text-center">
                <Badge className="bg-red-100 text-red-700">
                  <XCircle className="h-4 w-4 mr-1" />
                  Claim Rejected
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
