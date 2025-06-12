"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import ContactTypeSelector from "@/components/contacts/ContactTypeSelector";
import BasicInfoSection from "@/components/contacts/BasicInfoSection";
import EmailSection from "@/components/contacts/EmailSection";
import PhoneSection from "@/components/contacts/PhoneSection";
import WebsiteSection from "@/components/contacts/WebsiteSection";
import AddressSection from "@/components/contacts/AddressSection";
import TagsSection from "@/components/contacts/TagsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";
import {
  EmailEntry,
  PhoneEntry,
  WebsiteEntry,
  AddressEntry,
} from "@/types/contact";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  company?: {
    name: string;
    position: string;
  };
  type: "individual" | "business" | "organization";
  status: "active" | "inactive" | "prospect";
  createdAt: string;
  updatedAt: string;
  customFields?: {
    profilePhoto?: string;
    tags?: string[];
    prefix?: string;
    middleName?: string;
    dateOfBirth?: string;
    emails?: EmailEntry[];
    phones?: PhoneEntry[];
    websites?: WebsiteEntry[];
    addresses?: AddressEntry[];
  };
}

// Mock contact data for demonstration (same as in contacts page)
const mockContacts = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 234-5678",
    type: "individual",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    company: {
      name: "Tech Corp",
      position: "Senior Developer",
    },
    customFields: {
      prefix: "Mr.",
      middleName: "William",
      dateOfBirth: "1990-05-15T00:00:00Z",
      tags: ["VIP", "Developer", "Remote"],
      profilePhoto: "",
      emails: [
        { address: "john.doe@example.com", type: "work", primary: true },
        {
          address: "john.personal@gmail.com",
          type: "personal",
          primary: false,
        },
      ],
      phones: [
        { number: "+1 (555) 123-4567", type: "work", primary: true },
        { number: "+1 (555) 234-5678", type: "mobile", primary: false },
      ],
      websites: [
        { url: "https://johndoe.dev", type: "work", primary: true },
        {
          url: "https://linkedin.com/in/johndoe",
          type: "social",
          primary: false,
        },
      ],
      addresses: [
        {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
          type: "work",
          primary: true,
        },
        {
          street: "456 Home Ave",
          city: "Brooklyn",
          state: "NY",
          zipCode: "11201",
          country: "USA",
          type: "home",
          primary: false,
        },
      ],
    },
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@marketing.com",
    phone: "+1 (555) 987-6543",
    type: "individual",
    status: "active",
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    company: {
      name: "Marketing Plus",
      position: "Marketing Director",
    },
    customFields: {
      prefix: "Ms.",
      middleName: "",
      dateOfBirth: "1985-08-22T00:00:00Z",
      tags: ["Marketing", "VIP", "Consultant"],
      profilePhoto: "",
      emails: [
        { address: "jane.smith@marketing.com", type: "work", primary: true },
      ],
      phones: [{ number: "+1 (555) 987-6543", type: "work", primary: true }],
      websites: [
        { url: "https://marketingplus.com", type: "work", primary: true },
      ],
      addresses: [
        {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "USA",
          type: "work",
          primary: true,
        },
      ],
    },
  },
];

