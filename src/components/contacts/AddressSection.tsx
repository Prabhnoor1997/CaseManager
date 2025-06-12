"use client";

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
import { Plus } from "lucide-react";
import { Country } from "country-state-city";

interface AddressEntry {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;
  primary: boolean;
}

interface AddressSectionProps {
  addresses: AddressEntry[];
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onUpdateAddress: (
    index: number,
    field: keyof AddressEntry,
    value: string | boolean
  ) => void;
}

export default function AddressSection({
  addresses,
  onAddAddress,
  onRemoveAddress,
  onUpdateAddress,
}: AddressSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {addresses.map((address, index) => (
          <div key={index} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-sm">Street</Label>
                <Textarea
                  value={address.street}
                  onChange={(e) =>
                    onUpdateAddress(index, "street", e.target.value)
                  }
                  placeholder=""
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">City</Label>
                <Input
                  value={address.city}
                  onChange={(e) =>
                    onUpdateAddress(index, "city", e.target.value)
                  }
                  placeholder=""
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">State/Province</Label>
                <Input
                  value={address.state}
                  onChange={(e) =>
                    onUpdateAddress(index, "state", e.target.value)
                  }
                  placeholder=""
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Zip/Postal code</Label>
                <Input
                  value={address.zipCode}
                  onChange={(e) =>
                    onUpdateAddress(index, "zipCode", e.target.value)
                  }
                  placeholder=""
                  className="h-9 mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Country</Label>
                <Select
                  value={address.country}
                  onValueChange={(value) =>
                    onUpdateAddress(index, "country", value)
                  }
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Country.getAllCountries().map((country) => (
                      <SelectItem key={country.isoCode} value={country.name}>
                        {country.name} ({country.isoCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Type</Label>
                <Select
                  value={address.type}
                  onValueChange={(value) =>
                    onUpdateAddress(index, "type", value)
                  }
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id={`address-primary-${index}`}
                  name="address-primary"
                  checked={address.primary}
                  onChange={() => onUpdateAddress(index, "primary", true)}
                  className="h-3 w-3"
                />
                <Label htmlFor={`address-primary-${index}`} className="text-sm">
                  Primary
                </Label>
              </div>
              {addresses.length > 1 && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => onRemoveAddress(index)}
                  className="text-red-600 h-auto p-0"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="link"
          onClick={onAddAddress}
          className="flex items-center gap-2 text-blue-600 h-auto p-0"
        >
          <Plus className="h-4 w-4" />
          Add address
        </Button>
      </CardContent>
    </Card>
  );
}
