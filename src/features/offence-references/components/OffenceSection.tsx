// src/features/offence-references/components/OffencesSection.tsx
"use client";

import React, { useState } from "react";
import OffenceItem from "./OffenceItem";
import { SuggestionInput } from "@/common/component/SuggestionInput";

interface OffencesSectionProps {
  selectedOffences: string[]; // lowercase offence types
  setSelectedOffences: React.Dispatch<React.SetStateAction<string[]>>;
  selectedReferences: string[];
  setSelectedReferences: React.Dispatch<React.SetStateAction<string[]>>;
}

const OffencesSection: React.FC<OffencesSectionProps> = ({
  selectedOffences,
  setSelectedOffences,
  selectedReferences,
  setSelectedReferences,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddOffence = (value: string) => {
    const trimmedLower = value.trim().toLowerCase();
    if (trimmedLower && !selectedOffences.includes(trimmedLower)) {
      setSelectedOffences((prev) => [...prev, trimmedLower]);
      setInputValue("");
    }
  };

  const handleRemoveOffence = (name: string) => {
    setSelectedOffences((prev) => prev.filter((o) => o !== name));
  };

  const handleReferencesChange = (refIds: string[]) => {
    setSelectedReferences(refIds);
  };

  const capitalizeDisplay = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="w-full">


      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Select Offence Type
        </label>
        <div className="w-full">
          <SuggestionInput
            fieldType="offenceType"
            placeholder="Select Offences"
            value={inputValue}
            onChange={setInputValue}
            onItemSelect={handleAddOffence}
            className="w-full"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && inputValue.trim()) {
                e.preventDefault();
                handleAddOffence(inputValue.trim());
              }
            }}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-4">
          List of Offence Selected
        </div>

        {selectedOffences.length === 0 ? (
          <p className="text-gray-400 italic text-sm">
            No offences selected.
          </p>
        ) : (
          <div className="space-y-6">
            {selectedOffences.map((offence) => (
              <OffenceItem
                key={offence}
                offenceName={offence}
                displayName={capitalizeDisplay(offence)}
                onRemove={handleRemoveOffence}
                selectedReferences={selectedReferences}
                onReferencesChange={handleReferencesChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffencesSection;