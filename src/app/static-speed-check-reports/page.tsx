"use client";

import React, { useState } from "react";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaticSpeedTable from "./_components/StaticSpeedTable";
// Reusing FilterBar from reports-test or ideally moving it to common
// I will just import it for now if path allows, but referencing .. from here is messy if not aliased.
// Let's assume I create a simplified header or reuse layouts.
// I'll create a simple page layout here matching the design.

const MOCK_DATA = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  placeOfOffence: i % 2 === 0 ? "SI Line Military Station" : "Bairagarh military station",
  subLocation: i % 2 === 0 ? "" : "", 
  date: "06/12/2025",
  time: "17:50",
  driverDetails: {
    aadharNumber: "4444 2222 3333",
    name: "Mr. Rakesh Kumar",
    armyNumber: "11223344F",
    rank: "L/Nk",
  },
  mpName: "Sanjay Khatri",
  unit: i % 2 === 0 ? "21 Corps Signal Regt (AREN)" : "11 Engr Regt",
  fmn: "HQ 21 CORPs",
  offenceBrief: "Overtaking In NO Over Taking Zone",
  vehicleNo: "UP 16 AP 3840",
  vehicleModel: "Honda Accord",
  reportNo: "PRO/21 CPU/00042/102/25",
  authSpeed: "30",
  actualSpeed: "41",
  overSpeed: "11",
  coDriverDetails: i % 3 === 0 ? {
    aadharNumber: "4444 2222 3333",
    name: "Mr. Rakesh Kumar",
    armyNumber: "11223344F",
    rank: "L/Nk",
  } : null,
  actionStatus: i % 3 === 0 ? "Taken" : "Pending"
}));

export default function StaticSpeedCheckReportsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const distinctReportsCount = MOCK_DATA.length;
  const pageTitle = "Static Speed Check Reports";

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Reports & Analysis</span>
        <span className="mx-2">›</span>
        <span>All Reports</span>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-900">{pageTitle}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
        <div className="flex items-center gap-4">
           <span className="text-sm font-semibold">{distinctReportsCount} Reports</span>
             <Button variant="outline" className="bg-black text-white hover:bg-gray-800 hover:text-white cursor-pointer border-none gap-2">
            Download & Print Report
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters Placeholder - matching the look */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4 flex-wrap border border-gray-200">
         <div className="relative flex-1 min-w-[300px]">
            <input 
              type="text" 
              placeholder="Search by report no, unit, offence type..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
         </div>
         
         <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
           <span className="text-sm text-gray-500">Date:</span>
           <span className="text-sm font-medium text-gray-900">06/12/2025</span>
         </div>

         <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
            <span className="text-sm text-gray-500">Action Status:</span>
            <span className="text-sm font-medium text-gray-900">All</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
         </div>

         <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
             </Button>
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                + Add New
            </Button>
         </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <StaticSpeedTable data={MOCK_DATA} />
      )}
    </div>
  );
}
