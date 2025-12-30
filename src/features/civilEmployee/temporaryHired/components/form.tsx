"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { SubWorker } from "../types";
import { useCreateTemporaryHiredWorker } from "../hook";

export default function TemporaryHiredWorkerPassForm() {
  const { state, dispatch } = useForm();
  const tempWorker = state.formData.tempWorker || {};
  const { mutate: createWorker, isPending } = useCreateTemporaryHiredWorker();

  const [tempSubWorker, setTempSubWorker] = useState({
    name: "",
    mobile: "",
    aadhar: "",
  });

  const setField = (field: string, value: unknown) => {
    dispatch({
      type: "SET_PATH",
      path: `formData.tempWorker.${field}`,
      value,
    });
  };

  const handleAddSubWorker = () => {
    if (tempSubWorker.name.trim() && tempSubWorker.aadhar.length === 12) {
      dispatch({
        type: "PUSH_PATH",
        path: "formData.tempWorker.subWorkers",
        value: {
          name: tempSubWorker.name.trim(),
          mobile: tempSubWorker.mobile,
          aadhar: tempSubWorker.aadhar,
        },
      });
      setTempSubWorker({ name: "", mobile: "", aadhar: "" });
    }
  };

  const handleRemoveSubWorker = (index: number) => {
    dispatch({
      type: "REMOVE_PATH",
      path: "formData.tempWorker.subWorkers",
      index,
    });
  };

  const handleSave = () => {
    createWorker(tempWorker, {
      onSuccess: () => {
        alert("Temporary Hired Worker Pass Saved & Generated!");
      },
      onError: (error) => {
        console.error("Error creating worker pass:", error);
        alert("Failed to create pass.");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Add Temporary Hired Worker Pass</h2>
      <p className="text-sm text-gray-600 mb-8">
        Fill details to issue temporary hired worker security pass
      </p>

      {/* Worker Details */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">Worker Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <Label>Worker Name</Label>
            <SuggestionInput
              placeholder="eg. Robert"
              value={tempWorker.workerName || ""}
              onChange={(v) => setField("workerName", v)}
              fieldType="workerName"
            />
          </div>
          <div className="space-y-1">
            <Label>Mobile Number</Label>
            <SuggestionInput
              placeholder="eg. +91 12345 67890"
              value={tempWorker.workerMobile || ""}
              onChange={(v) => setField("workerMobile", v)}
              type="tel"
              fieldType="workerMobile"
            />
          </div>

          <div className="col-span-2 space-y-1">
            <Label>Enter Aadhar Card No. for Govt. ID Proof</Label>
            <Input
              placeholder="---- ---- ----"
              value={tempWorker.workerAadhar || ""}
              onChange={(e) =>
                setField("workerAadhar", e.target.value.replace(/\D/g, "").slice(0, 12))
              }
              maxLength={12}
            />
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-base font-medium">Permanent Address</Label>

          <div className="space-y-1 mt-4">
            <SuggestionInput
              placeholder="Address Line"
              value={tempWorker.permanentAddressLine || ""}
              onChange={(v) => setField("permanentAddressLine", v)}
              fieldType="permanentAddressLine"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="space-y-1">
              <Label>City / District</Label>
              <SuggestionInput
                placeholder="City / District"
                value={tempWorker.permanentCityDistrict || ""}
                onChange={(v) => setField("permanentCityDistrict", v)}
                fieldType="permanentCityDistrict"
              />
            </div>
            <div className="space-y-1">
              <Label>State</Label>
              <SuggestionInput
                placeholder="State"
                value={tempWorker.permanentState || ""}
                onChange={(v) => setField("permanentState", v)}
                fieldType="permanentState"
              />
            </div>
            <div className="space-y-1">
              <Label>Pin code</Label>
              <Input
                placeholder="Pin code"
                value={tempWorker.permanentPincode || ""}
                onChange={(e) =>
                  setField("permanentPincode", e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-1">
            <Label>Place of Stay (in campus)</Label>
            <SuggestionInput
              placeholder="Enter Address"
              value={tempWorker.placeOfStay || ""}
              onChange={(v) => setField("placeOfStay", v)}
              fieldType="placeOfStay"
            />
          </div>

          <div className="space-y-1">
            <Label>Place of Duty</Label>
            <SuggestionInput
              placeholder="Enter Address"
              value={tempWorker.placeOfDuty || ""}
              onChange={(v) => setField("placeOfDuty", v)}
              fieldType="placeOfDuty"
            />
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
            value={tempWorker.passNumber || ""}
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
                    !tempWorker.validFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tempWorker.validFrom
                    ? format(new Date(tempWorker.validFrom), "PPP")
                    : "-- / -- / 25"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={tempWorker.validFrom ? new Date(tempWorker.validFrom) : undefined}
                  onSelect={(date) => setField("validFrom", date ? date.toISOString() : null)}
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
                    !tempWorker.validTill && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tempWorker.validTill
                    ? format(new Date(tempWorker.validTill), "PPP")
                    : "-- / -- / 25"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={tempWorker.validTill ? new Date(tempWorker.validTill) : undefined}
                  onSelect={(date) => setField("validTill", date ? date.toISOString() : null)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>

      <div className="my-12 border-t border-gray-200" />

      {/* List of Sub-Workers & Their Details */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">List of Sub-Workers & Their Details</h3>

        <div className="space-y-1 mb-6 max-w-xs">
          <Label>Total Number of Sub-workers</Label>
          <Input
            type="number"
            value={(tempWorker.subWorkers || []).length}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="border rounded-lg p-6 bg-gray-50">
          <p className="text-sm text-gray-600 mb-4">
            Click on &quot;Add Sub-workers&quot; button to add all member details
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <Label>Name of Sub-Worker</Label>
              <SuggestionInput
                placeholder="eg. Robert"
                value={tempSubWorker.name}
                onChange={(v) => setTempSubWorker((prev) => ({ ...prev, name: v }))}
                fieldType="subWorkerName"
              />
            </div>
            <div className="space-y-1">
              <Label>Mobile Number</Label>
              <SuggestionInput
                placeholder="eg. +91 12345 67890"
                value={tempSubWorker.mobile}
                onChange={(v) => setTempSubWorker((prev) => ({ ...prev, mobile: v }))}
                type="tel"
                fieldType="mobileNumber"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <Label>Aadhar Card No.</Label>
              <Input
                placeholder="---- ---- ----"
                value={tempSubWorker.aadhar}
                onChange={(e) =>
                  setTempSubWorker((prev) => ({
                    ...prev,
                    aadhar: e.target.value.replace(/\D/g, "").slice(0, 12),
                  }))
                }
                maxLength={12}
              />
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button variant="save-generate" onClick={handleAddSubWorker}>
              + Add Sub-workers
            </Button>
          </div>

          {(tempWorker.subWorkers || []).length > 0 && (
            <div className="mt-8">
              <h4 className="font-medium mb-3">List of Sub-workers:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Sr no.</th>
                      <th className="text-left py-2">Sub-Worker Name</th>
                      <th className="text-left py-2">Aadhar Card No.</th>
                      <th className="text-left py-2">Mobile Number</th>
                      <th className="text-left py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tempWorker.subWorkers || []).map((worker: SubWorker, idx: number) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{idx + 1}.</td>
                        <td className="py-2">{worker.name}</td>
                        <td className="py-2">
                          {worker.aadhar.replace(/(\d{4})(?=\d)/g, "$1 ")}
                        </td>
                        <td className="py-2">{worker.mobile}</td>
                        <td className="py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSubWorker(idx)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="my-12 border-t border-gray-200" />

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-12">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
          {isPending ? "Saving..." : "Save & Generate"}
        </Button>
      </div>
    </div>
  );
}
