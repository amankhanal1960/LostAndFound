"use client";
import type React from "react";
import { useState } from "react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSnackbar } from "notistack";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ReportItemPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { enqueueSnackbar } = useSnackbar();
  const [reportType, setReportType] = useState<"lost" | "found">("lost");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    contactnumber: "",
    image: [] as File[],
  });

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

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();

      img.onload = () => {
        const maxSize = 800;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
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
                      contactnumber: "",
                      image: [],
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let imageUrl: string | null = null;

    if (formData.image.length > 0) {
      try {
        const compressedImage = await compressImage(formData.image[0]);

        if (compressedImage.size > 5 * 1024 * 1024) {
          throw new Error("Image is too large. Please choose a smaller image.");
        }

        const uploadFormData = new FormData();
        uploadFormData.append("image", compressedImage);

        const uploadResponse = await fetch("/api/uploads", {
          method: "POST",
          body: uploadFormData,
        });
        const responseData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(responseData.message || "Unknown upload error");
        }

        imageUrl = responseData.url;
      } catch (uploadError) {
        const errorMessage =
          uploadError instanceof Error
            ? uploadError.message
            : "Image upload failed. Please try again.";
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      name: formData.title,
      description: formData.description,
      image: imageUrl,
      type: reportType.toUpperCase(),
      reportedby: user?.id,
      location: formData.location,
      category: formData.category,
      contactnumber: formData.contactnumber || null,
    };

    try {
      const res = await fetch("/api/items/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Report submission failed");
      }

      enqueueSnackbar("Report submitted successfully!", { variant: "success" });
      setIsSubmitted(true);
    } catch (submitError) {
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : "Report submission failed";
      setError(errorMessage);
      enqueueSnackbar("Report submission failed!", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        enqueueSnackbar("Please select a valid image file.", {
          variant: "error",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError(
          "Image is too large. Please choose an image smaller than 10MB."
        );
        enqueueSnackbar(
          "Image is too large. Please choose an image smaller than 10MB.",
          { variant: "error" }
        );
        return;
      }

      setFormData((f) => ({ ...f, image: [file] }));
      setError(null);
    }
  };

  return (
    <div>
      <Header />
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

          <form onSubmit={onSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., iPhone 14 Pro, Blue Backpack, etc."
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((f) => ({ ...f, category: value }))
                    }
                    required
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

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder={`Provide detailed description of the ${reportType} item including color, brand, size, distinctive features, etc.`}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Textarea
                    id="location"
                    placeholder={`Provide the location where you ${
                      reportType === "lost" ? "lost" : "found"
                    } the item`}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        location: e.target.value,
                      }))
                    }
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Photos (Optional)</Label>
                  <p className="text-sm text-gray-500">
                    Maximum file size: 10MB. Image will be compressed
                    automatically.
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {formData.image.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">
                          Upload a photo to help identify the item
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 bg-transparent"
                          onClick={() =>
                            document.getElementById("image")?.click()
                          }
                        >
                          Choose Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600 text-left">
                          1 file selected (
                          {(formData.image[0].size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </div>
                        <div className="relative h-24 w-24 rounded-lg overflow-hidden border mx-auto">
                          <Image
                            src={
                              URL.createObjectURL(formData.image[0]) ||
                              "/placeholder.svg"
                            }
                            alt="preview"
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("image")?.click()
                            }
                          >
                            Replace Image
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                              setFormData((f) => ({ ...f, image: [] }))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contactnumber">Phone Number</Label>
                  <Input
                    id="contactnumber"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.contactnumber}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        contactnumber: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

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

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
