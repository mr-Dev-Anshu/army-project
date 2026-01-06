"use client";

import { useState } from "react";
import {
  useGetOffenceReferences,
  useCreateOffenceReference,
} from "@/features/offence-references/hooks";

interface Props {
  offenceName: string;
  onRemove: (name: string) => void;
  onReferencesChange: (name: string, refs: string[]) => void;
}

export default function OffenceItem({
  offenceName,
  onRemove,
  onReferencesChange,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newRef, setNewRef] = useState("");

  const offenceKey =
  typeof offenceName === "string"
    ? offenceName.trim()
    : typeof offenceName === "object" && offenceName !== null
    ? String((offenceName as any).label || (offenceName as any).value || "")
    : "";

  const { data = [] } = useGetOffenceReferences(offenceKey);
  const { mutate, isPending } = useCreateOffenceReference();

  const toggle = (id: string, checked: boolean) => {
    const updated = checked
      ? [...selectedIds, id]
      : selectedIds.filter((x) => x !== id);

    setSelectedIds(updated);
    onReferencesChange(offenceKey, updated);
  };

  const addReference = () => {
    if (!newRef.trim()) return;

    mutate(
      { offenceType: offenceKey, reference: newRef.trim() },
      {
        onSuccess: (created) => {
          toggle(created._id, true);
          setNewRef("");
        },
      }
    );
  };

  return (
  <div className="border rounded-md p-4 bg-white">
    {/* OFFENCE NAME (TOP LINE) */}
    <div className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked
        readOnly
        className="w-4 h-4 accent-black"
      />
      <span className="font-medium text-gray-900">
        {offenceKey}
      </span>
    </div>

    {/* REFERENCE SECTION */}
    <div className="ml-6">
      <p className="text-sm font-medium text-gray-600 mb-1">
        Reference:
      </p>

      {data.length === 0 ? (
        <p className="text-sm text-gray-400 mb-2">
          No Reference
        </p>
      ) : (
        <div className="space-y-2 mb-2">
          {data.map((r: any) => (
            <label
              key={r._id}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(r._id)}
                onChange={(e) => toggle(r._id, e.target.checked)}
                className="mt-0.5"
              />
              <span>{r.reference}</span>
            </label>
          ))}
        </div>
      )}

      {/* ADD NEW REFERENCE */}
      <button
        type="button"
        className="text-blue-600 text-sm font-medium hover:underline"
        onClick={addReference}
        disabled={!newRef || isPending}
      >
        + Add New Reference
      </button>

      {/* INPUT */}
      <input
        value={newRef}
        onChange={(e) => setNewRef(e.target.value)}
        placeholder="Type reference here"
        className="mt-2 w-full border rounded px-2 py-1 text-sm"
      />
    </div>
  </div>
);

}
