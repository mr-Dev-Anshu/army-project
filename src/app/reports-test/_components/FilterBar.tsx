
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

interface FilterBarProps {
  filters: {
    search: string;
    offenceType: string;
    date: string;
    actionStatus: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    search: string;
    offenceType: string;
    date: string;
    actionStatus: string;
  }>>;
  offenceTypeOptions: string[];
}

export default function FilterBar({ filters, setFilters, offenceTypeOptions }: FilterBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleOffenceTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, offenceType: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, date: e.target.value }));
  };

  const handleActionStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, actionStatus: value }));
  };

  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by report no, unit, offence type..."
          className="pl-9 bg-white"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="w-[200px]">
        <Select value={filters.offenceType} onValueChange={handleOffenceTypeChange}>
          <SelectTrigger className="bg-white">
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

      <div className="w-[180px] relative">
         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none z-10">
            Date:
         </div>
         <Input
          type="text" 
          value={filters.date}
          onChange={handleDateChange}
          className="bg-white pl-12 pr-9 text-sm" 
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="w-[200px]">
         <Select value={filters.actionStatus} onValueChange={handleActionStatusChange}>
          <SelectTrigger className="bg-white">
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

      <Button variant="outline" size="icon" className="bg-white w-10 h-10 shrink-0">
        <Filter className="w-4 h-4 text-gray-600" />
      </Button>

      <Button variant="outline" size="icon" className="bg-white w-10 h-10 shrink-0">
        <ArrowUpDown className="w-4 h-4 text-gray-600" />
      </Button>

      {/* Add New Button aligned to the right */}
      <Button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 px-4 shadow-sm">
        <Plus className="w-4 h-4" />
        Add New
      </Button>
    </div>
  );
}
