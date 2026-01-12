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
    defaultOptions?: string[]; // Options to show when search is empty (e.g. from current page)
    mode?: "dropdown" | "list-checkbox"; // New prop to switch between dropdown and inline list with checkboxes
}

export function AsyncSearchableSelect({
    fieldType,
    value,
    onValueChange,
    label,
    placeholder = "Select...",
    className,
    defaultOptions = [],
    mode = "dropdown"
}: AsyncSearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Use the suggestion hook
    // Only fetch if we are NOT showing default options (search is non-empty) OR if we have no default options.
    // Actually, we can just let it fetch (it caches), but we prioritize defaultOptions for display if search is empty.
    const { data: responseData, isLoading: isApiLoading } = useGetFieldSuggestions(fieldType, search);

    // Determine what to show
    // If user has NOT typed anything and we have defaultOptions, show them.
    // Otherwise, show API results.
    const showDefaultOptions = !search && defaultOptions.length > 0;

    const suggestions = showDefaultOptions
        ? defaultOptions
        : (responseData?.data || []).map((item: any) => item.value);

    const isLoading = showDefaultOptions ? false : isApiLoading;

    // Parse values for multi-select
    // We assume multiple values are stored as comma-separated string
    const selectedValues = value ? value.split(",").filter(v => v && v !== "All") : [];

    const handleToggle = (option: string) => {
        let newValues: string[] = [];
        if (option === "") {
            // Selected "All" -> clear filter
            newValues = [];
        } else {
            if (selectedValues.includes(option)) {
                newValues = selectedValues.filter(v => v !== option);
            } else {
                newValues = [...selectedValues, option];
            }
        }
        onValueChange(newValues.join(","));
    };

    // Reset search when closing (only for dropdown)
    useEffect(() => {
        if (!open && mode === "dropdown") {
            setSearch("");
        }
    }, [open, mode]);


    /* ================= LIST CHECKBOX MODE (INLINE) ================= */
    if (mode === "list-checkbox") {
        return (
            <div className={cn("border border-gray-200 rounded-md bg-white overflow-hidden", className)}>
                <div className="p-2 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-100 bg-white"
                        />
                        {isLoading && (
                            <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-blue-600" />
                        )}
                    </div>
                </div>

                <div className="max-h-[220px] overflow-y-auto p-1">
                    {/* All Option */}
                    <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer text-sm">
                        <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            selectedValues.length === 0 ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                        )}>
                            {selectedValues.length === 0 && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedValues.length === 0}
                            onChange={() => handleToggle("")}
                        />
                        <span className={cn(selectedValues.length === 0 ? "text-blue-700 font-medium" : "text-gray-700")}>
                            All
                        </span>
                    </label>

                    {/* Options */}
                    {suggestions.length === 0 && !isLoading ? (
                        <div className="px-3 py-2 text-xs text-gray-500 text-center">
                            No options found
                        </div>
                    ) : (
                        suggestions.map((option: string) => {
                            const isSelected = selectedValues.includes(option);
                            return (
                                <label key={option} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer text-sm">
                                    <div className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                        isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                                    )}>
                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isSelected}
                                        onChange={() => handleToggle(option)}
                                    />
                                    <span className={cn(isSelected ? "text-blue-700 font-medium" : "text-gray-700")}>
                                        {option}
                                    </span>
                                </label>
                            )
                        })
                    )}
                </div>
            </div>
        )
    }

    /* ================= DROPDOWN MODE (LEGACY) ================= */
    const displayText = value || placeholder;
    const isActive = !!value;

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
