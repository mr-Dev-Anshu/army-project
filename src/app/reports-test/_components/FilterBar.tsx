"use client";

import React from "react";
import { Search, Calendar, Filter, ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  filters: any;
  setFilters: (f: any) => void;
}

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Search by report no, unit, offence type..." 
          className="pl-9 h-10 w-full bg-white"
        />
      </div>

      {/* Offence Type Select */}
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px] h-10 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-normal">Offence Type:</span>
            <span className="font-medium">All</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="intoxication">Intoxication</SelectItem>
          <SelectItem value="speeding">Over Speeding</SelectItem>
        </SelectContent>
      </Select>

      {/* Date */}
       <div className="relative w-[180px]">
         <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center gap-1 text-sm">
             <span className="text-gray-500">Date:</span>
         </div>
          <Input 
            type="text"
            defaultValue="06/12/2025"
            className="pl-14 h-10 bg-white"
             // In a real app, use a date picker
          />
           <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
       </div>


      {/* Action Status */}
      <Select defaultValue="all">
        <SelectTrigger className="w-[180px] h-10 bg-white">
           <div className="flex items-center gap-2">
            <span className="text-gray-500 font-normal">Action Status:</span>
            <span className="font-medium">All</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="taken">Taken</SelectItem>
        </SelectContent>
      </Select>

      {/* Utilities */}
      <Button variant="outline" size="icon" className="h-10 w-10 bg-white">
        <Filter className="w-4 h-4 text-gray-600" />
      </Button>
      <Button variant="outline" size="icon" className="h-10 w-10 bg-white">
        <ArrowUpDown className="w-4 h-4 text-gray-600" />
      </Button>

      {/* Add New */}
      <Button className="h-10 bg-blue-500 hover:bg-blue-600 text-white gap-2 px-4 shadow-sm">
        <Plus className="w-4 h-4" />
        Add New
      </Button>
    </div>
  );
}
