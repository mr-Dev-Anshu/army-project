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
  unitLocation?: string;
  individualWorkingStatus?: string;
  priceListStatus?: string;
  agreementStatus?: string;
  dutyType?: string;
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
  unitLocationOptions?: string[];
  placeholder?: string;
  showDate?: boolean;
  showDateRange?: boolean;
  showActionStatus?: boolean;
  statusLabel?: string;
  placeLabel?: string;
  dateLabel?: string;
  dateRangeLabel?: string;
  actionStatusOptions?: string[];
  showOffenceType?: boolean;
  showPriceListFilter?: boolean;
  onAddNew?: () => void;
  onReset?: () => void;
  showSort?: boolean;
  showFilter?: boolean;
  showFmn?: boolean;
  showPlaceOfOffence?: boolean;
  showUnit?: boolean;
  showAgreementStatus?: boolean;
  showIndividualWorkingStatus?: boolean;
  showUnitLocation?: boolean;
  showDutyType?: boolean;
  dutyTypeOptions?: string[];
  showVehicleType?: boolean;
  vehicleTypeOptions?: string[];
}

/* ================= MAIN COMPONENT ================= */
export default function ReportFilterBar({
  filters,
  onFilterChange,
  offenceTypeOptions = [],
  unitOptions,
  fmnOptions,
  placeOptions,
  unitLocationOptions,
  dutyTypeOptions,
  placeholder = "Search by report number or offence...",
  showDate = true,
  showDateRange = true,
  showActionStatus = true,
  statusLabel = "Action Status",
  placeLabel = "Place of Offence",
  dateLabel,
  dateRangeLabel = "Offence Date",
  actionStatusOptions = ["Pending", "Taken"], // "All" is handled by placeholder
  showOffenceType = true,
  showPriceListFilter = false,
  onAddNew,
  onReset,
  showSort = false,
  showFilter = false,
  showFmn = true,
  showPlaceOfOffence = true,
  showUnit = true,
  showAgreementStatus = false,
  showIndividualWorkingStatus = false,
  showUnitLocation = false,
  showDutyType = false,
  showVehicleType = false,
  vehicleTypeOptions = [],
}: ReportFilterBarProps) {
  const isFilterActive =
    (showPriceListFilter && filters.priceListStatus && filters.priceListStatus !== "All") ||
    (showAgreementStatus && filters.agreementStatus && filters.agreementStatus !== "All") ||
    (showActionStatus && filters.actionStatus && filters.actionStatus !== "All") ||
    (showIndividualWorkingStatus && filters.individualWorkingStatus && filters.individualWorkingStatus !== "All") ||
    (showDutyType && filters.dutyType && filters.dutyType !== "All") ||
    (showVehicleType && filters.vehicleType && filters.vehicleType !== "All") ||
    !!filters.date ||
    (showOffenceType && !!filters.offenceType && filters.offenceType !== "All") ||
    !!filters.fromDate ||
    !!filters.toDate ||
    !!filters.unit ||
    !!filters.fmn ||
    !!filters.placeOfOffence ||
    !!filters.unitLocation;
  return (


    <div className="flex gap-3 justify-between items-center mb-6">
      <div className="flex flex-1 gap-3 justify-between items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-[500px] ">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500", filters.search && "text-blue-600")} />
          <Input
            type="text"
            placeholder={placeholder}
            className={cn("pl-9 bg-white border-gray-300 w-full", filters.search && "border-blue-200 bg-blue-50 text-blue-600")}
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>


        <div className="flex gap-3">
          {/* Filter Button (Sheet) */}
          {showFilter && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 px-3 shrink-0 ml-1 gap-2 transition-colors cursor-pointer",
                    isFilterActive
                      ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                      : "bg-white border-gray-300 hover:bg-gray-50 text-[#0A0A0A]"
                  )}
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[400px] sm:w-[450px] flex flex-col p-0 gap-0"
              >
                <SheetHeader className="px-4 py-4 border-b flex flex-col gap-1">
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Apply filters to refine the report list.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">

                  {/* Offence Type */}
                  {showOffenceType && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Offence Type</label>
                      <AsyncSearchableSelect
                        fieldType="offenceType"
                        value={filters.offenceType === "All" ? "" : (filters.offenceType || "")}
                        onValueChange={(v) => onFilterChange("offenceType", v)}
                        placeholder="Search Offence Type..."
                        className="w-full"
                        defaultOptions={offenceTypeOptions}
                        mode="list-checkbox"
                      />
                    </div>
                  )}

                  {/* Action Status */}
                  {showActionStatus && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">{statusLabel}</label>
                      <Select
                        value={filters.actionStatus || "All"}
                        onValueChange={(value) => onFilterChange("actionStatus", value)}
                      >
                        <SelectTrigger className="w-full bg-white border-gray-300">
                          <SelectValue placeholder="Select Status" />
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

                  {/* Specific Date */}
                  {showDate && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">{dateLabel || "Specific Date"}</label>
                      <Input
                        type="date"
                        className="w-full text-sm"
                        value={filters.date || ""}
                        onChange={(e) => onFilterChange("date", e.target.value)}
                      />
                    </div>
                  )}

                  {/* Date Range */}
                  {showDateRange && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">{dateRangeLabel}</label>
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
                  {showUnit && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Unit</label>
                      <label className="text-xs text-gray-500">Select Unit</label>
                      <AsyncSearchableSelect
                        fieldType="unit"
                        value={filters.unit || ""}
                        onValueChange={(v) => onFilterChange("unit", v)}
                        placeholder="Search Unit..." // Placeholder for inside input
                        className="w-full"
                        defaultOptions={unitOptions}
                        mode="list-checkbox"
                      />
                    </div>
                  )}

                  {/* FMN */}
                  {showFmn && (
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
                        mode="list-checkbox"
                      />
                    </div>
                  )}

                  {/* Place of Offence */}
                  {showPlaceOfOffence && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">{placeLabel}</label>
                      <label className="text-xs text-gray-500">Select Location</label>
                      <AsyncSearchableSelect
                        fieldType="placeOfOffence"
                        value={filters.placeOfOffence || ""}
                        onValueChange={(v) => onFilterChange("placeOfOffence", v)}
                        placeholder="Search Location..."
                        className="w-full"
                        defaultOptions={placeOptions}
                        mode="list-checkbox"
                      />
                    </div>
                  )}

                  {/* Unit Location */}
                  {showUnitLocation && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Unit Location</label>
                      <label className="text-xs text-gray-500">Select Unit Location</label>
                      <AsyncSearchableSelect
                        fieldType="unitLocation"
                        value={filters.unitLocation || ""}
                        onValueChange={(v) => onFilterChange("unitLocation", v)}
                        placeholder="Search Unit Location..."
                        className="w-full"
                        defaultOptions={unitLocationOptions}
                        mode="list-checkbox"
                      />
                    </div>
                  )}

                  {/* Individual Working Status */}
                  {showIndividualWorkingStatus && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Individual Working Status</label>
                      <Select
                        value={filters.individualWorkingStatus || "All"}
                        onValueChange={(value) => onFilterChange("individualWorkingStatus", value)}
                      >
                        <SelectTrigger className="w-full bg-white border-gray-300">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Leave">Leave</SelectItem>
                          <SelectItem value="Duty">Duty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

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

                  {showAgreementStatus && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Agreement Status</label>
                      <Select
                        value={filters.agreementStatus || "All"}
                        onValueChange={(value) => onFilterChange("agreementStatus", value)}
                      >
                        <SelectTrigger className="w-full bg-white border-gray-300">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Valid">Valid</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}


                  {/* Duty Type */}
                  {showDutyType && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Duty Type</label>
                      <Select
                        value={filters.dutyType || "All"}
                        onValueChange={(value) => onFilterChange("dutyType", value)}
                      >
                        <SelectTrigger className="w-full bg-white border-gray-300">
                          <SelectValue placeholder="Select Duty Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          {(dutyTypeOptions && dutyTypeOptions.length > 0
                            ? dutyTypeOptions
                            : ["Mobile Duty", "MP Duty", "Gate Duty", "Patrol Duty", "Escort Duty", "Traffic Duty"]
                          ).map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Vehicle Type */}
                  {showVehicleType && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Type of Vehicle</label>
                      <Select
                        value={filters.vehicleType || "All"}
                        onValueChange={(value) => onFilterChange("vehicleType", value)}
                      >
                        <SelectTrigger className="w-full bg-white border-gray-300">
                          <SelectValue placeholder="Select Vehicle Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          {(vehicleTypeOptions && vehicleTypeOptions.length > 0
                            ? vehicleTypeOptions
                            : ["Gypsy", "Truck", "ALS", "Bus", "Motorcycle", "Other"]
                          ).map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {onReset && (
                  <div className="p-4 border-t bg-white mt-auto">
                    <Button
                      variant="outline"
                      onClick={onReset}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      Reset All Filters
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          )}


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
      </div>
    </div>
  );
}
