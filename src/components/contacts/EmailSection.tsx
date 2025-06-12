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

interface EmailEntry {
  address: string;
  type: string;
  primary: boolean;
}

interface EmailSectionProps {
  emails: EmailEntry[];
  onAddEmail: () => void;
  onRemoveEmail: (index: number) => void;
  onUpdateEmail: (
    index: number,
    field: keyof EmailEntry,
    value: string | boolean
  ) => void;
}

export default function EmailSection({
  emails,
  onAddEmail,
  onRemoveEmail,
  onUpdateEmail,
}: EmailSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {emails.map((email, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="text-sm">Email address</Label>
              <Input
                value={email.address}
                onChange={(e) =>
                  onUpdateEmail(index, "address", e.target.value)
                }
                placeholder=""
                type="email"
                className="h-10"
              />
            </div>
            <div className="w-24 space-y-2">
              <Label className="text-sm">Type</Label>
              <Select
                value={email.type}
                onValueChange={(value) => onUpdateEmail(index, "type", value)}
              >
                <SelectTrigger className="mb-0" style={{ height: "40px" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 h-10">
              <div className="flex items-center gap-1">
                <input
                  type="radio"
                  id={`email-primary-${index}`}
                  name="email-primary"
                  checked={email.primary}
                  onChange={() => onUpdateEmail(index, "primary", true)}
                  className="h-3 w-3"
                />
                <Label htmlFor={`email-primary-${index}`} className="text-sm">
                  Primary
                </Label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveEmail(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="link"
          onClick={onAddEmail}
          className="flex items-center gap-2 text-blue-600 h-auto p-0"
        >
          <Plus className="h-4 w-4" />
          Add email address
        </Button>
      </CardContent>
    </Card>
  );
}
