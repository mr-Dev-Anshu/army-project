// src/features/offence-references/components/OffencesSection.tsx
"use client";

import React, { useState } from "react";
import OffenceItem from "./OffenceItem";
import { SuggestionInput } from "@/common/component/SuggestionInput";

interface OffencesSectionProps {
  selectedOffences: string[]; // lowercase offence types
  setSelectedOffences: React.Dispatch<React.SetStateAction<string[]>>;
  selectedReferences: string[]; // single flat array of reference IDs
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        3. OFFENCE COMMITTED/ORDERS CONTRAVENED:
      </h2>

      <div className="mb-8">
        <label className="block text-lg font-medium mb-2">
          Add Offence Type
        </label>
        <div className="max-w-md">
          <SuggestionInput
            fieldType="offenceType"
            placeholder="Type to search or add new offence..."
            value={inputValue}
            onChange={setInputValue}
            onItemSelect={handleAddOffence}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && inputValue.trim()) {
                e.preventDefault();
                handleAddOffence(inputValue.trim());
              }
            }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Type to search existing or add a new offence type
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="font-medium text-gray-700 mb-4">
          Selected Offences ({selectedOffences.length})
        </div>

        {selectedOffences.length === 0 ? (
          <p className="text-gray-500 italic py-8 text-center bg-gray-50 rounded-lg">
            No offences selected yet. Start by adding one above.
          </p>
        ) : (
          <div className="space-y-4">
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