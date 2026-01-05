
import React from "react";

interface MpDetailsCellProps {
  details: {
    armyNumber: string;
    rank: string;
    name: string;
    unit: string;
    fmn?: string;
    address?: string;
    iCardNumber?: string;
    [key: string]: any;
  };
}

export default function MpDetailsCell({ details }: MpDetailsCellProps) {
  return (
    <div className="space-y-1 text-xs">
      <div className="flex gap-1">
        <span className="font-bold text-gray-900 min-w-[70px]">Army no.:</span>
        <span className="text-gray-700">{details.armyNumber}</span>
      </div>
      <div className="flex gap-1">
        <span className="font-bold text-gray-900 min-w-[70px]">Rank:</span>
        <span className="text-gray-700">{details.rank}</span>
      </div>
      <div className="flex gap-1">
        <span className="font-bold text-gray-900 min-w-[70px]">Name:</span>
        <span className="text-gray-700">{details.name}</span>
      </div>
      <div className="flex gap-1">
        <span className="font-bold text-gray-900 min-w-[70px]">Unit:</span>
        <span className="text-gray-700">{details.unit}</span>
      </div>
      {details.fmn && (
        <div className="flex gap-1">
          <span className="font-bold text-gray-900 min-w-[70px]">FMN:</span>
          <span className="text-gray-700">{details.fmn}</span>
        </div>
      )}
      {details.address && (
        <div className="flex gap-1">
          <span className="font-bold text-gray-900 min-w-[70px]">Address:</span>
          <span className="text-gray-700">{details.address}</span>
        </div>
      )}
      {details.iCardNumber && (
        <div className="flex gap-1">
          <span className="font-bold text-gray-900 min-w-[70px]">I Card No.</span>
          <span className="text-gray-700">{details.iCardNumber}</span>
        </div>
      )}
    </div>
  );
}
