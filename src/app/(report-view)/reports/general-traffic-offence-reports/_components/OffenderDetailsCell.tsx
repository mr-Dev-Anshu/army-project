import React from "react";

interface OffenderDetailsCellProps {
  details: any;
  mpName: string;
}

export default function OffenderDetailsCell({ details, mpName }: OffenderDetailsCellProps) {
  if (!details || Object.keys(details).length === 0) {
    return <span className="text-gray-400 text-xs">No details available</span>;
  }

  // Helper to find first matching value for a set of keys
  const get = (...keys: string[]) => {
    for (const k of keys) {
      if (details[k]) return details[k];
    }
    return null;
  };

  // Extract all potential fields
  const armyNo = get("armyNo", "armyNumber", "Army No.", "DD veh rider no.");
  const rank = get("rank", "Select Rank", "Rank");
  const name = get("name", "Driver Name", "Name");

  // S/O or D/O or Mother's Name
  const relationName = get("fatherName", "so", "S/O", "moName", "M/O Name");
  const relationLabel = details.moName ? "M/O" : "S/O"; // Simple heuristic, or just display generic label

  const unit = get("unit", "Unit");
  const address = get("address", "Place of Stay", "Address");
  const iCard = get("identityCard", "iCardNo", "ICard", "Pass ID & No.", "passId");
  const aadhar = get("aadharCard", "aadharNumber", "Aadhar Card No.");
  const mobile = get("contactNumber", "mobile", "Mobile No");

  const coRank = get("coRank", "C/O Rank");

  const fields = [
    { label: "Army No.", value: armyNo },
    { label: "Rank", value: rank },
    { label: "Name", value: name },
    { label: "Unit", value: unit }, // Useful if Unit column is empty or for context
    { label: relationLabel, value: relationName },
    { label: "Address", value: address },
    { label: "I-Card", value: iCard },
    { label: "Aadhar", value: aadhar },
    { label: "Contact", value: mobile },
    { label: "C/O Rank", value: coRank },
  ];

  return (
    <div className="space-y-1 text-xs">
      {fields.map((field, idx) => field.value && (
        <div key={idx} className="flex gap-1 items-start">
          <span className="font-bold text-gray-900 min-w-[70px] shrink-0 font-[Arial]">{field.label}:</span>
          <span className="text-gray-700 break-words leading-tight">{field.value}</span>
        </div>
      ))}

      {mpName && mpName !== "Unknown" && (
        <div className="flex gap-1 items-start pt-1 border-t border-dashed border-gray-200 mt-1">
          <span className="font-bold text-gray-900 min-w-[70px] shrink-0">MP Name:</span>
          <span className="text-gray-700 break-words">{mpName}</span>
        </div>
      )}
    </div>
  );
}
