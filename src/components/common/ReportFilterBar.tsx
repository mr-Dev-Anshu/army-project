import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, Calendar, Plus, ArrowUpDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  offenceType?: string;
  date?: string;
  actionStatus?: string;
  priceListStatus?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

interface ReportFilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  offenceTypeOptions?: string[];
  placeholder?: string;
  showDate?: boolean;
  showActionStatus?: boolean;
  statusLabel?: string;
  actionStatusOptions?: string[];
  showOffenceType?: boolean;
  showPriceListFilter?: boolean;
  onAddNew?: () => void;
  onReset?: () => void;
  showSort?: boolean;
  showFilter?: boolean;
}

export default function ReportFilterBar({
  filters,
  onFilterChange,
  offenceTypeOptions = [],
  placeholder = "Search by offence type...",
  showDate = true,
  showActionStatus = true,
  statusLabel = "Action Status",
  actionStatusOptions = ["Pending", "Taken"],
  showOffenceType = true,
  showPriceListFilter = false,
  onAddNew,
  onReset,
  showSort = false,
  showFilter = false,
}: ReportFilterBarProps) {

  const isFilterActive = showPriceListFilter && filters.priceListStatus && filters.priceListStatus !== "All";

  return (
    <div className="flex gap-3 justify-between items-center mb-6">
      <div className="flex flex-1 gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-[220px] ">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500", filters.search && "text-blue-600")} />
          <Input
            type="text"
            placeholder={placeholder}
            className={cn("pl-9 bg-white border-gray-300 w-full", filters.search && "border-blue-200 bg-blue-50 text-blue-600")}
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>

        {/* Offence Type Select */}
        {showOffenceType && (
          <div className="w-[220px] shrink-0">
            <Select
              value={filters.offenceType || "All"}
              onValueChange={(value) => onFilterChange("offenceType", value)}
            >
              <SelectTrigger className={cn("bg-white border-gray-300 w-[220px]", filters.offenceType !== "All" && "border-blue-200 bg-blue-50 text-blue-600")}>
                <div className="flex items-center truncate">
                  <span className={cn("text-gray-500 mr-1", filters.offenceType !== "All" && "text-blue-600")}>Offence Type:</span>
                  <SelectValue placeholder="All" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {offenceTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Input */}
        {showDate && (
          <div className={cn(
            "flex items-center h-9 border border-gray-300 rounded-md bg-white px-2 w-auto min-w-[200px] hover:bg-gray-50 transition-colors cursor-pointer group shrink-0",
            filters.date && "border-blue-200 bg-blue-50"
          )}>
            <span className={cn("text-gray-500 mr-2 text-sm text-[16px]", filters.date && "text-blue-600")}>Date:</span>
            <input
              type="date"
              value={filters.date || ""}
              onChange={(e) => onFilterChange("date", e.target.value)}
              className={cn("bg-transparent border-none p-0 text-sm text-[16px] text-gray-900 focus:outline-none h-full w-full cursor-pointer font-medium uppercase font-sans placeholder-gray-500", filters.date && "text-blue-600")}
              style={{ colorScheme: "light" }}
            />
          </div>
        )}

        {/* Action Status Select */}
        {showActionStatus && (
          <div className="max-w-[200px] shrink-0">
            <Select
              value={filters.actionStatus || "All"}
              onValueChange={(value) => onFilterChange("actionStatus", value)}
            >
              <SelectTrigger className={cn("bg-white border-gray-300", filters.actionStatus !== "All" && "border-blue-200 bg-blue-50 text-blue-600")}>
                <div className="flex items-center truncate">
                  <span className={cn("text-gray-500 mr-1", filters.actionStatus !== "All" && "text-blue-600")}>{statusLabel}:</span>
                  <SelectValue placeholder="All" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {actionStatusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Filter Button */}
        {showFilter && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "w-10 h-9 shrink-0 ml-1 transition-colors",
                  isFilterActive
                    ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                    : "bg-white border-gray-300 hover:bg-gray-50 text-[#0A0A0A]"
                )}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11.125C9.41421 11.125 9.75 11.4608 9.75 11.875C9.75 12.2892 9.41421 12.625 9 12.625H6C5.58579 12.625 5.25 12.2892 5.25 11.875C5.25 11.4608 5.58579 11.125 6 11.125H9ZM11.25 6.625C11.6642 6.625 12 6.96079 12 7.375C12 7.78921 11.6642 8.125 11.25 8.125H3.75C3.33579 8.125 3 7.78921 3 7.375C3 6.96079 3.33579 6.625 3.75 6.625H11.25ZM14.25 2.125C14.6642 2.125 15 2.46079 15 2.875C15 3.28921 14.6642 3.625 14.25 3.625H0.75C0.335786 3.625 0 3.28921 0 2.875C0 2.46079 0.335786 2.125 0.75 2.125H14.25Z" fill="currentColor" />
                </svg>

              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="">
              {showPriceListFilter && (
                <>
                  <DropdownMenuLabel className={cn(filters.priceListStatus !== "All" && "text-blue-600")}>Price List Status</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={filters.priceListStatus || "All"}
                    onValueChange={(value) => onFilterChange("priceListStatus", value)}
                  >
                    <DropdownMenuRadioItem value="All" className="cursor-pointer">All</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Approved" className="cursor-pointer">Approved</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Not Approved" className="cursor-pointer">Not Approved</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                </>
              )}
              {onReset && (
                <DropdownMenuItem onClick={onReset} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <span className="flex items-center gap-2">
                    Reset Filter
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Add New Button */}
      {onAddNew && (
        <Button
          onClick={onAddNew}
          className="ml-auto bg-[#0088FF] hover:bg-[#0088FF] cursor-pointer text-white gap-2 px-4 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      )}
    </div>
  );
}
