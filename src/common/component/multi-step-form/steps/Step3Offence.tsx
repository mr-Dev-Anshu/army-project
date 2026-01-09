"use client";

import { useForm } from "@/context/FormContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import OffencesSection from "@/features/offence-references/components/OffenceSection";

export default function Step3Offence() {
  const { state, dispatch } = useForm();
  const d = state.formData.traffic;

  const set = (path: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path,
      value,
    });

  // Wrapper for selectedOffences state
  const setSelectedOffences: React.Dispatch<React.SetStateAction<string[]>> = (
    action
  ) => {
    const current = d.offenceTypes || [];
    let newValue: string[];

    if (typeof action === "function") {
      newValue = action(current);
    } else {
      newValue = action;
    }

    set("formData.traffic.offenceTypes", newValue);
  };

  // Wrapper for selectedReferences state
  // Bind to 'offenceCode' as per existing data structure usage in MultiStepForm
  const setSelectedReferences: React.Dispatch<
    React.SetStateAction<string[]>
  > = (action) => {
    const current = d.offenceCode || [];
    let newValue: string[];

    if (typeof action === "function") {
      newValue = action(current);
    } else {
      newValue = action;
    }

    set("formData.traffic.offenceCode", newValue);
  };

  const handleReferenceToggle = (
    ref: { _id: string; reference: string },
    isSelected: boolean
  ) => {
    const currentList: { _id: string; reference: string }[] =
      d.offenceRefList || [];

    let newList;
    if (isSelected) {
      // Prevent duplicates
      if (!currentList.some((r) => r._id === ref._id)) {
        newList = [...currentList, ref];
      } else {
        // Did NOT change, return early to prevent render loop
        return;
      }
    } else {
      if (currentList.some((r) => r._id === ref._id)) {
        newList = currentList.filter((r) => r._id !== ref._id);
      } else {
        return;
      }
    }
    set("formData.traffic.offenceRefList", newList);
  };

  return (
    <div className="space-y-6">
      {/* Reusable Offences Section */}
      <OffencesSection
        selectedOffences={d.offenceTypes || []}
        setSelectedOffences={setSelectedOffences}
        selectedReferences={d.offenceCode || []}
        setSelectedReferences={setSelectedReferences}
        onReferenceToggle={handleReferenceToggle}
      />

      {/* Description Field Matching Design */}
      <div className="w-full">
        <Label className="text-sm font-bold block text-gray-900 mb-2">
          Brief Description of Offence
        </Label>
        <Textarea
          placeholder="Provide a detailed description of the offence, including what happened and how it occurred."
          value={d.offenceOccurenceDetails?.briefDescription || ""}
          onChange={(e) =>
            set(
              "formData.traffic.offenceOccurenceDetails.briefDescription",
              e.target.value
            )
          }
          className="min-h-[120px] w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
