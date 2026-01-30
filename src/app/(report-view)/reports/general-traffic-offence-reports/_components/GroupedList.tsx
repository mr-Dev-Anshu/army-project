"use client";
import React, { useState } from "react";
import GroupRow from "./GroupRow";

interface GroupedListProps {
  data: any[];
  isVehicleInvolved: boolean;
  onView: (offence: any) => void;
  onPrint?: (offence: any) => void;
  onEdit?: (offence: any) => void;
}

export default function GroupedList({ data, isVehicleInvolved, onView, onPrint, onEdit }: GroupedListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No offence records found.
      </div>
    );
  }

  const handleToggle = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="divide-y divide-gray-100">
      {data.map((group, index) => (
        <GroupRow
          key={group.offenceType || index}
          group={group}
          index={index}
          isVehicleInvolved={isVehicleInvolved}
          onView={onView}
          onPrint={onPrint}
          onEdit={onEdit}
          isOpen={expandedIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
