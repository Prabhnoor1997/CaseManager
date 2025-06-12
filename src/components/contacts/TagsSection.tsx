"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Info } from "lucide-react";
import TagManagementModal from "./TagManagementModal";
import MultiSelectTagInput from "./MultiSelectTagInput";

interface TagsSectionProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  allTags?: string[]; // All available tags for selection
  onAllTagsUpdate?: (tags: string[]) => void; // Callback to update all tags
  disabled?: boolean;
}

export default function TagsSection({
  tags,
  onTagsChange,
  allTags = [],
  onAllTagsUpdate = () => {},
  disabled = false,
}: TagsSectionProps) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onTagsChange(newTags);
  };

  const handleTagsUpdate = (updatedTags: string[]) => {
    onAllTagsUpdate(updatedTags);
    // Remove any tags from current selection that no longer exist
    const newSelectedTags = tags.filter((tag) => updatedTags.includes(tag));
    if (newSelectedTags.length !== tags.length) {
      onTagsChange(newSelectedTags);
    }
  };

  const handleMultiSelectChange = (newSelectedTags: string[]) => {
    onTagsChange(newSelectedTags);
  };

  const handleNewTagCreate = (tagName: string) => {
    // Add the new tag to allTags
    const updatedAllTags = [...allTags, tagName];
    onAllTagsUpdate(updatedAllTags);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Tags</CardTitle>
            {!disabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setIsManageModalOpen(true)}
              >
                Manage tags
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>

          {/* Info box */}
          {!disabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">
                    Add up to 50 tags to a contact for easier searching,
                    filtering, and categorization. The tags will appear on a
                    contact&apos;s dashboard, the contacts table, related
                    contacts section in a matter&apos;s dashboard, and contact
                    selector drop-downs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Multi-select tag input */}
          {!disabled && (
            <div className="space-y-2">
              <MultiSelectTagInput
                allTags={allTags}
                selectedTags={tags}
                onTagsChange={handleMultiSelectChange}
                onNewTagCreate={handleNewTagCreate}
                disabled={tags.length >= 50}
                placeholder="Select tags..."
                maxTags={50}
              />
              {tags.length >= 50 && (
                <p className="text-sm text-red-600">
                  Maximum of 50 tags reached
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <TagManagementModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        allTags={allTags}
        onTagsUpdate={handleTagsUpdate}
        mode="full-management"
      />
    </>
  );
}
