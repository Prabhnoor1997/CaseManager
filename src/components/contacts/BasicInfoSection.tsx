"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import NewCompanyModal from "./NewCompanyModal";

interface Company {
  id: string;
  name: string;
}

interface BasicInfoSectionProps {
  contactType: "person" | "company";
  // Person fields
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth?: Date;
  // Company fields
  companyName: string;
  title: string;
  // Handlers
  onPrefixChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onMiddleNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onDateOfBirthChange: (date: Date | undefined) => void;
}

export default function BasicInfoSection({
  contactType,
  prefix,
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  companyName,
  title,
  onPrefixChange,
  onFirstNameChange,
  onMiddleNameChange,
  onLastNameChange,
  onCompanyNameChange,
  onTitleChange,
  onDateOfBirthChange,
}: BasicInfoSectionProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);

  // Fetch companies when component mounts and when contact type is person
  useEffect(() => {
    if (contactType === "person") {
      fetchCompanies();
    }
  }, [contactType]);

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      // For now, we'll use an empty array since we don't have the companies API endpoint
      // In a real implementation, you would fetch from /api/companies or similar
      setCompanies([]);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const handleCompanySelect = (value: string) => {
    if (value === "add-new") {
      setIsNewCompanyModalOpen(true);
    } else {
      const selectedCompany = companies.find((c) => c.id === value);
      onCompanyNameChange(selectedCompany?.name || value);
    }
  };

  const handleNewCompanyCreated = (newCompany: {
    id: string;
    name: string;
  }) => {
    // Add the new company to the list
    setCompanies((prev) => [...prev, newCompany]);
    // Select the new company
    onCompanyNameChange(newCompany.name);
    // Close the modal
    setIsNewCompanyModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          {contactType === "person" ? (
            // Person fields
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="prefix" className="text-sm">
                    Prefix
                  </Label>
                  <Input
                    id="prefix"
                    value={prefix}
                    onChange={(e) => onPrefixChange(e.target.value)}
                    placeholder=""
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">
                    First name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => onFirstNameChange(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-sm">
                    Middle name
                  </Label>
                  <Input
                    id="middleName"
                    value={middleName}
                    onChange={(e) => onMiddleNameChange(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">
                    Last name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => onLastNameChange(e.target.value)}
                    required
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm">
                    Company
                  </Label>
                  <Select
                    value={companyName || ""}
                    onValueChange={handleCompanySelect}
                    disabled={isLoadingCompanies}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue
                        placeholder={
                          isLoadingCompanies
                            ? "Loading companies..."
                            : "What's the company's name?"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                      <SelectItem
                        value="add-new"
                        className="text-blue-600 font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add new company
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder=""
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Date of birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 w-full justify-start text-left font-normal",
                          !dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        {dateOfBirth ? (
                          format(dateOfBirth, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={onDateOfBirthChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </>
          ) : (
            // Company fields
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => onCompanyNameChange(e.target.value)}
                required
                className="h-9 max-w-md"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <NewCompanyModal
        isOpen={isNewCompanyModalOpen}
        onClose={() => setIsNewCompanyModalOpen(false)}
        onCompanyCreated={handleNewCompanyCreated}
      />
    </>
  );
}
