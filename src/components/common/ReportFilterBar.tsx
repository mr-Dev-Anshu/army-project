// components/common/ReportFilterBar.tsx
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Calendar, Plus, ArrowUpDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchableSelect } from "./SearchableSelect";
import { AsyncSearchableSelect } from "./AsyncSearchableSelect";

/* ================= TYPES ================= */
export interface FilterState {
  search: string;
  offenceType?: string;
  date?: string;
  fromDate?: string;
  toDate?: string;
  actionStatus?: string;
  unit?: string;
  fmn?: string;
  placeOfOffence?: string;
  priceListStatus?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

interface ReportFilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  offenceTypeOptions?: string[];
  unitOptions?: string[];
  fmnOptions?: string[];
  placeOptions?: string[];
  placeholder?: string;
  showDate?: boolean;
  showDateRange?: boolean;
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

/* ================= MAIN COMPONENT ================= */
export default function ReportFilterBar({
  filters,
  onFilterChange,
  offenceTypeOptions = [],
  unitOptions,
  fmnOptions,
  placeOptions,
  placeholder = "Search by report number or offence...",
  showDate = true,
  showDateRange = true,
  showActionStatus = true,
  statusLabel = "Action Status",
  actionStatusOptions = ["Pending", "Taken"], // "All" is handled by placeholder
  showOffenceType = true,
  showPriceListFilter = false,
  onAddNew,
  onReset,
  showSort = false,
  showFilter = false,
}: ReportFilterBarProps) {
  const isFilterActive =
    (showPriceListFilter && filters.priceListStatus && filters.priceListStatus !== "All") ||
    !!filters.fromDate ||
    !!filters.toDate ||
    !!filters.unit ||
    !!filters.fmn ||
    !!filters.placeOfOffence;
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

        {/* Filter Button (Sheet) */}
        {showFilter && (
          <Sheet>
            <SheetTrigger asChild>
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
                <Filter className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[400px] sm:w-[450px] overflow-y-auto"
            >
              <SheetHeader className="mb-6 flex flex-col gap-1 border-b pb-4">
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Apply filters to refine the report list.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6">

                {/* Offence Type (Inside Sheet if screen small or preference) */}
                {/* Note: The user kept simple filters outside, but let's keep advanced ones inside */}

                {/* Action Status Checkbox Group (Example from design image usually has checkboxes, but we'll stick to select/dropdown for now or adapt if requested. Design shows "Select Status" with checkboxes. Sticking to Select for now as per code, can upgrade later if exact match needed) */}
                {/* Actually design shows:
                    Offence Type (Dropdown)
                    Action Status (Dropdown/Checkboxes)
                    Unit (List with checkboxes)
                    FMN
                    Place of Offence
                    Date range
                */}

                {/* Date Range */}
                {showDateRange && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Offence Date</label>
                    <div className="flex gap-4">
                      <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 mb-1">Start Date</label>
                        <Input
                          type="date"
                          className="w-full text-sm"
                          value={filters.fromDate || ""}
                          onChange={(e) => onFilterChange("fromDate", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <label className="text-xs text-gray-500 mb-1">End Date</label>
                        <Input
                          type="date"
                          className="w-full text-sm"
                          value={filters.toDate || ""}
                          onChange={(e) => onFilterChange("toDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Unit */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Unit</label>
                  <label className="text-xs text-gray-500">Select Unit</label>
                  <AsyncSearchableSelect
                    fieldType="unit"
                    value={filters.unit || ""}
                    onValueChange={(v) => onFilterChange("unit", v)}
                    placeholder="Search Unit..."
                    className="w-full"
                    defaultOptions={unitOptions}
                  />
                </div>

                {/* FMN */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">FMN</label>
                  <label className="text-xs text-gray-500">Select Formation</label>
                  <AsyncSearchableSelect
                    fieldType="fmn"
                    value={filters.fmn || ""}
                    onValueChange={(v) => onFilterChange("fmn", v)}
                    placeholder="Search FMN..."
                    className="w-full"
                    defaultOptions={fmnOptions}
                  />
                </div>

                {/* Place of Offence */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Place of Offence</label>
                  <label className="text-xs text-gray-500">Select Location</label>
                  <AsyncSearchableSelect
                    fieldType="placeOfOffence"
                    value={filters.placeOfOffence || ""}
                    onValueChange={(v) => onFilterChange("placeOfOffence", v)}
                    placeholder="Search Location..."
                    className="w-full"
                    defaultOptions={placeOptions}
                  />
                </div>

                {showPriceListFilter && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Price List Status</label>
                    <Select
                      value={filters.priceListStatus || "All"}
                      onValueChange={(value) => onFilterChange("priceListStatus", value)}
                    >
                      <SelectTrigger className="w-full bg-white border-gray-300">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Not Approved">Not Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {onReset && (
                  <Button
                    variant="outline"
                    onClick={onReset}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 mt-4"
                  >
                    Reset All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
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