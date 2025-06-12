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

interface WebsiteEntry {
  url: string;
  type: string;
  primary: boolean;
}

interface WebsiteSectionProps {
  websites: WebsiteEntry[];
  onAddWebsite: () => void;
  onRemoveWebsite: (index: number) => void;
  onUpdateWebsite: (
    index: number,
    field: keyof WebsiteEntry,
    value: string | boolean
  ) => void;
  disabled?: boolean;
}

export default function WebsiteSection({
  websites,
  onAddWebsite,
  onRemoveWebsite,
  onUpdateWebsite,
  disabled = false,
}: WebsiteSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Website</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {websites.map((website, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="text-sm">Web address</Label>
              <Input
                value={website.url}
                onChange={(e) => onUpdateWebsite(index, "url", e.target.value)}
                placeholder=""
                type="url"
                className="h-10"
                disabled={disabled}
              />
            </div>
            <div className="w-24 space-y-2">
              <Label className="text-sm">Type</Label>
              <Select
                value={website.type}
                onValueChange={(value) => onUpdateWebsite(index, "type", value)}
                disabled={disabled}
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
                  id={`website-primary-${index}`}
                  name="website-primary"
                  checked={website.primary}
                  onChange={() => onUpdateWebsite(index, "primary", true)}
                  className="h-3 w-3"
                  disabled={disabled}
                />
                <Label htmlFor={`website-primary-${index}`} className="text-sm">
                  Primary
                </Label>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveWebsite(index)}
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
            onClick={onAddWebsite}
            className="flex items-center gap-2 text-blue-600 h-auto p-0"
          >
            <Plus className="h-4 w-4" />
            Add website
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
