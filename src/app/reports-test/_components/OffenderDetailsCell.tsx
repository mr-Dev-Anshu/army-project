import React from "react";

interface OffenderDetailsCellProps {
  details: any;
  mpName: string;
}

export default function OffenderDetailsCell({ details, mpName }: OffenderDetailsCellProps) {
  return (
    <div className="space-y-1 text-xs">
      {details.aadharNumber && (
        <div className="flex gap-1">
          <span className="font-bold text-gray-900">Aadhar No.</span>
          <span className="text-gray-700">{details.aadharNumber}</span>
        </div>
      )}
      {details.name && (
        <div className="flex gap-1">
          <span className="font-bold text-gray-900">Name:</span>
          <span className="text-gray-700">{details.name}</span>
        </div>
      )}
      {details.armyNumber && (
        <div className="flex gap-1">
          <span className="font-bold text-gray-900">Army no.:</span>
          <span className="text-gray-700">{details.armyNumber}</span>
        </div>
      )}
      {details.rank && (
        <div className="flex gap-1">
          <span className="font-bold text-gray-900">Rank:</span>
          <span className="text-gray-700">{details.rank}</span>
        </div>
      )}
      <div className="flex gap-1">
        <span className="font-bold text-gray-900">MP Name:</span>
        <span className="text-gray-700">{mpName}</span>
      </div>
    </div>
  );
}
