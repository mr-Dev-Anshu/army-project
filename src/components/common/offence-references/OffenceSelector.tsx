"use client";

import { useEffect, useState } from "react";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import OffenceItem from "./OffenceItem";
import { OffenceData } from "../../../apis/offence-references/types";

interface Props {
  onChange?: (data: OffenceData[]) => void;
  initialData?: OffenceData[];
}

export default function OffenceSelector({
  onChange,
  initialData = [],
}: Props) {
  const [offences, setOffences] = useState<string[]>(
    initialData.map((d) => d.offenceType)
  );
  const [refsMap, setRefsMap] = useState<Record<string, string[]>>({});
  const [input, setInput] = useState("");

  const addOffence = (value: any) => {
    const name =
      typeof value === "string"
        ? value
        : value?.label || value?.value || "";

    if (name && !offences.includes(name)) {
      setOffences((p) => [...p, name]);
    }
    setInput("");
  };

  const removeOffence = (name: string) => {
    setOffences((p) => p.filter((o) => o !== name));
    setRefsMap((p) => {
      const { [name]: _, ...rest } = p;
      return rest;
    });
  };

  const handleRefs = (name: string, refs: string[]) => {
    setRefsMap((p) => ({ ...p, [name]: refs }));
  };

  /* ===== EMIT FINAL DATA ===== */
  useEffect(() => {
    onChange?.(
      offences.map((o) => ({
        offenceType: o,
        references: refsMap[o] || [],
      }))
    );
  }, [offences, refsMap, onChange]);

  return (
    <div className="space-y-6">
      {/* ADD OFFENCE */}
      <SuggestionInput
        fieldType="offenceType"
        placeholder="Select or add offence"
        value={input}
        onChange={setInput}
        onSelect={addOffence}
      />

      {/* LIST */}
      <div className="space-y-4">
        {offences.map((o) => (
          <OffenceItem
            key={o}
            offenceType={o}
            onRemove={removeOffence}
            onReferencesChange={handleRefs}
          />
        ))}
      </div>
    </div>
  );
}
