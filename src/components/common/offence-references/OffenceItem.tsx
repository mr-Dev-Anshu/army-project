"use client";

import { useEffect, useState } from "react";
import Modal from "@/common/ui/Modal";
import { FiPlus, FiX } from "react-icons/fi";
import { Reference } from "../../../apis/offence-references/types";

interface Props {
  offenceType: string;
  onRemove: (offenceType: string) => void;
  onReferencesChange: (offenceType: string, refIds: string[]) => void;
}

export default function OffenceItem({
  offenceType,
  onRemove,
  onReferencesChange,
}: Props) {
  const [refs, setRefs] = useState<Reference[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRef, setNewRef] = useState("");
  const [saving, setSaving] = useState(false);

  /* ===== FETCH REFERENCES ===== */
  useEffect(() => {
    setLoading(true);
    fetch(`/api/offence-references?offenceType=${offenceType.toLowerCase()}`)
      .then((r) => r.json())
      .then(setRefs)
      .finally(() => setLoading(false));
  }, [offenceType]);

  const toggle = (id: string, checked: boolean) => {
    const updated = checked
      ? [...selected, id]
      : selected.filter((x) => x !== id);

    setSelected(updated);
    onReferencesChange(offenceType, updated);
  };

  const saveReference = async () => {
    if (!newRef.trim()) return;

    setSaving(true);
    const res = await fetch("/api/offence-references", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offenceType,
        reference: newRef.trim(),
      }),
    });

    const created = await res.json();
    setRefs((p) => [...p, created]);
    toggle(created._id, true);

    setNewRef("");
    setShowModal(false);
    setSaving(false);
  };

  return (
    <>
      <div className="border rounded-lg p-4 bg-gray-50">
        {/* OFFENCE TITLE */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked readOnly />
            <span className="font-medium">{offenceType}</span>
          </div>
          <button onClick={() => onRemove(offenceType)}>
            <FiX />
          </button>
        </div>

        {/* REFERENCES */}
        <div className="ml-6">
          <p className="text-sm font-medium mb-1">Reference:</p>

          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : refs.length === 0 ? (
            <p className="text-sm text-gray-400">No Reference</p>
          ) : (
            <div className="space-y-1 mb-2">
              {refs.map((r) => (
                <label key={r._id} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(r._id)}
                    onChange={(e) => toggle(r._id, e.target.checked)}
                  />
                  {r.reference}
                </label>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 text-sm"
          >
            + Add New Reference
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Add Reference for ${offenceType}`}
      >
        <textarea
          value={newRef}
          onChange={(e) => setNewRef(e.target.value)}
          rows={4}
          className="w-full border rounded p-2"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={saveReference}
            disabled={!newRef || saving}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </Modal>
    </>
  );
}
