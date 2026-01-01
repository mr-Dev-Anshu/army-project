"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { TempFamilyMember } from "../types";
import { useCreateMaidServant, useUpdateMaidServant } from "../hook";

const INITIAL_MAID_SERVANT_STATE = {
  qtrNumber: "",
  ownerName: "",
  ownerRank: "",
  ownerUnit: "",
  servantName: "",
  servantMobile: "",
  servantAadhar: "",
  permanentAddressLine: "",
  permanentCityDistrict: "",
  permanentState: "",
  permanentPincode: "",
  passNumber: "",
  validFrom: null,
  validTill: null,
  familyMembers: [],
};

interface Props {
  onCancel?: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export default function MaidServantSecurityPassForm({ onCancel, onSuccess, initialData }: Props) {
  const { state, dispatch } = useForm();
  const maidServant = state.formData.maidServant || {};
  const { mutate: createMaidServant, isPending: isCreating } = useCreateMaidServant();
  const { mutate: updateMaidServant, isPending: isUpdating } = useUpdateMaidServant();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (initialData) {
      dispatch({
        type: "SET_PATH",
        path: "formData.maidServant",
        value: {
          ...INITIAL_MAID_SERVANT_STATE,
          ...initialData,
        },
      });
    } else {
      dispatch({
        type: "SET_PATH",
        path: "formData.maidServant",
        value: INITIAL_MAID_SERVANT_STATE,
      });
    }
  }, [initialData, dispatch]);

  const [tempMember, setTempMember] = useState({
    name: "",
    age: "",
    relationship: "",
  });

  const [editMemberIndex, setEditMemberIndex] = useState<number | null>(null);

  const handleReset = () => {
    dispatch({
      type: "SET_PATH",
      path: "formData.maidServant",
      value: INITIAL_MAID_SERVANT_STATE,
    });
    setTempMember({ name: "", age: "", relationship: "" });
    setEditMemberIndex(null);
  };

  const setField = (field: string, value: unknown) => {
    dispatch({
      type: "SET_PATH",
      path: `formData.maidServant.${field}`,
      value,
    });
  };

  const handleAddMember = () => {
    if (
      tempMember.name.trim() &&
      tempMember.age.trim() &&
      tempMember.relationship.trim()
    ) {
      if (editMemberIndex !== null) {
        // Update existing member
        const updatedMembers = [...(maidServant.familyMembers || [])];
        updatedMembers[editMemberIndex] = {
          ...updatedMembers[editMemberIndex],
          name: tempMember.name.trim(),
          age: tempMember.age.trim(),
          relationship: tempMember.relationship.trim(),
        };

        dispatch({
          type: "SET_PATH",
          path: "formData.maidServant.familyMembers",
          value: updatedMembers,
        });
        setEditMemberIndex(null);
      } else {
        // Add new member
        dispatch({
          type: "PUSH_PATH",
          path: "formData.maidServant.familyMembers",
          value: {
            name: tempMember.name.trim(),
            age: tempMember.age.trim(),
            relationship: tempMember.relationship.trim(),
          },
        });
      }
      setTempMember({ name: "", age: "", relationship: "" });
    }
  };

  const handleEditMember = (index: number) => {
    const memberToEdit = maidServant.familyMembers[index];
    setTempMember({
      name: memberToEdit.name,
      age: memberToEdit.age,
      relationship: memberToEdit.relationship,
    });
    setEditMemberIndex(index);
  };

  const handleRemoveMember = (index: number) => {
    dispatch({
      type: "REMOVE_PATH",
      path: "formData.maidServant.familyMembers",
      index,
    });
  };

  const handleSave = () => {
    // Date validation
    if (maidServant.validFrom && maidServant.validTill) {
      if (new Date(maidServant.validTill) <= new Date(maidServant.validFrom)) {
        toast.error("Valid Till date must be greater than Valid From date.");
        return;
      }
    }

    // Sanitize data
    const sanitizedData = { ...maidServant };
    // Capture ID before deleting it for sanitization, if it exists
    const idToUpdate = (maidServant as any)._id || (initialData as any)?._id;

    delete (sanitizedData as any)._id;
    delete (sanitizedData as any).createdAt;
    delete (sanitizedData as any).updatedAt;
    delete (sanitizedData as any).__v;

    if (sanitizedData.familyMembers) {
      sanitizedData.familyMembers = sanitizedData.familyMembers.map((member: any) => {
        const { _id, ...rest } = member;
        return rest;
      });
    }

    if (idToUpdate) {
      updateMaidServant({ id: idToUpdate, data: sanitizedData }, {
        onSuccess: () => {
          toast.success("Maid Servant Security Pass Updated!");
          handleReset();
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error updating pass:", error);
          toast.error("Failed to update pass. Please try again.");
        }
      });
    } else {
      createMaidServant(sanitizedData, {
        onSuccess: () => {
          toast.success("Maid Servant Security Pass Saved & Generated!");
          handleReset();
          onSuccess?.(); // also call onSuccess prop if provided
        },
        onError: (error) => {
          console.error("Error creating pass:", error);
          toast.error("Failed to create pass. Please try again.");
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">
        Add Maid Servant Security Pass
      </h2>
      <p className="text-sm text-gray-600 mb-8">
        Fill details to generate pass record
      </p>

      {/* Quarter & Owner Details */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">Quarter & Owner Details</h3>

        <div className="space-y-1 mb-6">
          <Label>QTR. Number</Label>
          <SuggestionInput
            placeholder="eg. DM-35/4"
            value={maidServant.qtrNumber || ""}
            onChange={(v) => setField("qtrNumber", v)}
            fieldType="qtrNumber"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Shop Owner Name</Label>
            <SuggestionInput
              placeholder="eg. Robert"
              value={maidServant.ownerName || ""}
              onChange={(v) => setField("ownerName", v)}
              fieldType="ownerName"
            />
          </div>
          <div className="space-y-1">
            <Label>Rank</Label>
            <SuggestionInput
              placeholder="Enter Rank"
              value={maidServant.ownerRank || ""}
              onChange={(v) => setField("ownerRank", v)}
              fieldType="ownerRank"
            />
          </div>
          <div className="space-y-1">
            <Label>Unit</Label>
            <SuggestionInput
              placeholder="Enter unit"
              value={maidServant.ownerUnit || ""}
              onChange={(v) => setField("ownerUnit", v)}
              fieldType="ownerUnit"
            />
          </div>
        </div>
      </section>

      <div className="my-12 border-t border-gray-200" />

      {/* Servant Details */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">Servant Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <Label>Servant Name</Label>
            <SuggestionInput
              placeholder="eg. Robert"
              value={maidServant.servantName || ""}
              onChange={(v) => setField("servantName", v)}
              fieldType="servantName"
            />
          </div>
          <div className="space-y-1">
            <Label>Mobile Number</Label>
            <SuggestionInput
              placeholder="eg. +91 12345 67890"
              value={maidServant.servantMobile || ""}
              onChange={(v) => setField("servantMobile", v)}
              type="tel"
              fieldType="servantMobile"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <Label>Enter Aadhar Card No. for Govt. ID Proof</Label>
            <SuggestionInput
              placeholder="---- ---- ----"
              value={maidServant.servantAadhar || ""}
              onChange={(v) =>
                setField(
                  "servantAadhar",
                  v.replace(/\D/g, "").slice(0, 12)
                )
              }
              maxLength={12}
              fieldType="servantAadhar"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-base font-medium">Permanent Address</Label>

          {/* Address Line */}
          <div className="space-y-1 mt-4">
            <SuggestionInput
              placeholder="Address Line"
              value={maidServant.permanentAddressLine || ""}
              onChange={(v) => setField("permanentAddressLine", v)}
              fieldType="permanentAddressLine"
            />
          </div>

          {/* City / District, State, Pin code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="space-y-1">
              <Label>City / District</Label>
              <SuggestionInput
                placeholder="City / District"
                value={maidServant.permanentCityDistrict || ""}
                onChange={(v) => setField("permanentCityDistrict", v)}
                fieldType="permanentCityDistrict"
              />
            </div>

            <div className="space-y-1">
              <Label>State</Label>
              <SuggestionInput
                placeholder="State"
                value={maidServant.permanentState || ""}
                onChange={(v) => setField("permanentState", v)}
                fieldType="permanentState"
              />
            </div>

            <div className="space-y-1">
              <Label>Pin code</Label>
              <SuggestionInput
                placeholder="Pin code"
                value={maidServant.permanentPincode || ""}
                onChange={(v) =>
                  setField(
                    "permanentPincode",
                    v.replace(/\D/g, "").slice(0, 6)
                  )
                }
                maxLength={6}
                fieldType="permanentPincode"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="my-12 border-t border-gray-200" />

      {/* Pass Details */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">Pass Details</h3>

        <div className="space-y-1 max-w-xs mb-6">
          <Label>Pass Number</Label>
          <SuggestionInput
            placeholder="0000"
            value={maidServant.passNumber || ""}
            onChange={(v) => setField("passNumber", v)}
            fieldType="passNumber"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>Valid From</Label>
            <Input
              type="date"
              value={maidServant.validFrom ? maidServant.validFrom.split('T')[0] : ""}
              onChange={(e) => setField("validFrom", e.target.value ? new Date(e.target.value).toISOString() : null)}
            />
          </div>

          <div className="space-y-1">
            <Label>Valid Till</Label>
            <Input
              type="date"
              min={maidServant.validFrom ? maidServant.validFrom.split('T')[0] : undefined}
              value={maidServant.validTill ? maidServant.validTill.split('T')[0] : ""}
              onChange={(e) => setField("validTill", e.target.value ? new Date(e.target.value).toISOString() : null)}
            />
          </div>
        </div>
      </section>

      <div className="my-12 border-t border-gray-200" />

      {/* Servant's Family Details */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">
          Servant&apos;s Family Details
        </h3>

        <div className="space-y-1 mb-6 max-w-xs">
          <Label>Total Number of Members</Label>
          <Input
            type="number"
            value={(maidServant.familyMembers || []).length}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="border rounded-lg p-6 bg-gray-50">
          <p className="text-sm text-gray-600 mb-4">
            Click on &quot;Add Member&quot; button to add all member details
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <Label>Name of Member</Label>
              <SuggestionInput
                placeholder="eg. Robert"
                value={tempMember.name}
                onChange={(v) =>
                  setTempMember((prev) => ({ ...prev, name: v }))
                }
                fieldType="familyMemberName"
              />
            </div>
            <div className="space-y-1">
              <Label>Age</Label>
              <SuggestionInput
                placeholder="eg. 00"
                value={tempMember.age}
                onChange={(v) =>
                  setTempMember((prev) => ({ ...prev, age: v }))
                }
                fieldType="age"
              />
            </div>
            <div className="space-y-1">
              <Label>Relationship</Label>
              <SuggestionInput
                placeholder="Name the relationship with the servant"
                value={tempMember.relationship}
                onChange={(v) =>
                  setTempMember((prev) => ({
                    ...prev,
                    relationship: v,
                  }))
                }
                fieldType="relationship"
              />
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button variant="save-generate" onClick={handleAddMember}>
              {editMemberIndex !== null ? "Update Member" : "+ Add Member"}
            </Button>
          </div>

          {(maidServant.familyMembers || []).length > 0 && (
            <div className="mt-8">
              <h4 className="font-medium mb-3">List of members:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Sr no.</th>
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Relationship</th>
                      <th className="text-left py-2">Age</th>
                      <th className="text-left py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(maidServant.familyMembers || []).map(
                      (member: TempFamilyMember, idx: number) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2">{idx + 1}.</td>
                          <td className="py-2">{member.name}</td>
                          <td className="py-2">{member.relationship}</td>
                          <td className="py-2">{member.age}</td>
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditMember(idx)}
                                className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1 rounded hover:bg-blue-100 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                              </button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMember(idx)}
                                className="p-1 h-auto"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="my-12 border-t border-gray-200" />

      {/* Footer Actions */}
      <div className="pt-4 border-t mt-8 bg-white sticky bottom-0 z-10">
        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onCancel} className="px-8">Cancel</Button>
          <Button onClick={handleSave} className="bg-[#0088FF] cursor-pointer  hover:bg-blue-700 px-8" disabled={isPending}>
            {isPending ? (isUpdating ? "Updating..." : "Saving...") : (((maidServant as any)._id || (initialData as any)?._id) ? "Update & Generate" : "Save & Generate")}
          </Button>
        </div>
      </div>
    </div>
  );
}
