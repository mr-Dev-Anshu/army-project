

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetFieldSuggestions } from "@/features/suggestions/hooks";
import { Loader2 } from "lucide-react";

interface SuggestionInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  fieldType: string;
  className?: string;
  defaultOptions?: (string | { label: string; value: string })[];
}

export function SuggestionInput({
  label,
  placeholder,
  value = "",
  onChange,
  type = "text",
  fieldType,
  className = "",
  defaultOptions = [],
}: SuggestionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetFieldSuggestions(fieldType, value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions =
    data && data.data && Array.isArray(data.data) ? data.data : [];

  const handleSelect = (val: string) => {
    onChange?.(val);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-1 w-full relative" ref={wrapperRef}>
      {label && <Label className="mb-2.5 mt-2 ">{label}</Label>}

      {/* 🔥 BORDER ALWAYS HERE (same as vehicle form) */}
      <div
        className={`w-full border rounded-md bg-white transition-all ${className}`}
      >
        <Input
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => {
            onChange?.(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="border-none shadow-none focus-visible:ring-0"
          autoComplete="off"
        />
      </div>

      {showSuggestions && (
        <div className="absolute z-[9999] w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {isLoading && (
            <div className="p-2 text-sm text-gray-500 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
            </div>
          )}

          {!isLoading &&
            suggestions.map((item: any, idx: number) => (
              <div
                key={idx}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                onClick={() => handleSelect(item.value)}
              >
                {item.value}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
