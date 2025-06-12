"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Building,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import TagManagementModal from "@/components/contacts/TagManagementModal";

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
  };
}

// Mock data for demonstration
const mockContacts: Contact[] = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
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
      tags: ["VIP", "Developer", "Remote"],
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
      tags: ["Marketing", "VIP", "Consultant"],
    },
  },
  {
    _id: "3",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@designstudio.com",
    phone: "+1 (555) 456-7890",
    type: "individual",
    status: "prospect",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
    address: {
      street: "789 Pine St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA",
    },
    company: {
      name: "Design Studio",
      position: "Creative Director",
    },
    customFields: {
      tags: ["Designer", "Freelancer", "Creative"],
    },
  },
  {
    _id: "4",
    firstName: "Alice",
    lastName: "Williams",
    email: "alice.williams@lawfirm.com",
    phone: "+1 (555) 321-9876",
    type: "individual",
    status: "active",
    createdAt: "2024-01-18T11:45:00Z",
    updatedAt: "2024-01-18T11:45:00Z",
    address: {
      street: "321 Legal Blvd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    company: {
      name: "Williams & Associates",
      position: "Partner",
    },
    customFields: {
      tags: ["Legal", "VIP", "Partner"],
    },
  },
  {
    _id: "5",
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.chen@startup.io",
    phone: "+1 (555) 654-3210",
    type: "individual",
    status: "active",
    createdAt: "2024-01-19T16:20:00Z",
    updatedAt: "2024-01-19T16:20:00Z",
    address: {
      street: "567 Innovation Dr",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA",
    },
    company: {
      name: "StartupXYZ",
      position: "CTO",
    },
    customFields: {
      tags: ["Startup", "Technology", "Executive"],
    },
  },
  {
    _id: "6",
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah@freelance.com",
    phone: "+1 (555) 789-0123",
    type: "individual",
    status: "prospect",
    createdAt: "2024-01-20T13:10:00Z",
    updatedAt: "2024-01-20T13:10:00Z",
    customFields: {
      tags: ["Freelancer", "Writer", "Remote"],
    },
  },
];

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Filter states
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagSearchTerm, setTagSearchTerm] = useState("");

  // Modal states
  const [isTagManagementModalOpen, setIsTagManagementModalOpen] =
    useState(false);

  // Extract available tags from contacts
  const extractAvailableTags = (contacts: Contact[]) => {
    const tagSet = new Set<string>();
    contacts.forEach((contact) => {
      contact.customFields?.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  };

  // Filter contacts by applied tags
  const filterContactsByTags = (contacts: Contact[]) => {
    if (appliedTags.length === 0) return contacts;
    return contacts.filter((contact) =>
      appliedTags.some((tag) => contact.customFields?.tags?.includes(tag))
    );
  };

  // Fetch contacts (using mock data for demo)
  const fetchContacts = async () => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredData = [...mockContacts];

      // Apply tab filtering
      if (activeTab === "people") {
        filteredData = filteredData.filter(
          (contact) => contact.type === "individual"
        );
      } else if (activeTab === "companies") {
        filteredData = filteredData.filter(
          (contact) =>
            contact.type === "business" || contact.type === "organization"
        );
      }

      // Apply search filtering
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(
          (contact) =>
            contact.firstName.toLowerCase().includes(searchLower) ||
            contact.lastName.toLowerCase().includes(searchLower) ||
            contact.email.toLowerCase().includes(searchLower) ||
            contact.phone.includes(searchTerm) ||
            contact.company?.name.toLowerCase().includes(searchLower) ||
            contact.customFields?.tags?.some((tag) =>
              tag.toLowerCase().includes(searchLower)
            )
        );
      }

      // Extract available tags from all contacts (before tag filtering)
      const allTags = extractAvailableTags(mockContacts);
      setAvailableTags(allTags);

      // Apply tag filtering on the client side
      const finalFilteredContacts = filterContactsByTags(filteredData);
      setContacts(finalFilteredContacts);

      // Mock pagination
      setPagination({
        page: currentPage,
        limit: 10,
        total: finalFilteredContacts.length,
        pages: Math.ceil(finalFilteredContacts.length / 10),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage, activeTab, appliedTags]);

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchContacts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }

      fetchContacts();
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete contact");
    }
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(contacts.map((contact) => contact._id));
    } else {
      setSelectedContacts([]);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatAddress = (address?: Contact["address"]) => {
    if (!address) return "";
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  // Filter available tags based on search term
  const filteredAvailableTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  // Filter handlers
  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleApplyFilters = () => {
    setAppliedTags(selectedTags);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setAppliedTags([]);
    setCurrentPage(1);
    setTagSearchTerm("");
  };

  const handleSelectAllFilteredTags = () => {
    const newSelectedTags = [
      ...new Set([...selectedTags, ...filteredAvailableTags]),
    ];
    setSelectedTags(newSelectedTags);
  };

  const handleDeselectAllFilteredTags = () => {
    const newSelectedTags = selectedTags.filter(
      (tag) => !filteredAvailableTags.includes(tag)
    );
    setSelectedTags(newSelectedTags);
  };

  // Tag management handlers
  const handleTagsUpdate = (updatedTags: string[]) => {
    setAvailableTags(updatedTags);
    // Remove any selected/applied tags that no longer exist
    setSelectedTags((prev) => prev.filter((tag) => updatedTags.includes(tag)));
    setAppliedTags((prev) => prev.filter((tag) => updatedTags.includes(tag)));
  };

  const handleOpenTagManagement = () => {
    setIsTagManagementModalOpen(true);
  };

  const handleCloseTagManagement = () => {
    setIsTagManagementModalOpen(false);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleOpenTagManagement}
            >
              <Settings className="h-4 w-4" />
              Manage tags
            </Button>
            <Button
              onClick={() => router.push("/contacts/new?type=person")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New person
            </Button>
            <Button
              onClick={() => router.push("/contacts/new?type=company")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New company
            </Button>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab("all")}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === "all"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("people")}
                className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === "people"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <User className="h-4 w-4" />
                People
              </button>
              <button
                onClick={() => setActiveTab("companies")}
                className={`flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === "companies"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Building className="h-4 w-4" />
                Companies
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Filter by keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Filters
                    {appliedTags.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {appliedTags.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Contact Tags</h4>

                      {/* Search input for tags */}
                      <div className="relative mb-3">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                        <Input
                          placeholder="Search tags..."
                          value={tagSearchTerm}
                          onChange={(e) => setTagSearchTerm(e.target.value)}
                          className="pl-7 h-8 text-sm"
                        />
                      </div>

                      {/* Select All / Deselect All buttons */}
                      {filteredAvailableTags.length > 0 && (
                        <div className="flex gap-2 mb-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSelectAllFilteredTags}
                            className="h-6 px-2 text-xs"
                            disabled={filteredAvailableTags.every((tag) =>
                              selectedTags.includes(tag)
                            )}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDeselectAllFilteredTags}
                            className="h-6 px-2 text-xs"
                            disabled={
                              !filteredAvailableTags.some((tag) =>
                                selectedTags.includes(tag)
                              )
                            }
                          >
                            Deselect All
                          </Button>
                        </div>
                      )}

                      {/* Tags list */}
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {filteredAvailableTags.length > 0 ? (
                          filteredAvailableTags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded"
                            >
                              <Checkbox
                                checked={selectedTags.includes(tag)}
                                onCheckedChange={() => handleTagSelect(tag)}
                              />
                              <label
                                className="text-sm font-normal cursor-pointer flex-1"
                                onClick={() => handleTagSelect(tag)}
                              >
                                {tag}
                              </label>
                            </div>
                          ))
                        ) : tagSearchTerm ? (
                          <p className="text-sm text-gray-500">
                            No tags found matching &ldquo;{tagSearchTerm}&rdquo;
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No tags available
                          </p>
                        )}
                      </div>

                      {/* Show selected tags count if any */}
                      {selectedTags.length > 0 && (
                        <div className="pt-2 mt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-600">
                            {selectedTags.length} tag
                            {selectedTags.length !== 1 ? "s" : ""} selected
                          </p>
                        </div>
                      )}
                    </div>

                    <DropdownMenuSeparator />

                    <div className="flex gap-2">
                      <Button
                        onClick={handleApplyFilters}
                        className="flex-1"
                        size="sm"
                        disabled={
                          selectedTags.length === 0 && appliedTags.length === 0
                        }
                      >
                        Apply Filters
                      </Button>
                      <Button
                        onClick={handleClearFilters}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                        disabled={
                          selectedTags.length === 0 && appliedTags.length === 0
                        }
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {appliedTags.length > 0 || searchTerm
                  ? "No matching contacts found."
                  : "No contacts found."}
              </h3>
              <p className="text-gray-500">
                {appliedTags.length > 0 || searchTerm
                  ? "Try adjusting your filters or search criteria."
                  : "Track every detail about all of your clients and contacts."}
              </p>
              {(appliedTags.length > 0 || searchTerm) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleClearFilters();
                    setSearchTerm("");
                  }}
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              )}
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => router.push("/contacts/new?type=person")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New person
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/contacts/new?type=company")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New company
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedContacts.length === contacts.length &&
                            contacts.length > 0
                          }
                          onCheckedChange={(checked: boolean) =>
                            handleSelectAll(checked)
                          }
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact._id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedContacts.includes(contact._id)}
                            onCheckedChange={(checked: boolean) =>
                              handleSelectContact(contact._id, checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={contact.customFields?.profilePhoto}
                              />
                              <AvatarFallback className="text-xs">
                                {getInitials(
                                  contact.firstName,
                                  contact.lastName
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">
                                {contact.firstName} {contact.lastName}
                              </div>
                              {contact.company?.name && (
                                <div className="text-xs text-gray-500">
                                  {contact.company.position} at{" "}
                                  {contact.company.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {contact.customFields?.tags?.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            )) || (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {contact.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          {contact.phone ? (
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {contact.phone}
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatAddress(contact.address) || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/contacts/${contact._id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/contacts/${contact._id}/edit`)
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteContact(contact._id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Showing {contacts.length} contact
                  {contacts.length !== 1 ? "s" : ""}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Tag Management Modal */}
      <TagManagementModal
        isOpen={isTagManagementModalOpen}
        onClose={handleCloseTagManagement}
        allTags={availableTags}
        onTagsUpdate={handleTagsUpdate}
        mode="full-management"
      />
    </AppLayout>
  );
}
