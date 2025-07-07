"use client";
import type React from "react";
import { useState } from "react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

import {
  ArrowLeft,
  Upload,
  MapPin,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

export default function ReportItemPage() {
  const [reportType, setReportType] = useState<"lost" | "found">("lost");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
    time: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    reward: "",
    isRewardOffered: false,
    images: [] as File[],
  });

  const userName = "John Doe";
  const categories = [
    "Electronics",
    "Clothing & Accessories",
    "Bags & Luggage",
    "Documents & Cards",
    "Jewelry & Watches",
    "Keys",
    "Sports Equipment",
    "Books & Stationery",
    "Personal Items",
    "Other",
  ];

  //   Takes two arguments
  // field: the name of the property in your formData state that you want to update (e.g. "title" or "isRewardOffered").
  // value: the new value to assign (a string for text inputs, or a boolean for checkboxes).
  // Uses the functional form of setFormData
  // By passing prev => { … }, you always get the latest snapshot of state.
  // Spreads the previous state
  // ...prev makes a shallow copy of everything in formData.
  // Overwrites only the one field
  // The computed key [field] will be set to value, leaving all other properties unchanged.
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // event.target.files is a FileList (not a real array), so we wrap it in Array.from(...)
  //  to convert it into a JavaScript File[].
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 z-50 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-6">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Lost & Found
                  </h1>
                  <p className="text-xs text-gray-600">Management System</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        john@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <div className="pt-16 min-h-screen flex items-center justify-center p-6">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Report Submitted!
              </h2>
              <p className="text-gray-600 mb-6">
                Your {reportType} item report has been successfully submitted.
                We&apos;ll notify you if there are any matches.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      title: "",
                      category: "",
                      description: "",
                      location: "",
                      date: "",
                      time: "",
                      contactName: "",
                      contactEmail: "",
                      contactPhone: "",
                      reward: "",
                      isRewardOffered: false,
                      images: [],
                    });
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Report Another Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      {/* main content */}
      <div className="pt-16 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="my-6">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">
              Report an Item
            </h1>
            <p className="text-gray-600">
              Help us reunite lost items with their owners by providing detailed
              information below
            </p>
          </div>

          <Card className="mb-3">
            <CardHeader>
              <CardTitle className="text-lg">
                What would you like to report?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={reportType}
                onValueChange={(value) =>
                  setReportType(value as "lost" | "found")
                }
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-100">
                  <RadioGroupItem value="lost" id="lost" />
                  <label htmlFor="lost" className="flex-1 cursor-pointer">
                    <div className="font-medium text-red-700">Lost Item</div>
                    <p className="text-sm text-gray-500">I lost something</p>
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-100">
                  <RadioGroupItem value="found" id="found" />
                  <label htmlFor="found" className="flex-1 cursor-pointer">
                    <div className="font-medium text-green-700">Found Item</div>
                    <p className="text-sm text-gray-500">I found something</p>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* main form */}

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg"> Items details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., iPhone 14 Pro, Blue Backpack, etc."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder={`Provide detailed description of the ${reportType} item including color, brand, size, distinctive features, etc.`}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    required
                  />
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label htmlFor="images">Photos (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {formData.images.length === 0 ? (
                      // Show upload prompt when no images
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">
                          Upload photos to help identify the item
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={() =>
                            document.getElementById("images")?.click()
                          }
                        >
                          Choose Files
                        </Button>
                      </div>
                    ) : (
                      // Show previews + add more button when images exist
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600 text-left">
                          {formData.images.length} file(s) selected
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                          {formData.images.map((file, idx) => {
                            const blobUrl = URL.createObjectURL(file);
                            return (
                              <div
                                key={idx}
                                className="relative h-24 w-24 rounded-lg overflow-hidden border"
                              >
                                <Image
                                  src={blobUrl}
                                  alt={`preview-${idx}`}
                                  fill
                                  sizes="(max-width: 640px) 100px, 150px"
                                  style={{ objectFit: "cover" }}
                                  onLoadingComplete={() => {
                                    URL.revokeObjectURL(blobUrl);
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("images")?.click()
                          }
                        >
                          Add More
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Location & Time */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">
                    {reportType === "lost"
                      ? "Where did you lose it?"
                      : "Where did you find it?"}{" "}
                    *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Central Park, Starbucks on 5th Ave, University Library, etc."
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Approximate Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        handleInputChange("time", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Contact Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Full Name *</Label>
                    <Input
                      id="contactName"
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={(e) =>
                        handleInputChange("contactName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        handleInputChange("contactEmail", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
            {/* Reward Section (only for lost items) */}
            {reportType === "lost" && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Reward (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reward-offered"
                      checked={formData.isRewardOffered}
                      onCheckedChange={(checked) =>
                        handleInputChange("isRewardOffered", checked as boolean)
                      }
                    />
                    <Label htmlFor="reward-offered">
                      I&apos;m offering a reward for finding this item
                    </Label>
                  </div>
                  {formData.isRewardOffered && (
                    <div className="space-y-2">
                      <Label htmlFor="reward">Reward Amount</Label>
                      <Input
                        id="reward"
                        placeholder="e.g., $50, $100, etc."
                        value={formData.reward}
                        onChange={(e) =>
                          handleInputChange("reward", e.target.value)
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {/* Submit Button */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg mb-6">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Before submitting:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Double-check all information is accurate</li>
                      <li>Make sure your contact details are correct</li>
                      <li>
                        Include as much detail as possible in the description
                      </li>
                    </ul>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : `Submit ${
                        reportType === "lost" ? "Lost" : "Found"
                      } Item Report`}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
