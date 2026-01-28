

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetFieldSuggestions } from "@/features/suggestions/hooks";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  label?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onItemSelect?: (selectedValue: string) => void;
  type?: string;
  fieldType: string;
  className?: string;
  defaultOptions?: (string | { label: string; value: string })[];
  icon?: React.ReactNode;
  error?: string;
}

export function SuggestionInput({
  label,
  placeholder,
  value = "",
  onChange,
  onItemSelect,
  type = "text",
  fieldType,
  className,
  defaultOptions = [],
  icon,
  ...props
}: SuggestionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetFieldSuggestions(fieldType, value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelect = (suggestion: string) => {
    onChange?.(suggestion);
    onItemSelect?.(suggestion);
    setShowSuggestions(false);
  };




  const suggestions = (data && data.data && Array.isArray(data.data)) ? data.data : [];
  const safeValue = value || "";
  const filteredDefaults = (defaultOptions || [])
    .filter(opt => {
      const val = typeof opt === 'string' ? opt : opt.label;
      return val.toLowerCase().includes(safeValue.toLowerCase()) &&
        !suggestions.some((s: any) => s.value.toLowerCase() === val.toLowerCase());
    })
    .map(opt => typeof opt === 'string' ? { value: opt } : { value: opt.label });

  const allSuggestions = [...filteredDefaults, ...suggestions];
  const showList = showSuggestions && (allSuggestions.length > 0 || isLoading);

  return (
    <div className={cn("space-y-1 relative w-full", className)} ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          type={type}
          placeholder={placeholder}
          value={safeValue}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          className={cn(
            "bg-white",
            icon && "pr-10",
            props.error ? "border-red-500 bg-red-50" : ""
          )}
          autoComplete="off"
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {showList && (
        <div className="absolute z-[9999] w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {isLoading && (
            <div className="p-2 text-sm text-gray-500 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
            </div>
          )}
          {!isLoading && allSuggestions.map((item: any, idx: number) => (
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
      {props.error && <p className="text-xs text-red-500">{props.error}</p>}
    </div>
  );
}
