"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import DetailsTable from "./DetailsTable";

interface GroupRowProps {
  group: any; // Type from Aggregation
  index: number;
  isVehicleInvolved: boolean;
  onView: (offence: any) => void;
}

export default function GroupRow({ group, index, isVehicleInvolved, onView }: GroupRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const offences = group.offences || [];
  const total = offences.length;
  const pending = offences.filter((o: any) => !o.actionStatus).length;
  const taken = offences.filter((o: any) => o.actionStatus === true).length;
  const typeName = group.offenceType || "Unknown Offence";

  const toggle = () => setIsOpen(!isOpen);

  // Format Index like "01."
  const formattedIndex = (index + 1).toString().padStart(2, "0") + ".";

  return (
    <div className="border-b border-gray-100 last:border-0 bg-white">
      {/* Group Header Row */}
      <div
        onClick={toggle}
        className="flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none"
      >
        {/* Type of Offence */}
        <div className="flex-1 font-semibold text-gray-800 text-sm flex items-center gap-2">
          <span>{formattedIndex}</span>
          <span>{typeName.toUpperCase()}</span>
        </div>

        {/* Action Status Summary */}
        <div className="w-64 text-center text-sm">
          <span className="text-gray-500 mr-1">Pending:</span>
          <span className="font-bold text-gray-900 mr-4">{pending.toString().padStart(2, "0")}</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 ml-4 mr-1">Taken:</span>
          <span className="font-bold text-gray-900">{taken.toString().padStart(2, "0")}</span>
        </div>

        {/* No of Records & Chevron */}
        <div className="w-32 flex items-center justify-end gap-6 text-sm">
          <span className="font-bold text-gray-900">{total.toString().padStart(2, "0")}</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/50 ${isOpen ? "max-h-[2000px] opacity-100 py-4 px-6 border-t border-gray-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
          {/* The Header inside the expanded view for context */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <div className="font-bold text-gray-800 text-sm">
              {formattedIndex} {typeName.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500">
              Pending: {pending.toString().padStart(2, "0")} | Taken: {taken.toString().padStart(2, "0")} | Total: {total.toString().padStart(2, "0")}
            </div>
          </div>

          <DetailsTable offences={offences} isVehicleInvolved={isVehicleInvolved} onView={onView} />
        </div>
      </div>
    </div>
  );
}
