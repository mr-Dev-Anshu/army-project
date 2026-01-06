"use client";

import { useEffect, useState } from "react";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import OffenceItem from "./OffenceItem";

interface OffenceData {
  offenceType: string;
  references: string[];
}

export default function OffenceSelector({
  onChange,
}: {
  onChange?: (data: OffenceData[]) => void;
}) {
  const [offences, setOffences] = useState<string[]>([]);
  const [refsMap, setRefsMap] = useState<Record<string, string[]>>({});

  const addOffence = (name: string) => {
    if (!offences.includes(name)) {
      setOffences((p) => [...p, name]);
    }
  };

  const removeOffence = (name: string) => {
    setOffences((p) => p.filter((o) => o !== name));
    setRefsMap((p) => {
      const { [name]: _, ...rest } = p;
      return rest;
    });
  };

  const updateRefs = (name: string, refs: string[]) => {
    setRefsMap((p) => ({ ...p, [name]: refs }));
  };

  useEffect(() => {
    onChange?.(
      offences.map((o) => ({
        offenceType: o,
        references: refsMap[o] || [],
      }))
    );
  }, [offences, refsMap]);

  return (
    <section className="bg-white rounded-lg p-6 border">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          3. OFFENCE COMMITTED/ORDERS CONTRAVENED:
        </h3>

        <button className="text-sm text-gray-600 border px-3 py-1 rounded hover:bg-gray-50">
          Clear Form
        </button>
      </div>

      {/* SELECT OFFENCE */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Select Offence Type
        </label>

        <SuggestionInput
          fieldType="offenceType"
          placeholder="Select Offences"
          onSelect={(val: string) => addOffence(val)}
        />
      </div>

      {/* SELECTED OFFENCES */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          List of Offence Selected
        </p>

        {offences.length === 0 ? (
          <p className="text-sm text-gray-400">No offence selected</p>
        ) : (
          <div className="space-y-4">
            {offences.map((offence) => (
              <OffenceItem
                key={offence}
                offenceName={offence}
                onRemove={removeOffence}
                onReferencesChange={updateRefs}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
