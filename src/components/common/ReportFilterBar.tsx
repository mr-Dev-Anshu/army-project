// components/common/ReportFilterBar.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { SearchableSelect } from "./SearchableSelect";

/* ================= TYPES ================= */
export interface FilterState {
  search: string;
  offenceType?: string;
  fromDate?: string;
  toDate?: string;
  actionStatus?: string;
  unit?: string;
  fmn?: string;
  priceListStatus?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

interface ReportFilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  offenceTypeOptions?: string[];
  placeholder?: string;
  showDateRange?: boolean;
  showActionStatus?: boolean;
  statusLabel?: string;
  actionStatusOptions?: string[];
  showOffenceType?: boolean;
  onAddNew?: () => void;
  onReset?: () => void;
}

/* ================= STATIC OPTIONS ================= */
const UNIT_OPTIONS = [
  "hq 21 corps",
  "21 corps signal regt",
  "unit 3",
  "5221 asc bn",
  "11 engr regt",
  "12 jak li",
  "rakhi",
  "21 corps",
  "104 infantry brigade",
  "mp unit fallback",
];

const FMN_OPTIONS = [
  "hq 21 corps",
  "fmn-21",
  "21 mountain division",
  "central command",
  "western command",
  "hq western command",
  "hq 21 corps pro",
  "rakhi",
  "123",
  "northern command",
];

/* ================= MAIN COMPONENT ================= */
export default function ReportFilterBar({
  filters,
  onFilterChange,
  offenceTypeOptions = [],
  placeholder = "Search by report number or offence...",
  showDateRange = true,
  showActionStatus = true,
  statusLabel = "Action Status",
  actionStatusOptions = ["Pending", "Taken"], // "All" is handled by placeholder
  showOffenceType = true,
  onAddNew,
  onReset,
}: ReportFilterBarProps) {
  return (
    <div className="flex gap-4 items-end justify-between flex-wrap bg-white p-5 rounded-lg border shadow-sm">
      {/* LEFT SIDE - FILTERS */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder={placeholder}
            className="pl-10 w-[210px]"
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>

        {/* Offence Type */}
        {showOffenceType && offenceTypeOptions.length > 0 && (
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Offence Type</label>
            <SearchableSelect
              options={offenceTypeOptions}
              value={filters.offenceType || ""}
              onValueChange={(v) => onFilterChange("offenceType", v)}
              placeholder="All Offence Types"
              className="w-[180px]"
            />
          </div>
        )}

        {/* Date Range */}
        {showDateRange && (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">From Date</label>
              <Input
                type="date"
                className="w-[150px]"
                value={filters.fromDate || ""}
                onChange={(e) => onFilterChange("fromDate", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">To Date</label>
              <Input
                type="date"
                className="w-[150px]"
                value={filters.toDate || ""}
                onChange={(e) => onFilterChange("toDate", e.target.value)}
              />
            </div>
          </>
        )}

        {/* Unit */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Unit</label>
          <SearchableSelect
            options={UNIT_OPTIONS}
            value={filters.unit || ""}
            onValueChange={(v) => onFilterChange("unit", v)}
            placeholder="All Units"
            className="w-[180px]"
          />
        </div>

        {/* FMN */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">FMN</label>
          <SearchableSelect
            options={FMN_OPTIONS}
            value={filters.fmn || ""}
            onValueChange={(v) => onFilterChange("fmn", v)}
            placeholder="All FMNs"
            className="w-[180px]"
          />
        </div>

        {/* Action Status */}
        {showActionStatus && (
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">{statusLabel}</label>
            <SearchableSelect
              options={actionStatusOptions}
              value={filters.actionStatus || ""}
              onValueChange={(v) => onFilterChange("actionStatus", v)}
              placeholder="All"
              className="w-[150px]"
            />
          </div>
        )}

        {/* Reset Button */}
        {onReset && (
          <Button
            variant="outline"
            onClick={onReset}
            className="h-9 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* RIGHT SIDE - ADD NEW */}
      {onAddNew && (
        <Button
          onClick={onAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Report
        </Button>
      )}
    </div>
  );
}