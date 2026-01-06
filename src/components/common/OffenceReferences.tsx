"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/common/ui/Modal";
import { FiPlus, FiX } from "react-icons/fi";
import { SuggestionInput } from "@/common/component/SuggestionInput"; // Adjust path if needed
import {
  useGetOffenceReferences,
  useCreateOffenceReference,
} from "../../features/offence-references/hooks";

interface Reference {
  _id: string;
  reference: string;
}

interface OffenceData {
  offenceType: string;
  references: string[];
}

const OffenceItem: React.FC<{
  offenceName: string;
  displayName: string;
  onRemove: (name: string) => void;
  onReferencesChange: (name: string, refIds: string[]) => void;
}> = ({ offenceName, displayName, onRemove, onReferencesChange }) => {
  const [selectedRefIds, setSelectedRefIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRefText, setNewRefText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: availableRefs = [], isLoading } = useGetOffenceReferences(
    offenceName,
    searchQuery
  );

  const createMutation = useCreateOffenceReference();

  const toggleReference = (ref: Reference, checked: boolean) => {
    const updated = checked
      ? [...selectedRefIds, ref._id]
      : selectedRefIds.filter((id) => id !== ref._id);
    setSelectedRefIds(updated);
    onReferencesChange(offenceName, updated);
  };

  const handleSaveNewReference = () => {
    if (!newRefText.trim()) return;

    createMutation.mutate(
      {
        offenceType: offenceName,
        reference: newRefText.trim(),
      },
      {
        onSuccess: () => {
          setNewRefText("");
          setIsModalOpen(false);
        },
      }
    );
  };

  return (
    <>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
            <span className="font-medium text-gray-800 text-lg">
              {displayName}
            </span>
          </div>
          <button
            onClick={() => onRemove(offenceName)}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition text-gray-500 hover:text-red-600"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="ml-8">
          <div className="font-medium text-gray-500 mb-3">References:</div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search references..."
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {isLoading ? (
            <p className="text-sm text-gray-500">Loading references...</p>
          ) : availableRefs.length === 0 ? (
            <p className="text-sm text-gray-500">
              {searchQuery
                ? "No matching references found."
                : "No references available yet."}
            </p>
          ) : (
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
              {availableRefs.map((ref: Reference) => (
                <label
                  key={ref._id}
                  className="flex items-start gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedRefIds.includes(ref._id)}
                    onChange={(e) => toggleReference(ref, e.target.checked)}
                    className="mt-1 mr-3 w-4 h-4 accent-black rounded"
                  />
                  <span className="text-gray-900 text-base">{ref.reference}</span>
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
        title={`Add New Reference for "${displayName}"`}
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
              rows={5}
              placeholder="Enter the full reference text..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setNewRefText("");
              }}
              className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewReference}
              disabled={!newRefText.trim() || createMutation.isPending}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {createMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {createMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const OffencesSection: React.FC<{
  initialData?: OffenceData[];
  onChange?: (data: OffenceData[]) => void;
}> = ({ initialData = [], onChange }) => {
  const [selectedOffences, setSelectedOffences] = useState<string[]>(
    initialData.map((d) => d.offenceType.toLowerCase())
  );

  const [offenceRefsMap, setOffenceRefsMap] = useState<Record<string, string[]>>(
    Object.fromEntries(
      initialData.map((d) => [d.offenceType.toLowerCase(), d.references])
    )
  );

  const [inputValue, setInputValue] = useState("");

  const handleAddOffence = (value: string) => {
    const trimmedLower = value.trim().toLowerCase();
    if (trimmedLower && !selectedOffences.includes(trimmedLower)) {
      setSelectedOffences((prev) => [...prev, trimmedLower]);
      setInputValue(""); // Clear input immediately after adding
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

  useEffect(() => {
    const data: OffenceData[] = selectedOffences.map((offence) => ({
      offenceType: offence,
      references: offenceRefsMap[offence] || [],
    }));
    onChange?.(data);
  }, [selectedOffences, offenceRefsMap, onChange]);

  const capitalizeDisplay = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        3. OFFENCE COMMITTED/ORDERS CONTRAVENED:
      </h2>

      <div className="mb-8">
        <label className="block text-lg font-medium mb-2">Add Offence Type</label>
        <div className="max-w-md">
          <SuggestionInput
            fieldType="offenceType"
            placeholder="Type to search or add new offence..."
            value={inputValue}
            onChange={setInputValue}
            onSelect={handleAddOffence} // This triggers when user selects from dropdown
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && inputValue.trim()) {
                e.preventDefault();
                handleAddOffence(inputValue.trim());
              }
            }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Type to search existing or press Enter to add new offence
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