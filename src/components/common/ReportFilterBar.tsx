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
import { Search, Calendar, Filter, ArrowUpDown, Plus } from "lucide-react";

export interface FilterState {
  search: string;
  offenceType?: string;
  date?: string;
  actionStatus?: string;
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
  showOffenceType?: boolean;
  onAddNew?: () => void;
}

export default function ReportFilterBar({
  filters,
  onFilterChange,
  offenceTypeOptions = [],
  placeholder = "Search by report no, unit, offence type...",
  showDate = true,
  showActionStatus = true,
  showOffenceType = true,
  onAddNew,
}: ReportFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-between items-center mb-6  bg-white ">
      <div className="flex justify-center gap-3 items-center ">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder={placeholder}
            className="pl-9 bg-white border-gray-300"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>

        {/* Offence Type Select */}
        {showOffenceType && offenceTypeOptions.length > 0 && (
          <div className="w-[200px]">
            <Select
              value={filters.offenceType || "All"}
              onValueChange={(value) => onFilterChange("offenceType", value)}
            >
              <SelectTrigger className="bg-white border-gray-300">
                <div className="flex items-center truncate">
                  <span className="text-gray-500 mr-1">Offence Type:</span>
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
          <div className="w-auto relative">
            <Input
              type="date"
              value={filters.date || ""}
              onChange={(e) => onFilterChange("date", e.target.value)}
              className="bg-white border-gray-300 cursor-pointer"
            />
          </div>
        )}

        {/* Action Status Select */}
        {showActionStatus && (
          <div className="w-[200px]">
            <Select
              value={filters.actionStatus || "All"}
              onValueChange={(value) => onFilterChange("actionStatus", value)}
            >
              <SelectTrigger className="bg-white border-gray-300">
                <div className="flex items-center truncate">
                  <span className="text-gray-500 mr-1">Action Status:</span>
                  <SelectValue placeholder="All" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Taken">Taken</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          className="bg-white w-10 h-10 shrink-0 border-gray-300"
          onClick={() => {
             const newOrder = filters.sortOrder === "asc" ? "desc" : "asc";
             onFilterChange("sortOrder", newOrder);
          }}
        >
          <ArrowUpDown className={`w-4 h-4 text-gray-600 ${filters.sortOrder === 'asc' ? 'transform rotate-180' : ''}`} />
        </Button>
      </div>
      {/* Add New Button */}
      {onAddNew && (
        <Button
          onClick={onAddNew}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 px-4 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      )}
    </div>
  );
}
