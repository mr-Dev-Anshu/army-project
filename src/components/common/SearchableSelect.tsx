// components/ui/SearchableSelect.tsx
import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;           // Optional label (e.g. "Unit", "Status")
  placeholder?: string;     // Optional placeholder when nothing selected
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  label,
  placeholder = "Select...",
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayText = value || placeholder;

  // Whether a real value (not placeholder) is selected
  const isActive = !!value;

  // Filtered options based on search
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset search when closing
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest(".searchable-select")) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className={cn("relative searchable-select", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm bg-white transition-colors",
          "border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
          isActive && "border-blue-200 bg-blue-50 text-blue-700"
        )}
      >
        {/* Show label prefix only if label is provided and no value selected */}
        <span className="flex items-center truncate">
          {label && !value && (
            <span className="text-gray-500 mr-1">{label}:</span>
          )}
          <span className={cn("truncate", isActive && "text-blue-700 font-medium")}>
            {displayText}
          </span>
        </span>
        <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={label ? `Search ${label.toLowerCase()}...` : "Search..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {/* "All" / Clear option */}
            <button
              type="button"
              onClick={() => {
                onValueChange(""); // Clear selection
                setOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100",
                !value && "bg-blue-50 text-blue-700"
              )}
            >
              <Check className={cn("h-4 w-4", !value ? "opacity-100" : "opacity-0")} />
              All
            </button>

            {/* Filtered Options */}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onValueChange(option);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100",
                    value === option && "bg-blue-50 text-blue-700"
                  )}
                >
                  <Check
                    className={cn("h-4 w-4", value === option ? "opacity-100" : "opacity-0")}
                  />
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop for outside click */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}