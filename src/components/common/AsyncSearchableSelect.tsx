import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetFieldSuggestions } from "@/features/suggestions/hooks";

interface AsyncSearchableSelectProps {
    fieldType: string; // The type of field to fetch suggestions for (e.g., "unit", "fmn", "placeOfOffence")
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export function AsyncSearchableSelect({
    fieldType,
    value,
    onValueChange,
    label,
    placeholder = "Select...",
    className,
}: AsyncSearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Use the suggestion hook
    const { data: responseData, isLoading } = useGetFieldSuggestions(fieldType, search);

    // Extract suggestions from response structure { success: true, data: [...] }
    // and map objects { value: "...", count: ... } to simple strings
    const suggestions = (responseData?.data || []).map((item: any) => item.value);

    const displayText = value || placeholder;
    const isActive = !!value;

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

    // Close on outside click is handled by the backdrop div

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
                            {isLoading && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-600" />
                            )}
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

                        {/* Suggestions */}
                        {suggestions.length === 0 && !isLoading ? (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                No options found
                            </div>
                        ) : (
                            suggestions.map((option: string) => (
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