export default function ContactEditPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [error, setError] = useState("");

  // Form state (populated from contact data)
  const [contactType, setContactType] = useState<"person" | "company">(
    "person"
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
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Find contact from mock data
        const foundContact = mockContacts.find((c) => c._id === contactId);

        if (!foundContact) {
          setError("Contact not found");
          return;
        }

        setContact(foundContact as Contact);

        // Populate form state with contact data
        setContactType(foundContact.type === "business" ? "company" : "person");
        setProfilePhoto(foundContact.customFields?.profilePhoto || "");

        if (foundContact.customFields?.dateOfBirth) {
          setDateOfBirth(new Date(foundContact.customFields.dateOfBirth));
        }

        // Basic info
        setPrefix(foundContact.customFields?.prefix || "");
        setFirstName(foundContact.firstName);
        setMiddleName(foundContact.customFields?.middleName || "");
        setLastName(foundContact.lastName);

        if (foundContact.company) {
          setCompanyName(foundContact.company.name);
          setTitle(foundContact.company.position);
        }

        // Contact arrays with fallbacks
        setEmails(
          foundContact.customFields?.emails || [
            { address: foundContact.email, type: "work", primary: true },
          ]
        );

        setPhones(
          foundContact.customFields?.phones || [
            { number: foundContact.phone, type: "work", primary: true },
          ]
        );

        setWebsites(foundContact.customFields?.websites || []);
        setAddresses(
          foundContact.customFields?.addresses || [
            {
              street: foundContact.address?.street || "",
              city: foundContact.address?.city || "",
              state: foundContact.address?.state || "",
              zipCode: foundContact.address?.zipCode || "",
              country: foundContact.address?.country || "United States",
              type: "work",
              primary: true,
            },
          ]
        );

        setTags(foundContact.customFields?.tags || []);

        // Set all available tags (for demonstration, using existing tags)
        const existingTags = foundContact.customFields?.tags || [];
        const mockAllTags = [
          "VIP",
          "Developer",
          "Remote",
          "Marketing",
          "Consultant",
          "Designer",
          "Freelancer",
          "Creative",
          "Legal",
          "Partner",
          "Startup",
          "Technology",
          "Executive",
          "Writer",
          ...existingTags,
        ];
        setAllTags([...new Set(mockAllTags)]);
      } catch (err) {
        console.error("Error fetching contact:", err);
        setError("Failed to load contact");
      } finally {
        setLoading(false);
      }
    };

    if (contactId) {
      fetchContact();
    }
  }, [contactId]);

  // Email handlers
  const handleAddEmail = () => {
    setEmails([...emails, { address: "", type: "work", primary: false }]);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleUpdateEmail = (
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

  // Phone handlers
  const handleAddPhone = () => {
    setPhones([...phones, { number: "", type: "work", primary: false }]);
  };

  const handleRemovePhone = (index: number) => {
    const newPhones = phones.filter((_, i) => i !== index);
    setPhones(newPhones);
  };

  const handleUpdatePhone = (
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

  // Website handlers
  const handleAddWebsite = () => {
    setWebsites([...websites, { url: "", type: "work", primary: false }]);
  };

  const handleRemoveWebsite = (index: number) => {
    const newWebsites = websites.filter((_, i) => i !== index);
    setWebsites(newWebsites);
  };

  const handleUpdateWebsite = (
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

  // Address handlers
  const handleAddAddress = () => {
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

  const handleRemoveAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  const handleUpdateAddress = (
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Validate required fields
      if (contactType === "person" && (!firstName || !lastName)) {
        setError("First name and last name are required");
        return;
      }

      if (contactType === "company" && !companyName) {
        setError("Company name is required");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form data:", {
        contactType,
        profilePhoto,
        dateOfBirth,
        prefix,
        firstName,
        middleName,
        lastName,
        companyName,
        title,
        emails,
        phones,
        websites,
        addresses,
        tags,
      });

      // Redirect to view page after successful save
      router.push(`/contacts/${contactId}`);
    } catch (err) {
      console.error("Error saving contact:", err);
      setError("Failed to save contact");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container max-w-4xl mx-auto py-6">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error && !contact) {
    return (
      <AppLayout>
        <div className="container max-w-4xl mx-auto py-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
              <Button
                variant="outline"
                onClick={() => router.push("/contacts")}
                className="mt-4"
              >
                Back to Contacts
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-semibold">
                  Edit Contact: {firstName} {lastName}
                </h1>
                <p className="text-gray-600">
                  {contactType === "company" && companyName
                    ? companyName
                    : contact?.company
                    ? `${contact.company.position} at ${contact.company.name}`
                    : "Update contact information"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/contacts/${contactId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Contact"}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {/* Contact Type & Profile Photo */}
            <ContactTypeSelector
              contactType={contactType}
              onContactTypeChange={setContactType}
              profilePhoto={profilePhoto}
              onProfilePhotoChange={setProfilePhoto}
              disabled={false}
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
              disabled={false}
            />

            {/* Email */}
            <EmailSection
              emails={emails}
              onAddEmail={handleAddEmail}
              onRemoveEmail={handleRemoveEmail}
              onUpdateEmail={handleUpdateEmail}
              disabled={false}
            />

            {/* Phone */}
            <PhoneSection
              phones={phones}
              onAddPhone={handleAddPhone}
              onRemovePhone={handleRemovePhone}
              onUpdatePhone={handleUpdatePhone}
              disabled={false}
            />

            {/* Website */}
            <WebsiteSection
              websites={websites}
              onAddWebsite={handleAddWebsite}
              onRemoveWebsite={handleRemoveWebsite}
              onUpdateWebsite={handleUpdateWebsite}
              disabled={false}
            />

            {/* Address */}
            <AddressSection
              addresses={addresses}
              onAddAddress={handleAddAddress}
              onRemoveAddress={handleRemoveAddress}
              onUpdateAddress={handleUpdateAddress}
              disabled={false}
            />

            {/* Tags */}
            <TagsSection
              tags={tags}
              onTagsChange={setTags}
              allTags={allTags}
              onAllTagsUpdate={setAllTags}
              disabled={false}
            />

            {/* Save Button (Bottom) */}
            <div className="flex justify-end pt-6 border-t">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/contacts/${contactId}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Contact"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
