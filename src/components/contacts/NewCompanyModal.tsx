"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface NewCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated: (company: { id: string; name: string }) => void;
}

export default function NewCompanyModal({
  isOpen,
  onClose,
  onCompanyCreated,
}: NewCompanyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    tags: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    setIsLoading(true);

    try {
      const companyData = {
        firstName: formData.name.split(" ")[0] || formData.name,
        lastName: formData.name.split(" ").slice(1).join(" ") || "",
        email: formData.email,
        phone: formData.phone,
        mobile: "",
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        company: {
          name: formData.name,
          position: "",
        },
        type: "business",
        status: "active",
        notes: "",
        preferredContactMethod: "email",
        billingInfo: {},
        customFields: {
          tags: formData.tags
            ? formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : [],
          emails: formData.email
            ? [{ address: formData.email, type: "work", primary: true }]
            : [],
          phones: formData.phone
            ? [{ number: formData.phone, type: "work", primary: true }]
            : [],
          websites: [],
          addresses:
            formData.street || formData.city
              ? [
                  {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                    type: "work",
                    primary: true,
                  },
                ]
              : [],
        },
        contacts: [],
      };

      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        throw new Error("Failed to create company");
      }

      const newCompany = await response.json();

      toast.success("Company created successfully");
      onCompanyCreated({
        id: newCompany._id || newCompany.id,
        name: formData.name,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        tags: "",
      });

      onClose();
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Failed to create company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        tags: "",
      });
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[500px] overflow-y-auto px-6"
      >
        <SheetHeader className="pb-6">
          <SheetTitle>New company</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-3">
            <Label htmlFor="companyName" className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder=""
              required
              className="h-10"
            />
          </div>

          {/* Email */}
          <div className="space-y-3">
            <Label htmlFor="companyEmail" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="companyEmail"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder=""
              className="h-10"
            />
          </div>

          {/* Phone */}
          <div className="space-y-3">
            <Label htmlFor="companyPhone" className="text-sm font-medium">
              Phone number
            </Label>
            <Input
              id="companyPhone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder=""
              className="h-10"
            />
          </div>

          {/* Address */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Address</Label>

            <div className="space-y-3">
              <Label htmlFor="companyStreet" className="text-sm text-gray-600">
                Street
              </Label>
              <Textarea
                id="companyStreet"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                placeholder=""
                rows={3}
                className="resize-none min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="companyCity" className="text-sm text-gray-600">
                  City
                </Label>
                <Input
                  id="companyCity"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder=""
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="companyState" className="text-sm text-gray-600">
                  State/Province
                </Label>
                <Input
                  id="companyState"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder=""
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="companyZip" className="text-sm text-gray-600">
                  Zip/Postal Code
                </Label>
                <Input
                  id="companyZip"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder=""
                  className="h-10"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="companyCountry"
                  className="text-sm text-gray-600"
                >
                  Country
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange("country", value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">
                      United Kingdom
                    </SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="space-y-3">
              <Label htmlFor="companyTags" className="text-sm text-gray-600">
                Contact tags
              </Label>
              <Input
                id="companyTags"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="Search contact tags"
                className="h-10"
              />
            </div>
          </div>

          <SheetFooter className="gap-3 pt-6 pb-4 -mx-6 px-6 border-t border-gray-100 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 h-10"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-10">
              {isLoading ? "Saving..." : "Save company"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
