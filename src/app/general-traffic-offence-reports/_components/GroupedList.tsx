"use client";

import React from "react";
import GroupRow from "./GroupRow";

interface GroupedListProps {
  data: any[];
  isVehicleInvolved: boolean;
  onView: (offence: any) => void;
}

export default function GroupedList({ data, isVehicleInvolved, onView }: GroupedListProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No offence records found.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {data.map((group, index) => (
        <GroupRow
          key={group.offenceType || index}
          group={group}
          index={index}
          isVehicleInvolved={isVehicleInvolved}
          onView={onView}
        />
      ))}
    </div>
  );
}
