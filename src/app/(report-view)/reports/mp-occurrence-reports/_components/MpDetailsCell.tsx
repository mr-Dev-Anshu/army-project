
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
      {details.armyNumber && (
        <div className="flex gap-1">
          <span className="font-semibold text-gray-900 min-w-[70px]">Army no.:</span>
          <span className="text-gray-900">{details.armyNumber || details.armyNo}</span>
        </div>
      )}
      {details.rank && (
        <div className="flex gap-1">
          <span className="font-semibold text-gray-900 min-w-[70px]">Rank:</span>
          <span className="text-gray-900">{details.rank}</span>
        </div>
      )}
      {details.name && (
        <div className="flex gap-1">
          <span className="font-semibold text-gray-900 min-w-[70px]">Name:</span>
          <span className="text-gray-900">{details.name}</span>
        </div>
      )}
      {details.unit && (
        <div className="flex gap-1">
          <span className="font-semibold text-gray-900 min-w-[70px]">Unit:</span>
          <span className="text-gray-900">{details.unit}</span>
        </div>
      )}
      {details.fmn && (
        <div className="flex gap-1">
          <span className="font-semibold text-gray-900 min-w-[70px]">FMN:</span>
          <span className="text-gray-900">{details.fmn}</span>
        </div>
      )}
      {details.address && (
        <div className="flex gap-1">
          <span className="font-semibold text-gray-900 min-w-[70px]">Address:</span>
          <span className="text-gray-900">{details.address}</span>
        </div>
      )}
      {details.iCardNumber && (
        <div className="flex gap-1">
          <span className="font-semibold text-gray-900 min-w-[70px]">I Card No.</span>
          <span className="text-gray-900">{details.iCardNumber}</span>
        </div>
      )}
    </div>
  );
}
