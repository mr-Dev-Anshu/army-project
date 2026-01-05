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
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

export interface FilterState {
  search: string;
  offenceType?: string;

  // DATE RANGE (NEW)
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

/* ================= COMPONENT ================= */

export default function ReportFilterBar({
  filters,
  onFilterChange,
  offenceTypeOptions = [],
  placeholder = "Search by report number or offence...",
  showDateRange = true,
  showActionStatus = true,
  statusLabel = "Action Status",
  actionStatusOptions = ["All", "Pending", "Taken"],
  showOffenceType = true,
  onAddNew,
  onReset,
}: ReportFilterBarProps) {
  return (
    <div className="flex gap-4 items-end justify-between flex-wrap bg-white p-5 rounded-lg border shadow-sm">

      {/* ================= LEFT SIDE FILTERS ================= */}
      <div className="flex flex-wrap gap-4 items-end">

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder={placeholder}
            className="pl-10 w-[210px]"
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>

        {/* OFFENCE TYPE */}
        {showOffenceType && offenceTypeOptions.length > 0 && (
          <Select
            value={filters.offenceType || "All"}
            onValueChange={(v) =>
              onFilterChange("offenceType", v === "All" ? "" : v)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Offence Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Offence Types</SelectItem>
              {offenceTypeOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* ================= DATE RANGE (NEW) ================= */}
        {showDateRange && (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">From Date</label>
              <Input
                type="date"
                className="w-[150px]"
                value={filters.fromDate || ""}
                onChange={(e) =>
                  onFilterChange("fromDate", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">To Date</label>
              <Input
                type="date"
                className="w-[150px]"
                value={filters.toDate || ""}
                onChange={(e) =>
                  onFilterChange("toDate", e.target.value)
                }
              />
            </div>
          </>
        )}

        {/* UNIT DROPDOWN */}
        <Select
          value={filters.unit || "All"}
          onValueChange={(v) =>
            onFilterChange("unit", v === "All" ? "" : v)
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Units" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Units</SelectItem>
            {UNIT_OPTIONS.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* FMN DROPDOWN */}
        <Select
          value={filters.fmn || "All"}
          onValueChange={(v) =>
            onFilterChange("fmn", v === "All" ? "" : v)
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All FMNs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All FMNs</SelectItem>
            {FMN_OPTIONS.map((fmn) => (
              <SelectItem key={fmn} value={fmn}>
                {fmn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ACTION STATUS */}
        {showActionStatus && (
          <Select
            value={filters.actionStatus || "All"}
            onValueChange={(v) =>
              onFilterChange("actionStatus", v === "All" ? "" : v)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={statusLabel} />
            </SelectTrigger>
            <SelectContent>
              {actionStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* RESET */}
        {onReset && (
          <Button
            variant="outline"
            onClick={onReset}
            className="text-red-600 hover:bg-red-50"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* ================= RIGHT SIDE ================= */}
      {onAddNew && (
        <Button
          onClick={onAddNew}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Report
        </Button>
      )}
    </div>
  );
}
