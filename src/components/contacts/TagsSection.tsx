"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Info } from "lucide-react";
import TagManagementModal from "./TagManagementModal";

interface TagsSectionProps {
  tags: string[];
  newTag: string;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  allTags?: string[]; // All available tags for management
  onAllTagsUpdate?: (tags: string[]) => void; // Callback to update all tags
}

export default function TagsSection({
  tags,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  allTags = [],
  onAllTagsUpdate = () => {},
}: TagsSectionProps) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddTag();
    }
  };

  const handleTagsUpdate = (updatedTags: string[]) => {
    onAllTagsUpdate(updatedTags);
    // Remove any tags from current selection that no longer exist
    const newSelectedTags = tags.filter((tag) => updatedTags.includes(tag));
    if (newSelectedTags.length !== tags.length) {
      // If any tags were removed, we need to update the selected tags
      // This would need to be handled by the parent component
      newSelectedTags.forEach((tag) => {
        if (!tags.includes(tag)) {
          onRemoveTag(tag);
        }
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Tags</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setIsManageModalOpen(true)}
            >
              Manage tags
            </Button>
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
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  Add up to 50 tags to a contact for easier searching,
                  filtering, and categorization. The tags will appear on a
                  contact&apos;s dashboard, the contacts table, related contacts
                  section in a matter&apos;s dashboard, and contact selector
                  drop-downs.
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 h-auto p-0 mt-1 text-sm"
                >
                  How do I manage my contact tags?
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={handleKeyPress}
              className="h-9"
              disabled={tags.length >= 50}
            />
            <Button
              type="button"
              onClick={onAddTag}
              disabled={!newTag.trim() || tags.length >= 50}
              size="sm"
              className="h-9"
            >
              Add
            </Button>
          </div>
          {tags.length >= 50 && (
            <p className="text-sm text-red-600 mt-2">
              Maximum of 50 tags reached
            </p>
          )}
        </CardContent>
      </Card>

      <TagManagementModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        allTags={allTags}
        onTagsUpdate={handleTagsUpdate}
      />
    </>
  );
}
