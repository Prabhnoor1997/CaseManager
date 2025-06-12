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
import { Edit, ArrowLeft } from "lucide-react";
import {
  EmailEntry,
  PhoneEntry,
  WebsiteEntry,
  AddressEntry,
} from "@/types/contact";

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

export default function ContactViewPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<any>(null);
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

        setContact(foundContact);

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

  if (error || !contact) {
    return (
      <AppLayout>
        <div className="container max-w-4xl mx-auto py-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error || "Contact not found"}</p>
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
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
                {firstName} {lastName}
              </h1>
              <p className="text-gray-600">
                {contactType === "company" && companyName
                  ? companyName
                  : contact.company
                  ? `${contact.company.position} at ${contact.company.name}`
                  : "Contact Details"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/contacts/${contactId}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Contact
          </Button>
        </div>

        <div className="space-y-6">
          {/* Contact Type & Profile Photo */}
          <ContactTypeSelector
            contactType={contactType}
            onContactTypeChange={() => {}} // No-op for read-only
            profilePhoto={profilePhoto}
            onProfilePhotoChange={() => {}} // No-op for read-only
            disabled={true}
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
            onPrefixChange={() => {}}
            onFirstNameChange={() => {}}
            onMiddleNameChange={() => {}}
            onLastNameChange={() => {}}
            onCompanyNameChange={() => {}}
            onTitleChange={() => {}}
            onDateOfBirthChange={() => {}}
            disabled={true}
          />

          {/* Email */}
          <EmailSection
            emails={emails}
            onAddEmail={() => {}}
            onRemoveEmail={() => {}}
            onUpdateEmail={() => {}}
            disabled={true}
          />

          {/* Phone */}
          <PhoneSection
            phones={phones}
            onAddPhone={() => {}}
            onRemovePhone={() => {}}
            onUpdatePhone={() => {}}
            disabled={true}
          />

          {/* Website */}
          {websites.length > 0 && (
            <WebsiteSection
              websites={websites}
              onAddWebsite={() => {}}
              onRemoveWebsite={() => {}}
              onUpdateWebsite={() => {}}
              disabled={true}
            />
          )}

          {/* Address */}
          <AddressSection
            addresses={addresses}
            onAddAddress={() => {}}
            onRemoveAddress={() => {}}
            onUpdateAddress={() => {}}
            disabled={true}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <TagsSection
              tags={tags}
              onTagsChange={() => {}}
              allTags={tags}
              onAllTagsUpdate={() => {}}
              disabled={true}
            />
          )}

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className="ml-2 capitalize">{contact.status}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <span className="ml-2 capitalize">{contact.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <span className="ml-2">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Updated:</span>
                  <span className="ml-2">
                    {new Date(contact.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
