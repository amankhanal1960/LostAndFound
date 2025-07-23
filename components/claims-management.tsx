"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Check,
  X,
} from "lucide-react";

interface Claim {
  claimid: number;
  itemid: number;
  claimerid: number;
  claimtext: string;
  claimedat: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  claimer_name: string;
  claimer_image: string | null;
  claimer_email: string;
  claimer_contact: string | null;
  item_name?: string;
  item_type?: string;
}

interface ClaimsManagementProps {
  itemId: number;
  ownerId: number;
  itemName: string;
}

export function ClaimsManagement({ itemId, ownerId }: ClaimsManagementProps) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingClaim, setProcessingClaim] = useState<number | null>(null);

  const fetchClaims = useCallback(async () => {
    try {
      const response = await fetch(`/api/claims?itemId=${itemId}`);
      const data = await response.json();
      setClaims(data.claims || []);
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetchClaims();
  }, [itemId, fetchClaims]);

  const handleClaimAction = async (
    claimId: number,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    setProcessingClaim(claimId);
    try {
      const response = await fetch(`/api/claims/${claimId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ownerId }),
      });

      if (response.ok) {
        await fetchClaims(); // Refresh claims
      }
    } catch (error) {
      console.error("Error updating claim:", error);
    } finally {
      setProcessingClaim(null);
    }
  };

  const pendingClaims = claims.filter((claim) => claim.status === "PENDING");
  const processedClaims = claims.filter((claim) => claim.status !== "PENDING");

  if (loading) {
    return <div className="text-center py-4">Loading claims...</div>;
  }

  if (claims.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No claims yet for this item</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Claims */}
      {pendingClaims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Pending Claims ({pendingClaims.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingClaims.map((claim) => (
              <div key={claim.claimid} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {claim.claimer_image ? (
                      <Image
                        src={claim.claimer_image || "/placeholder.svg"}
                        alt={claim.claimer_name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{claim.claimer_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(claim.claimedat).toLocaleDateString()}
                        </div>
                        {claim.claimer_contact && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {claim.claimer_contact}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {claim.claimer_email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700"
                  >
                    Pending
                  </Badge>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {claim.claimtext}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleClaimAction(claim.claimid, "ACCEPTED")}
                    disabled={processingClaim === claim.claimid}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleClaimAction(claim.claimid, "REJECTED")}
                    disabled={processingClaim === claim.claimid}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Processed Claims */}
      {processedClaims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Claims ({processedClaims.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {processedClaims.map((claim) => (
              <div
                key={claim.claimid}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
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
                    <p className="font-medium text-sm">{claim.claimer_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(claim.claimedat).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    claim.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {claim.status === "ACCEPTED" ? "Accepted" : "Rejected"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Dialog wrapper for use in ItemCard
export function ClaimsDialog({
  itemId,
  ownerId,
  itemName,
  claimsCount,
}: {
  itemId: number;
  ownerId: number;
  itemName: string;
  claimsCount: number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
          <MessageSquare className="w-4 h-4 mr-2" />
          Claims ({claimsCount})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Claims for &quot;{itemName}&quot;</DialogTitle>
        </DialogHeader>
        <ClaimsManagement
          itemId={itemId}
          ownerId={ownerId}
          itemName={itemName}
        />
      </DialogContent>
    </Dialog>
  );
}
