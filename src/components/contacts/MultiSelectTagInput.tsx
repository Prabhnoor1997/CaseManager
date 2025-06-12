"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import TagManagementModal from "./TagManagementModal";

interface MultiSelectTagInputProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onNewTagCreate?: (tagName: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxTags?: number;
}

export default function MultiSelectTagInput({
  allTags,
  selectedTags,
  onTagsChange,
  onNewTagCreate,
  disabled = false,
  placeholder = "Select tags...",
  maxTags = 50,
}: MultiSelectTagInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createTagName, setCreateTagName] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasSearchResults = filteredTags.length > 0;
  const exactMatch = allTags.some(
    (tag) => tag.toLowerCase() === searchTerm.toLowerCase()
  );

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    onTagsChange(newSelectedTags);
  };

  const handleCreateNewTag = () => {
    setCreateTagName(searchTerm.trim());
    setIsCreateModalOpen(true);
    setIsOpen(false); // Close the dropdown
  };

  const handleTagsUpdate = (updatedTags: string[]) => {
    // Find newly created tags
    const newTags = updatedTags.filter((tag) => !allTags.includes(tag));

    if (newTags.length > 0) {
      // Add the new tag to selected tags
      const newSelectedTags = [...selectedTags, ...newTags];
      onTagsChange(newSelectedTags);

      // Notify parent about new tag creation
      if (onNewTagCreate) {
        newTags.forEach((tag) => onNewTagCreate(tag));
      }
    }

    setSearchTerm("");
    setCreateTagName("");
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getDisplayText = () => {
    if (selectedTags.length === 0) return placeholder;
    if (selectedTags.length === 1) return selectedTags[0];
    return `${selectedTags.length} tags selected`;
  };

  const showCreateOption = searchTerm.trim().length > 0 && !exactMatch;

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "h-9 justify-between font-normal",
              !selectedTags.length && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <span className="truncate">{getDisplayText()}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {/* Show add new tag option */}
            {showCreateOption && (
              <div className="border-b">
                <div
                  className="flex items-center p-3 hover:bg-accent cursor-pointer"
                  onClick={handleCreateNewTag}
                >
                  <Plus className="h-4 w-4 mr-3 text-blue-600" />
                  <span className="text-sm text-blue-600">New contact tag</span>
                </div>
              </div>
            )}

            {/* Show filtered tags */}
            {hasSearchResults ? (
              <div className="p-1">
                {filteredTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  const isDisabled =
                    !isSelected && selectedTags.length >= maxTags;

                  return (
                    <div
                      key={tag}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-sm cursor-pointer hover:bg-accent",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => !isDisabled && handleTagToggle(tag)}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        className="h-4 w-4"
                      />
                      <span className="text-sm flex-1">{tag}</span>
                    </div>
                  );
                })}
              </div>
            ) : searchTerm && !showCreateOption ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No tags found
              </div>
            ) : null}

            {/* Show all tags when no search term */}
            {!searchTerm && (
              <div className="p-1">
                {allTags.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No tags available. Click &ldquo;Manage tags&rdquo; to create
                    some.
                  </div>
                ) : (
                  allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    const isDisabled =
                      !isSelected && selectedTags.length >= maxTags;

                    return (
                      <div
                        key={tag}
                        className={cn(
                          "flex items-center space-x-3 p-2 rounded-sm cursor-pointer hover:bg-accent",
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => !isDisabled && handleTagToggle(tag)}
                      >
                        <Checkbox
                          checked={isSelected}
                          disabled={isDisabled}
                          className="h-4 w-4"
                        />
                        <span className="text-sm flex-1">{tag}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {selectedTags.length >= maxTags && (
            <div className="border-t p-3">
              <p className="text-xs text-red-600">
                Maximum of {maxTags} tags reached
              </p>
            </div>
          )}

          <div className="border-t p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {selectedTags.length} of {maxTags} selected
              </span>
              {searchTerm && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearSearch}
                  className="h-6 px-2 text-xs"
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <TagManagementModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        allTags={allTags}
        onTagsUpdate={handleTagsUpdate}
        mode="create-only"
        initialTagName={createTagName}
      />
    </>
  );
}
