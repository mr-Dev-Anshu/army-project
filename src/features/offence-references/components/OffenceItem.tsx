"use client";

import React, { useState } from "react";
import Modal from "@/common/ui/Modal";
import { FiPlus } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGetOffenceReferences,
  useCreateOffenceReference,
} from "../hooks/index";

interface Reference {
  _id: string;
  reference: string;
}

interface OffenceItemProps {
  offenceName: string;
  displayName: string;
  selectedReferences: string[];
  onRemove: (name: string) => void;
  onReferencesChange: (refIds: string[]) => void;
}

const OffenceItem: React.FC<OffenceItemProps> = ({
  offenceName,
  displayName,
  selectedReferences,
  onRemove,
  onReferencesChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRefText, setNewRefText] = useState("");

  const { data: availableRefs = [], isLoading } = useGetOffenceReferences(
    offenceName,
    "" // Fetch all references without search query filtering
  );

  const createMutation = useCreateOffenceReference();

  const toggleReference = (refId: string, checked: boolean) => {
    const updated = checked
      ? [...selectedReferences, refId]
      : selectedReferences.filter((id) => id !== refId);

    onReferencesChange(updated);
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
    <div className="mb-6">
      {/* Offence Header (Checkbox + Name) */}
      <div className="flex items-center gap-3 mb-2">
        <Checkbox
          checked={true} // Always checked as it is in the 'Selected' list
          onCheckedChange={(checked) => {
            if (checked === false) {
              onRemove(offenceName);
            }
          }}
          className="w-5 h-5 border-gray-400 bg-white data-[state=checked]:bg-black data-[state=checked]:border-black rounded-sm"
        />
        <span className="font-medium text-gray-900 text-base">
          {displayName}
        </span>
      </div>

      <div className="ml-8">
        <div className="text-sm text-gray-500 mb-2">Reference:</div>

        {/* References List */}
        <div className="space-y-3 mb-3">
          {isLoading ? (
            <p className="text-sm text-gray-400">Loading references...</p>
          ) : availableRefs.length === 0 ? (
            <p className="text-sm text-gray-400">No Reference</p>
          ) : (
            availableRefs.map((ref: Reference) => (
              <div key={ref._id} className="flex items-start gap-3">
                <Checkbox
                  id={`ref-${ref._id}`}
                  checked={selectedReferences.includes(ref._id)}
                  onCheckedChange={(c) =>
                    toggleReference(ref._id, c === true)
                  }
                  className="mt-0.5 border-gray-300 rounded-[4px] w-4 h-4"
                />
                <label
                  htmlFor={`ref-${ref._id}`}
                  className="text-sm text-gray-800 leading-snug cursor-pointer"
                >
                  {ref.reference}
                </label>
              </div>
            ))
          )}
        </div>

        {/* Add New Reference Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
        >
          <FiPlus className="mr-1" />
          Add New Reference
        </button>
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
              rows={4}
              placeholder="Enter the full reference text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setNewRefText("");
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewReference}
              disabled={!newRefText.trim() || createMutation.isPending}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {createMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {createMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OffenceItem;