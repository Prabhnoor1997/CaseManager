"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X, Upload, User, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface EmailEntry {
  address: string;
  type: string;
  primary: boolean;
}

interface PhoneEntry {
  number: string;
  type: string;
  primary: boolean;
}

interface WebsiteEntry {
  url: string;
  type: string;
  primary: boolean;
}

interface AddressEntry {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;
  primary: boolean;
}

export default function NewContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [contactType, setContactType] = useState<"person" | "company">(
    "person"
  );
  const [profilePhoto] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();

  // Basic info
  const [prefix, setPrefix] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");

  // Contact arrays
  const [emails, setEmails] = useState<EmailEntry[]>([
    { address: "", type: "work", primary: true },
  ]);
  const [phones, setPhones] = useState<PhoneEntry[]>([
    { number: "", type: "work", primary: true },
  ]);
  const [websites, setWebsites] = useState<WebsiteEntry[]>([
    { url: "", type: "work", primary: true },
  ]);
  const [addresses, setAddresses] = useState<AddressEntry[]>([
    {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      type: "work",
      primary: true,
    },
  ]);

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Email functions
  const addEmail = () => {
    setEmails([...emails, { address: "", type: "work", primary: false }]);
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const updateEmail = (
    index: number,
    field: keyof EmailEntry,
    value: string | boolean
  ) => {
    const updated = emails.map((email, i) => {
      if (i === index) {
        if (field === "primary" && value === true) {
          // Set this as primary and others as false
          return { ...email, [field]: value };
        }
        return { ...email, [field]: value };
      }
      if (field === "primary" && value === true) {
        return { ...email, primary: false };
      }
      return email;
    });
    setEmails(updated);
  };

  // Phone functions
  const addPhone = () => {
    setPhones([...phones, { number: "", type: "work", primary: false }]);
  };

  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const updatePhone = (
    index: number,
    field: keyof PhoneEntry,
    value: string | boolean
  ) => {
    const updated = phones.map((phone, i) => {
      if (i === index) {
        if (field === "primary" && value === true) {
          return { ...phone, [field]: value };
        }
        return { ...phone, [field]: value };
      }
      if (field === "primary" && value === true) {
        return { ...phone, primary: false };
      }
      return phone;
    });
    setPhones(updated);
  };

  // Website functions
  const addWebsite = () => {
    setWebsites([...websites, { url: "", type: "work", primary: false }]);
  };

  const removeWebsite = (index: number) => {
    setWebsites(websites.filter((_, i) => i !== index));
  };

  const updateWebsite = (
    index: number,
    field: keyof WebsiteEntry,
    value: string | boolean
  ) => {
    const updated = websites.map((website, i) => {
      if (i === index) {
        if (field === "primary" && value === true) {
          return { ...website, [field]: value };
        }
        return { ...website, [field]: value };
      }
      if (field === "primary" && value === true) {
        return { ...website, primary: false };
      }
      return website;
    });
    setWebsites(updated);
  };

  // Address functions
  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        type: "work",
        primary: false,
      },
    ]);
  };

  const removeAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const updateAddress = (
    index: number,
    field: keyof AddressEntry,
    value: string | boolean
  ) => {
    const updated = addresses.map((address, i) => {
      if (i === index) {
        if (field === "primary" && value === true) {
          return { ...address, [field]: value };
        }
        return { ...address, [field]: value };
      }
      if (field === "primary" && value === true) {
        return { ...address, primary: false };
      }
      return address;
    });
    setAddresses(updated);
  };

  // Tag functions
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !emails[0]?.address) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);

    try {
      const primaryEmail = emails.find((e) => e.primary) || emails[0];
      const primaryPhone = phones.find((p) => p.primary) || phones[0];
      const primaryAddress = addresses.find((a) => a.primary) || addresses[0];

      const contactData = {
        firstName,
        lastName,
        email: primaryEmail.address,
        phone: primaryPhone.number,
        mobile: phones.find((p) => p.type === "mobile")?.number || "",
        address: {
          street: primaryAddress.street,
          city: primaryAddress.city,
          state: primaryAddress.state,
          zipCode: primaryAddress.zipCode,
          country: primaryAddress.country,
        },
        company:
          contactType === "company" || companyName
            ? {
                name: companyName,
                position: title,
              }
            : undefined,
        type: contactType === "company" ? "business" : "individual",
        status: "active",
        notes: "",
        preferredContactMethod: "email",
        billingInfo: {},
        customFields: {
          prefix,
          middleName,
          dateOfBirth: dateOfBirth?.toISOString(),
          emails: emails.filter((e) => e.address),
          phones: phones.filter((p) => p.number),
          websites: websites.filter((w) => w.url),
          addresses: addresses.filter((a) => a.street || a.city),
          tags,
          profilePhoto,
        },
        contacts: [],
      };

      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error("Failed to create contact");
      }

      toast.success("Contact created successfully");
      router.push("/contacts");
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error("Failed to create contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Contact</h1>
        <p className="text-muted-foreground">
          Add a new contact to your case management system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Type & Profile Photo */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <Label className="text-base font-medium">
                  Is this contact a person or a company?
                </Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={contactType === "person" ? "default" : "outline"}
                    onClick={() => setContactType("person")}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Person
                  </Button>
                  <Button
                    type="button"
                    variant={contactType === "company" ? "default" : "outline"}
                    onClick={() => setContactType("company")}
                    className="flex items-center gap-2"
                  >
                    <Building className="h-4 w-4" />
                    Company
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <Label className="text-base font-medium">Profile photo</Label>
                <div className="mt-2 flex flex-col items-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profilePhoto} />
                    <AvatarFallback>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="link"
                    className="mt-2 text-blue-600"
                  >
                    Upload photo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prefix">Prefix</Label>
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="Mr., Dr., etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle name</Label>
                <Input
                  id="middleName"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="What's the company's name?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Job title"
                />
              </div>
              <div className="space-y-2">
                <Label>Date of birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "mm/dd/yyyy"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Email address</Label>
                  <Input
                    value={email.address}
                    onChange={(e) =>
                      updateEmail(index, "address", e.target.value)
                    }
                    placeholder="email@example.com"
                    type="email"
                  />
                </div>
                <div className="w-28 space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={email.type}
                    onValueChange={(value) => updateEmail(index, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={email.primary ? "default" : "outline"}
                    onClick={() =>
                      updateEmail(index, "primary", !email.primary)
                    }
                  >
                    Primary
                  </Button>
                  {emails.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeEmail(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="link"
              onClick={addEmail}
              className="flex items-center gap-2 text-blue-600"
            >
              <Plus className="h-4 w-4" />
              Add email address
            </Button>
          </CardContent>
        </Card>

        {/* Phone */}
        <Card>
          <CardHeader>
            <CardTitle>Phone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {phones.map((phone, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Phone number</Label>
                  <Input
                    value={phone.number}
                    onChange={(e) =>
                      updatePhone(index, "number", e.target.value)
                    }
                    placeholder="(555) 123-4567"
                    type="tel"
                  />
                </div>
                <div className="w-28 space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={phone.type}
                    onValueChange={(value) => updatePhone(index, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={phone.primary ? "default" : "outline"}
                    onClick={() =>
                      updatePhone(index, "primary", !phone.primary)
                    }
                  >
                    Primary
                  </Button>
                  {phones.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removePhone(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="link"
              onClick={addPhone}
              className="flex items-center gap-2 text-blue-600"
            >
              <Plus className="h-4 w-4" />
              Add phone number
            </Button>
          </CardContent>
        </Card>

        {/* Website */}
        <Card>
          <CardHeader>
            <CardTitle>Website</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {websites.map((website, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Web address</Label>
                  <Input
                    value={website.url}
                    onChange={(e) =>
                      updateWebsite(index, "url", e.target.value)
                    }
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
                <div className="w-28 space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={website.type}
                    onValueChange={(value) =>
                      updateWebsite(index, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={website.primary ? "default" : "outline"}
                    onClick={() =>
                      updateWebsite(index, "primary", !website.primary)
                    }
                  >
                    Primary
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeWebsite(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="link"
              onClick={addWebsite}
              className="flex items-center gap-2 text-blue-600"
            >
              <Plus className="h-4 w-4" />
              Add website
            </Button>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {addresses.map((address, index) => (
              <div key={index} className="space-y-4 border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={address.primary ? "default" : "outline"}
                      onClick={() =>
                        updateAddress(index, "primary", !address.primary)
                      }
                    >
                      Primary
                    </Button>
                    <Select
                      value={address.type}
                      onValueChange={(value) =>
                        updateAddress(index, "type", value)
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {addresses.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeAddress(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Street</Label>
                    <Textarea
                      value={address.street}
                      onChange={(e) =>
                        updateAddress(index, "street", e.target.value)
                      }
                      placeholder="Street address"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={address.city}
                      onChange={(e) =>
                        updateAddress(index, "city", e.target.value)
                      }
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label>State/Province</Label>
                    <Input
                      value={address.state}
                      onChange={(e) =>
                        updateAddress(index, "state", e.target.value)
                      }
                      placeholder="State or Province"
                    />
                  </div>
                  <div>
                    <Label>Zip/Postal code</Label>
                    <Input
                      value={address.zipCode}
                      onChange={(e) =>
                        updateAddress(index, "zipCode", e.target.value)
                      }
                      placeholder="Zip code"
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Select
                      value={address.country}
                      onValueChange={(value) =>
                        updateAddress(index, "country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">
                          United States
                        </SelectItem>
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
            ))}
            <Button
              type="button"
              variant="link"
              onClick={addAddress}
              className="flex items-center gap-2 text-blue-600"
            >
              <Plus className="h-4 w-4" />
              Add address
            </Button>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Contact"}
          </Button>
        </div>
      </form>
    </div>
  );
}
