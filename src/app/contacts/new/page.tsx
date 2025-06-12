"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import ContactTypeSelector from "@/components/contacts/ContactTypeSelector";
import BasicInfoSection from "@/components/contacts/BasicInfoSection";
import EmailSection from "@/components/contacts/EmailSection";
import PhoneSection from "@/components/contacts/PhoneSection";
import WebsiteSection from "@/components/contacts/WebsiteSection";
import AddressSection from "@/components/contacts/AddressSection";
import TagsSection from "@/components/contacts/TagsSection";
import {
  EmailEntry,
  PhoneEntry,
  WebsiteEntry,
  AddressEntry,
} from "@/types/contact";

export default function NewContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Get initial contact type from URL params
  const initialType = searchParams.get("type");

  // Form state
  const [contactType, setContactType] = useState<"person" | "company">(
    initialType === "company" ? "company" : "person"
  );
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();

  // Basic info for Person
  const [prefix, setPrefix] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  // Basic info for Company
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

  // Set contact type from URL params on mount
  useEffect(() => {
    const urlType = searchParams.get("type");
    if (urlType === "company" || urlType === "person") {
      setContactType(urlType);
    }
  }, [searchParams]);

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
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 50) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (contactType === "person") {
      if (!firstName || !lastName || !emails[0]?.address) {
        toast.error(
          "Please fill in required fields: First name, Last name, and Email"
        );
        return;
      }
    } else {
      if (!companyName || !emails[0]?.address) {
        toast.error("Please fill in required fields: Company name and Email");
        return;
      }
    }

    setLoading(true);

    try {
      const primaryEmail = emails.find((e) => e.primary) || emails[0];
      const primaryPhone = phones.find((p) => p.primary) || phones[0];
      const primaryAddress = addresses.find((a) => a.primary) || addresses[0];

      const contactData = {
        firstName:
          contactType === "person"
            ? firstName
            : companyName.split(" ")[0] || companyName,
        lastName:
          contactType === "person"
            ? lastName
            : companyName.split(" ").slice(1).join(" ") || "",
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
          contactType === "company"
            ? {
                name: companyName,
                position: title,
              }
            : companyName
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
          prefix: contactType === "person" ? prefix : "",
          middleName: contactType === "person" ? middleName : "",
          dateOfBirth:
            contactType === "person" ? dateOfBirth?.toISOString() : undefined,
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
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Contact information</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Type & Profile Photo */}
          <ContactTypeSelector
            contactType={contactType}
            onContactTypeChange={setContactType}
            profilePhoto={profilePhoto}
            onProfilePhotoChange={setProfilePhoto}
          />

          {/* Basic Information */}
          <BasicInfoSection
            contactType={contactType}
            prefix={prefix}
            firstName={firstName}
            middleName={middleName}
            lastName={lastName}
            dateOfBirth={dateOfBirth}
            companyName={companyName}
            title={title}
            onPrefixChange={setPrefix}
            onFirstNameChange={setFirstName}
            onMiddleNameChange={setMiddleName}
            onLastNameChange={setLastName}
            onCompanyNameChange={setCompanyName}
            onTitleChange={setTitle}
            onDateOfBirthChange={setDateOfBirth}
          />

          {/* Email */}
          <EmailSection
            emails={emails}
            onAddEmail={addEmail}
            onRemoveEmail={removeEmail}
            onUpdateEmail={updateEmail}
          />

          {/* Phone */}
          <PhoneSection
            phones={phones}
            onAddPhone={addPhone}
            onRemovePhone={removePhone}
            onUpdatePhone={updatePhone}
          />

          {/* Website */}
          <WebsiteSection
            websites={websites}
            onAddWebsite={addWebsite}
            onRemoveWebsite={removeWebsite}
            onUpdateWebsite={updateWebsite}
          />

          {/* Address */}
          <AddressSection
            addresses={addresses}
            onAddAddress={addAddress}
            onRemoveAddress={removeAddress}
            onUpdateAddress={updateAddress}
          />

          {/* Tags */}
          <TagsSection
            tags={tags}
            newTag={newTag}
            onNewTagChange={setNewTag}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Contact"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
