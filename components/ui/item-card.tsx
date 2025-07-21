"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { CommentsPopup } from "./commentPopup";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  MessageCircle,
  Eye,
  Heart,
  Share2,
} from "lucide-react";

export interface Item {
  itemid: number;
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
}

interface ItemCardProps {
  item: Item;
  variant: "found" | "lost";
}

export const ItemCard = ({ item, variant }: ItemCardProps) => {
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const router = useRouter();

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm p-0">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-lg">
          <div className="absolute top-1 left-1 z-10">
            <Badge
              className={`${
                variant === "found"
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {variant === "found" ? "Found" : "Lost"}
            </Badge>
          </div>
          {item.image ? (
            <Image
              src={item.image}
              fill
              alt={item.name}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
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
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Link href="/profile">
                <div className="flex items-center space-x-2">
                  {item.reporter_image ? (
                    <Image
                      src={item.reporter_image}
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
                      Posted {new Date(item.reportedat).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Contact Actions */}
            <div className="flex space-x-2">
              {item.contactnumber && (
                <>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setCommentsOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comments
                  </Button>
                  {isCommentsOpen && (
                    <CommentsPopup
                      open={isCommentsOpen}
                      onOpenChange={setCommentsOpen}
                      itemId={item.itemid.toString()}
                    />
                  )}
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => router.push(`/items/${item.itemid}`)}
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
};
