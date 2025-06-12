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
  Phone,
  Mail,
  Building,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

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

interface ContactsResponse {
  contacts: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

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

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (activeTab === "people") params.append("type", "individual");
      if (activeTab === "companies")
        params.append("type", "business,organization");

      const response = await fetch(`/api/contacts?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }

      const data: ContactsResponse = await response.json();
      setContacts(data.contacts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage, activeTab]);

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
              onClick={() => {
                /* Handle manage tags */
              }}
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
                  <Button variant="outline">Columns</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Show/Hide Columns</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filters</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Status Filters</DropdownMenuItem>
                  <DropdownMenuItem>Type Filters</DropdownMenuItem>
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
                No contacts found.
              </h3>
              <p className="text-gray-500">
                Track every detail about all of your clients and contacts.
              </p>
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
                                onClick={() =>
                                  window.open(`mailto:${contact.email}`)
                                }
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(`tel:${contact.phone}`)
                                }
                              >
                                <Phone className="mr-2 h-4 w-4" />
                                Call
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
                <span className="text-sm text-gray-600">No results found</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  </Button>
                  <span className="text-sm text-gray-600">Expand rows</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
