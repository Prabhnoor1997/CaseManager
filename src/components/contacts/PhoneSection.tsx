"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface PhoneEntry {
  number: string;
  type: string;
  primary: boolean;
}

interface PhoneSectionProps {
  phones: PhoneEntry[];
  onAddPhone: () => void;
  onRemovePhone: (index: number) => void;
  onUpdatePhone: (
    index: number,
    field: keyof PhoneEntry,
    value: string | boolean
  ) => void;
  disabled?: boolean;
}

export default function PhoneSection({
  phones,
  onAddPhone,
  onRemovePhone,
  onUpdatePhone,
  disabled = false,
}: PhoneSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Phone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {phones.map((phone, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="text-sm">Phone number</Label>
              <Input
                value={phone.number}
                onChange={(e) => onUpdatePhone(index, "number", e.target.value)}
                placeholder=""
                type="tel"
                className="h-10"
                disabled={disabled}
              />
            </div>
            <div className="w-24 space-y-2">
              <Label className="text-sm">Type</Label>
              <Select
                value={phone.type}
                onValueChange={(value) => onUpdatePhone(index, "type", value)}
                disabled={disabled}
              >
                <SelectTrigger className="mb-0" style={{ height: "40px" }}>
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
            <div className="flex items-center gap-2 h-10">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id={`phone-primary-${index}`}
                  name="phone-primary"
                  checked={phone.primary}
                  onChange={() => onUpdatePhone(index, "primary", true)}
                  className="h-3 w-3"
                  disabled={disabled}
                />
                <Label htmlFor={`phone-primary-${index}`} className="text-sm">
                  Primary
                </Label>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePhone(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        {!disabled && (
          <Button
            type="button"
            variant="link"
            onClick={onAddPhone}
            className="flex items-center gap-2 text-blue-600 h-auto p-0"
          >
            <Plus className="h-4 w-4" />
            Add phone number
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
