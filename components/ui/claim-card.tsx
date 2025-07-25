"use client";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentsPopup } from "./commentPopup";

import {
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

interface Claim {
  claimid: number;
  itemid: number;
  claimerid: number;
  claimtext: string;
  claimedat: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  name: string;
  image: string | null;
}

interface ClaimCardProps {
  claim: Claim;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-blue-100 text-blue-800";
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
  const [imageError, setImageError] = useState(false);
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
        <div className="relative h-48 bg-gray-100">
          {claim.image && !imageError ? (
            <Image
              src={claim.image || "/placeholder.svg"}
              alt={claim.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Package className="h-12 w-12" />
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor(claim.status)}>
            {getStatusIcon(claim.status)}
            <span className="ml-1 capitalize">{claim.status}</span>
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {claim.name}
          </h3>
        </div>

        {/* Claim Text */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            Claim message
          </p>
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
