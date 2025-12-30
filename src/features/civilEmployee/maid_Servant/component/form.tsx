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
import { useCreateMaidServant } from "../hook";

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
  const { mutate: createMaidServant, isPending } = useCreateMaidServant();

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

  const handleReset = () => {
    dispatch({
      type: "SET_PATH",
      path: "formData.maidServant",
      value: INITIAL_MAID_SERVANT_STATE,
    });
    setTempMember({ name: "", age: "", relationship: "" });
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
      dispatch({
        type: "PUSH_PATH",
        path: "formData.maidServant.familyMembers",
        value: {
          name: tempMember.name.trim(),
          age: tempMember.age.trim(),
          relationship: tempMember.relationship.trim(),
        },
      });
      setTempMember({ name: "", age: "", relationship: "" });
    }
  };

  const handleRemoveMember = (index: number) => {
    dispatch({
      type: "REMOVE_PATH",
      path: "formData.maidServant.familyMembers",
      index,
    });
  };

  const handleSave = () => {
    // Sanitize data
    const sanitizedData = { ...maidServant };
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
            <Input
              placeholder="---- ---- ----"
              value={maidServant.servantAadhar || ""}
              onChange={(e) =>
                setField(
                  "servantAadhar",
                  e.target.value.replace(/\D/g, "").slice(0, 12)
                )
              }
              maxLength={12}
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
              <Input
                placeholder="Pin code"
                value={maidServant.permanentPincode || ""}
                onChange={(e) =>
                  setField(
                    "permanentPincode",
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                maxLength={6}
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
          <Input
            placeholder="0000"
            value={maidServant.passNumber || ""}
            onChange={(e) => setField("passNumber", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label>Valid From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !maidServant.validFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {maidServant.validFrom
                    ? format(new Date(maidServant.validFrom), "PPP")
                    : "-- / -- / 25"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    maidServant.validFrom
                      ? new Date(maidServant.validFrom)
                      : undefined
                  }
                  onSelect={(date) =>
                    setField("validFrom", date ? date.toISOString() : null)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label>Valid Till</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !maidServant.validTill && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {maidServant.validTill
                    ? format(new Date(maidServant.validTill), "PPP")
                    : "-- / -- / 25"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    maidServant.validTill
                      ? new Date(maidServant.validTill)
                      : undefined
                  }
                  onSelect={(date) =>
                    setField("validTill", date ? date.toISOString() : null)
                  }
                />
              </PopoverContent>
            </Popover>
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
                fieldType="memberName"
              />
            </div>
            <div className="space-y-1">
              <Label>Age</Label>
              <Input
                placeholder="eg. 00"
                value={tempMember.age}
                onChange={(e) =>
                  setTempMember((prev) => ({ ...prev, age: e.target.value }))
                }
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
              + Add Member
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(idx)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
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
            {isPending ? "Saving..." : "Save & Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
