"use client";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentsPopup } from "./commentPopup";

import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Eye,
} from "lucide-react";

interface Claim {
  claimid: number;
  itemid: number;
  claimerid: number;
  claimtext: string;
  claimedat: string;
  itemStatus: "OPEN" | "RESOLVED";
  claimStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  type: "lost" | "found";
  name: string;
  image: string | null;
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
  const [isCommentsOpen, setCommentsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden p-0">
      <div className="relative">
        {/* Image */}
        <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-lg">
          <div className="absolute top-1 left-1 z-10">
            <Badge
              className={
                claim.type === "found"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }
            >
              {claim.type === "found" ? "Found" : "Lost"}
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
              className="object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {claim.name}
          </h3>
          <Badge variant="outline" className="text-xs">
            Claim message
          </Badge>
        </div>

        <div>
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
            <p className="text-base text-gray-800 leading-relaxed">
              {claim.claimtext}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="my-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>Claimed at: {formatDate(claim.claimedat)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Button
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => setCommentsOpen(true)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Comments
          </Button>
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
