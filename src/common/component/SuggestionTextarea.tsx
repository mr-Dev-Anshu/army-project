
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useGetFieldSuggestions } from "@/features/suggestions/hooks";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionTextareaProps extends Omit<React.ComponentProps<"textarea">, "onChange" | "value"> {
    label?: React.ReactNode;
    placeholder?: string;
    value?: string;
    onChange?: (v: string) => void;
    onItemSelect?: (selectedValue: string) => void;
    fieldType: string;
    className?: string;
    defaultOptions?: (string | { label: string; value: string })[];
}

export function SuggestionTextarea({
    label,
    placeholder,
    value = "",
    onChange,
    onItemSelect,
    fieldType,
    className,
    defaultOptions = [],
    ...props
}: SuggestionTextareaProps) {
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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                <Textarea
                    placeholder={placeholder}
                    value={safeValue}
                    onChange={handleChange}
                    onFocus={() => setShowSuggestions(true)}
                    className={cn("bg-white min-h-[100px]", className)}
                    autoComplete="off"
                    {...props}
                />
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
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 whitespace-pre-wrap"
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
