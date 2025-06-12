"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Trash2, Edit2, Check, X, Plus } from "lucide-react";

interface TagManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTags: string[];
  onTagsUpdate: (tags: string[]) => void;
}

export default function TagManagementModal({
  isOpen,
  onClose,
  allTags,
  onTagsUpdate,
}: TagManagementModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    setTags(allTags);
  }, [allTags]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const updatedTags = [...tags, trimmedTag];
      setTags(updatedTags);
      onTagsUpdate(updatedTags);
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
    onTagsUpdate(updatedTags);
  };

  const handleEditTag = (tag: string) => {
    setEditingTag(tag);
    setEditingValue(tag);
  };

  const handleSaveEdit = () => {
    const trimmedValue = editingValue.trim();
    if (
      trimmedValue &&
      trimmedValue !== editingTag &&
      !tags.includes(trimmedValue)
    ) {
      const updatedTags = tags.map((tag) =>
        tag === editingTag ? trimmedValue : tag
      );
      setTags(updatedTags);
      onTagsUpdate(updatedTags);
    }
    setEditingTag(null);
    setEditingValue("");
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditingValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: "add" | "edit") => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (action === "add") {
        handleAddTag();
      } else {
        handleSaveEdit();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add new tag section */}
          <div className="space-y-2">
            <Label htmlFor="new-tag">Add New Tag</Label>
            <div className="flex gap-2">
              <Input
                id="new-tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter new tag"
                onKeyPress={(e) => handleKeyPress(e, "add")}
                className="h-9"
              />
              <Button
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
                size="sm"
                className="h-9"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {newTag.trim() && tags.includes(newTag.trim()) && (
              <p className="text-sm text-red-600">Tag already exists</p>
            )}
          </div>

          {/* Existing tags section */}
          <div className="space-y-2">
            <Label>Existing Tags ({tags.length})</Label>
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-3">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No tags created yet
                </p>
              ) : (
                tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center justify-between gap-2 p-2 rounded-md border bg-gray-50"
                  >
                    {editingTag === tag ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, "edit")}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={
                            !editingValue.trim() ||
                            (editingValue.trim() !== tag &&
                              tags.includes(editingValue.trim()))
                          }
                        >
                          <Check className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3 text-gray-600" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Badge variant="secondary" className="text-sm">
                          {tag}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleEditTag(tag)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-3 w-3 text-blue-600" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteTag(tag)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
