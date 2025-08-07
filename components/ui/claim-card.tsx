"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentsPopup } from "./commentPopup";
import Link from "next/link";
import { DeleteMenu } from "./delete-menu";
import { useSnackbar } from "notistack";

import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Eye,
  Clock,
  User,
} from "lucide-react";

interface Claim {
  claimid: number;
  itemid: number;
  claimerid: number;
  claimtext: string;
  claimedat: string;
  itemStatus: "OPEN" | "RESOLVED";
  claimStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  type: "LOST" | "FOUND";
  name: string;
  image: string | null;
  claimer_name: string;
  claimer_image: string | null;
}

interface ClaimCardProps {
  claim: Claim;
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

export function ClaimCard({ claim }: ClaimCardProps) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [isCommentsOpen, setCommentsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/claims/${claim.claimid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        enqueueSnackbar("claim deleted successfully!", { variant: "success" });
        router.refresh();
      } else {
        const error = await response.json();
        enqueueSnackbar(`Delete failed: ${error.error}`, { variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting claim:", error);
      enqueueSnackbar("Delete failed. Please try again.", { variant: "error" });
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden p-0">
      <div className="relative">
        {/* Image */}
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
            <Badge className={getStatusColor(claim.claimStatus)}>
              {getStatusIcon(claim.claimStatus)}
              <span className="ml-1 capitalize">
                {claim.claimStatus.toLowerCase()}
              </span>
            </Badge>
          </div>
          {claim.image ? (
            <Image
              src={claim.image || "/placeholder.svg"}
              fill
              alt={claim.name}
              className="object-contain object-center"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Eye className="h-12 w-12" />
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {claim.name}
            </h3>
            <Badge variant="outline" className="text-xs">
              Claim message
            </Badge>
          </div>
        </div>

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

        {/* Actions */}
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
            <DeleteMenu
              onDelete={handleDelete}
              description="Are you sure you want to delete this claim? This will delete the claim and associated data as well. This action cannot be undone."
            />
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => setCommentsOpen(true)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments
            </Button>
          </div>
        </div>
      </CardContent>
      {isCommentsOpen && (
        <CommentsPopup
          open={isCommentsOpen}
          onOpenChange={setCommentsOpen}
          itemId={claim.itemid.toString()}
        />
      )}
    </Card>
  );
}
