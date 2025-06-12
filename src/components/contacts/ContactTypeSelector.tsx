"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Building, Info, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ContactTypeSelectorProps {
  contactType: "person" | "company";
  onContactTypeChange: (type: "person" | "company") => void;
  profilePhoto: string;
  onProfilePhotoChange: (photoUrl: string) => void;
}

export default function ContactTypeSelector({
  contactType,
  onContactTypeChange,
  profilePhoto,
  onProfilePhotoChange,
}: ContactTypeSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // For now, we'll create a local URL for preview
      // In a real app, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
      const localUrl = URL.createObjectURL(file);
      onProfilePhotoChange(localUrl);
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = () => {
    if (profilePhoto) {
      // Revoke the object URL to prevent memory leaks
      if (profilePhoto.startsWith("blob:")) {
        URL.revokeObjectURL(profilePhoto);
      }
      onProfilePhotoChange("");
      toast.success("Photo removed");
    }
  };

  const getInitials = () => {
    if (contactType === "company") {
      return "CO";
    }
    return "P";
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Is this contact a person or a company?
            </Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={contactType === "person" ? "default" : "outline"}
                onClick={() => onContactTypeChange("person")}
                className="flex items-center gap-2"
                size="sm"
              >
                <User className="h-4 w-4" />
                Person
              </Button>
              <Button
                type="button"
                variant={contactType === "company" ? "default" : "outline"}
                onClick={() => onContactTypeChange("company")}
                className="flex items-center gap-2"
                size="sm"
              >
                <Building className="h-4 w-4" />
                Company
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              Profile photo
              <Info className="h-3 w-3 text-blue-500" />
            </Label>
            <div className="flex flex-col items-center relative">
              <div className="relative group">
                <Avatar className="h-16 w-16 mb-2 cursor-pointer transition-opacity group-hover:opacity-80">
                  {profilePhoto && <AvatarImage src={profilePhoto} />}
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                    {profilePhoto ? (
                      <User className="h-6 w-6" />
                    ) : (
                      getInitials()
                    )}
                  </AvatarFallback>
                </Avatar>
                {profilePhoto && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRemovePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 text-sm h-auto p-0 flex items-center gap-1"
                  onClick={handleFileSelect}
                  disabled={isUploading}
                >
                  <Upload className="h-3 w-3" />
                  {isUploading
                    ? "Uploading..."
                    : profilePhoto
                    ? "Change photo"
                    : "Upload photo"}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload profile photo"
              />
            </div>

            {/* Photo guidelines */}
            <div className="mt-2 text-xs text-gray-500 text-center max-w-32">
              JPEG, PNG or WebP. Max 5MB.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
