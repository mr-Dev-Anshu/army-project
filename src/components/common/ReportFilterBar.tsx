"use client";

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
import { useGetFieldSuggestions } from "../../features/suggestions/hooks/index";

/* ================= TYPES ================= */

export interface FilterState {
  search: string;
  offenceType?: string;
  fromDate?: string;
  toDate?: string;
  actionStatus?: string;
  unit?: string;
  fmn?: string;
  sortOrder?: "asc" | "desc";
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

  /* ================= API DATA ================= */

  const { data: unitRes, isLoading: unitLoading } =
    useGetFieldSuggestions("unit", "");

  const { data: fmnRes, isLoading: fmnLoading } =
    useGetFieldSuggestions("fmn", "");

  const unitOptions = unitRes?.data ?? [];
  const fmnOptions = fmnRes?.data ?? [];

  /* ================= UI ================= */

  return (
    <div className="flex gap-4 items-end justify-between flex-wrap bg-white p-5 rounded-lg border shadow-sm">

      {/* LEFT FILTERS */}
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

        {/* DATE RANGE */}
        {showDateRange && (
          <>
            <Input
              type="date"
              className="w-[150px]"
              value={filters.fromDate || ""}
              onChange={(e) =>
                onFilterChange("fromDate", e.target.value)
              }
            />

            <Input
              type="date"
              className="w-[150px]"
              value={filters.toDate || ""}
              onChange={(e) =>
                onFilterChange("toDate", e.target.value)
              }
            />
          </>
        )}

        {/* UNIT DROPDOWN */}
        <Select
          disabled={unitLoading}
          value={filters.unit || "All"}
          onValueChange={(v) =>
            onFilterChange("unit", v === "All" ? "" : v)
          }
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="All Units" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Units</SelectItem>
            {unitOptions.map((u: any) => (
              <SelectItem key={u._id} value={u.value}>
                {u.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* FMN DROPDOWN */}
        <Select
          disabled={fmnLoading}
          value={filters.fmn || "All"}
          onValueChange={(v) =>
            onFilterChange("fmn", v === "All" ? "" : v)
          }
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="All FMNs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All FMNs</SelectItem>
            {fmnOptions.map((f: any) => (
              <SelectItem key={f._id} value={f.value}>
                {f.value}
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

      {/* RIGHT */}
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
