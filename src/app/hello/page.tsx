"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/common/ui/Modal";
import { FiPlus, FiX } from "react-icons/fi";
import { SuggestionInput } from "@/common/component/SuggestionInput";

// Types
interface Reference {
  _id: string;
  reference: string;
}

interface OffenceData {
  offenceType: string;
  references: string[];
}

// API Functions
const fetchReferencesByOffence = async (
  offenceType: string
): Promise<Reference[]> => {
  const res = await fetch(
    `/api/offence-references?offenceType=${encodeURIComponent(
      offenceType.toLowerCase()
    )}`
  );
  if (!res.ok) return [];
  return res.json();
};

const createNewReference = async (
  offenceType: string,
  referenceText: string
): Promise<Reference | null> => {
  const res = await fetch("/api/offence-references", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      offenceType: offenceType.toLowerCase(),
      reference: referenceText.trim(),
    }),
  });
  if (!res.ok) {
    console.error("Failed to create reference");
    return null;
  }
  return res.json();
};

// OffenceItem - Now controlled: always selected, with remove button
const OffenceItem: React.FC<{
  offenceName: string;
  onRemove: (name: string) => void;
  onReferencesChange: (name: string, refIds: string[]) => void;
}> = ({ offenceName, onRemove, onReferencesChange }) => {
  const [availableRefs, setAvailableRefs] = useState<Reference[]>([]);
  const [selectedRefIds, setSelectedRefIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRefText, setNewRefText] = useState("");
  const [saving, setSaving] = useState(false);

  // Load references when component mounts (since offence is always selected)
  useEffect(() => {
    setLoading(true);
    fetchReferencesByOffence(offenceName)
      .then(setAvailableRefs)
      .finally(() => setLoading(false));
  }, [offenceName]);

  const toggleReference = (ref: Reference, checked: boolean) => {
    const updatedIds = checked
      ? [...selectedRefIds, ref._id]
      : selectedRefIds.filter((id) => id !== ref._id);
    setSelectedRefIds(updatedIds);
    onReferencesChange(offenceName, updatedIds);
  };

  const handleSaveNewReference = async () => {
    if (!newRefText.trim()) return;
    setSaving(true);
    const newRef = await createNewReference(offenceName, newRefText.trim());
    setSaving(false);
    if (newRef) {
      setAvailableRefs((prev) => [...prev, newRef]);
      const newIds = [...selectedRefIds, newRef._id];
      setSelectedRefIds(newIds);
      onReferencesChange(offenceName, newIds);
      setNewRefText("");
      setIsModalOpen(false);
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
            <span className="font-medium text-gray-800 text-lg">
              {capitalize(offenceName)}
            </span>
          </div>
          <button
            onClick={() => onRemove(offenceName)}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-500 hover:text-red-600"
            aria-label="Remove offence"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="ml-8">
          <div className="font-medium text-gray-700 mb-3">Reference:</div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading references...</p>
          ) : availableRefs.length === 0 ? (
            <p className="text-sm text-gray-500">No references available.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {availableRefs.map((ref) => (
                <label key={ref._id} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedRefIds.includes(ref._id)}
                    onChange={(e) => toggleReference(ref, e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-gray-600">{ref.reference}</span>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
          >
            <FiPlus size={16} />
            Add New Reference
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewRefText("");
        }}
        title={`Add New Reference for "${capitalize(offenceName)}"`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Text
            </label>
            <textarea
              value={newRefText}
              onChange={(e) => setNewRefText(e.target.value)}
              rows={4}
              placeholder="Enter the full reference text..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setNewRefText("");
              }}
              className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewReference}
              disabled={!newRefText.trim() || saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {saving ? "Saving..." : "Save Reference"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Main Component - Multi-select with remove
const OffencesSection: React.FC<{
  initialData?: OffenceData[];
  onChange?: (data: OffenceData[]) => void;
}> = ({ initialData = [], onChange }) => {
  const [selectedOffences, setSelectedOffences] = useState<string[]>(
    initialData.map((d) => d.offenceType)
  );
  const [offenceRefsMap, setOffenceRefsMap] = useState<
    Record<string, string[]>
  >({});
  const [inputValue, setInputValue] = useState("");

  // Initialize from initialData
  useEffect(() => {
    if (initialData.length > 0) {
      const map: Record<string, string[]> = {};
      initialData.forEach((item) => {
        map[item.offenceType] = item.references;
      });
      setOffenceRefsMap(map);
    }
  }, [initialData]);

  const handleAddOffence = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !selectedOffences.includes(trimmed)) {
      setSelectedOffences((prev) => [...prev, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveOffence = (name: string) => {
    setSelectedOffences((prev) => prev.filter((o) => o !== name));
    setOffenceRefsMap((prev) => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleReferencesChange = (name: string, refIds: string[]) => {
    setOffenceRefsMap((prev) => ({ ...prev, [name]: refIds }));
  };

  // Emit data to parent
  useEffect(() => {
    const data: OffenceData[] = selectedOffences.map((offence) => ({
      offenceType: offence,
      references: offenceRefsMap[offence] || [],
    }));
    onChange?.(data);
  }, [selectedOffences, offenceRefsMap, onChange]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        3. OFFENCE COMMITTED/ORDERS CONTRAVENED:
      </h2>

      {/* Add Offence */}
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
            onSelect={(suggestion) => {
              handleAddOffence(suggestion);
              setInputValue(""); // Clear input after adding
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && inputValue.trim()) {
                e.preventDefault();
                handleAddOffence(inputValue.trim());
                setInputValue("");
              }
            }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Type to search existing or create new offence
          </p>
        </div>
      </div>

      {/* Selected Offences List */}
      <div className="mb-8">
        <div className="font-medium text-gray-700 mb-4">
          List of Selected Offences ({selectedOffences.length})
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
                onRemove={handleRemoveOffence}
                onReferencesChange={handleReferencesChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Brief Description */}
      <div className="mt-8">
        <label className="block text-lg font-medium mb-2">
          Brief Description of Offence
        </label>
        <textarea
          rows={5}
          placeholder="Provide a detailed description of the offence, including what happened and how it occurred."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
};

export default OffencesSection;