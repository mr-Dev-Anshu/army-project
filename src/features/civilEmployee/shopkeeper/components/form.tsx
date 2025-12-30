"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
// import { format } from "date-fns";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { TempWorker } from "../types";
import { useCreateShopkeeper, useUpdateShopkeeper } from "../hook";

type WorkerType = string;

const INITIAL_SHOPKEEPER_STATE = {
  shopName: "",
  shopAddress: "",
  unit: "",
  ownerName: "",
  ownerMobile: "",
  ownerAadhar: "",
  passNumber: "",
  priceListApproved: false,
  priceListEffectiveFrom: null,
  workers: [],
  validFrom: null,
  validTill: null,
};

interface Props {
  onCancel?: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export default function ShopkeeperSecurityPassEntryForm({ onCancel, onSuccess, initialData }: Props) {
  const { state, dispatch } = useForm();
  const shopkeeper = state.formData.shopkeeper;
  const { mutate: createShopkeeper, isPending: isCreating } = useCreateShopkeeper();
  const { mutate: updateShopkeeper, isPending: isUpdating } = useUpdateShopkeeper();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (initialData) {
      dispatch({
        type: "SET_PATH",
        path: "formData.shopkeeper",
        value: {
          ...INITIAL_SHOPKEEPER_STATE,
          ...initialData,
          // Ensure dates are strings for inputs if needed, though state usually keeps them as is until render
        },
      });
    } else {
      // Reset if no initial data (add mode)
      dispatch({
        type: "SET_PATH",
        path: "formData.shopkeeper",
        value: INITIAL_SHOPKEEPER_STATE,
      });
    }
  }, [initialData, dispatch]);

  const [tempWorker, setTempWorker] = useState<TempWorker>({
    name: "",
    aadhar: "",
    type: "ex-man",
  });

  const setField = (field: string, value: unknown) => {
    dispatch({
      type: "SET_PATH",
      path: `formData.shopkeeper.${field}`,
      value,
    });
  };

  const handleAddWorker = () => {
    if (tempWorker.name.trim() && tempWorker.aadhar) {
      dispatch({
        type: "PUSH_PATH",
        path: "formData.shopkeeper.workers",
        value: {
          name: tempWorker.name.trim(),
          aadhar: tempWorker.aadhar,
          type: tempWorker.type,
        },
      });
      setTempWorker({ name: "", aadhar: "", type: "ex-man" });
    }
  };

  const handleRemoveWorker = (index: number) => {
    dispatch({
      type: "REMOVE_PATH",
      path: "formData.shopkeeper.workers",
      index,
    });
  };

  const handleReset = () => {
    dispatch({
      type: "SET_PATH",
      path: "formData.shopkeeper",
      value: INITIAL_SHOPKEEPER_STATE,
    });
    setTempWorker({ name: "", aadhar: "", type: "ex-man" });
  };

  const handleSave = () => {
    // Basic Validation
    if (!shopkeeper.shopName || !shopkeeper.ownerName) {
      toast.error("Please fill in at least Shop Name and Owner Name.");
      return;
    }

    if (!shopkeeper.passNumber) {
      toast.error("Pass Number is required.");
      return;
    }

    if (shopkeeper.ownerAadhar && shopkeeper.ownerAadhar.length !== 12) {
      toast.error("Owner Aadhar number must be 12 characters long.");
      return;
    }

    // Worker validation
    for (let i = 0; i < shopkeeper.workers.length; i++) {
      const worker = shopkeeper.workers[i] as TempWorker;
      if (worker.aadhar && worker.aadhar.length !== 12) {
        toast.error(`Worker "${worker.name}" Aadhar number must be 12 characters long.`);
        return;
      }
    }

    if (initialData?._id) {
      // Remove fields that should not be sent in update
      const { _id, createdAt, updatedAt, __v, ...shopkeeperData } = shopkeeper;

      // Clean up workers array to remove _id
      if (shopkeeperData.workers && Array.isArray(shopkeeperData.workers)) {
        shopkeeperData.workers = shopkeeperData.workers.map((worker: any) => {
          const { _id, ...rest } = worker;
          return rest;
        });
      }

      updateShopkeeper({ id: initialData._id, data: shopkeeperData }, {
        onSuccess: () => {
          toast.success("Security Pass Entry Updated!");
          handleReset();
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error updating shopkeeper pass:", error);
          toast.error("Failed to update pass. Please try again.");
        }
      });
    } else {
      createShopkeeper(shopkeeper, {
        onSuccess: () => {
          toast.success("Security Pass Entry Saved & Generated!");
          handleReset();
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error creating shopkeeper pass:", error);
          toast.error("Failed to create pass. Please try again.");
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-8 p-1">

        {/* Shop Details */}
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Shop Details</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <SuggestionInput
                label="Shop Name"
                placeholder="Enter Shop Name"
                value={shopkeeper.shopName}
                onChange={(v) => setField("shopName", v)}
                fieldType="shopName"
              />
            </div>
            <div className="space-y-1">
              <SuggestionInput
                label="Shop Address"
                placeholder="Enter Shop Address"
                value={shopkeeper.shopAddress}
                onChange={(v) => setField("shopAddress", v)}
                fieldType="shopAddress"
              />
            </div>
            <div className="space-y-1">
              <SuggestionInput
                label="Unit"
                placeholder="Enter Unit"
                value={shopkeeper.unit}
                onChange={(v) => setField("unit", v)}
                fieldType="unit"
              />
            </div>
            {/* Added Pass Number */}
            <div className="space-y-1">
              <Label>Pass Number / ID</Label>
              <Input
                placeholder="Enter Pass Number"
                value={shopkeeper.passNumber}
                onChange={(e) => setField("passNumber", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Shop Owner Details */}
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Shop Owner Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <SuggestionInput
                label="Shop Owner Name"
                placeholder="Enter Owner Name"
                value={shopkeeper.ownerName}
                onChange={(v) => setField("ownerName", v)}
                fieldType="ownerName"
              />
              <SuggestionInput
                label="Mobile Number"
                placeholder="Enter Mobile Number"
                value={shopkeeper.ownerMobile}
                onChange={(v) => setField("ownerMobile", v)}
                type="tel"
                fieldType="mobileNumber"
              />
            </div>
            <div className="space-y-1">
              <Label>Enter Aadhar Card No. for Govt. ID Proof</Label>
              <div className="relative">
                <Input
                  placeholder="Enter Aadhar Number"
                  value={shopkeeper.ownerAadhar}
                  onChange={(e) =>
                    setField(
                      "ownerAadhar",
                      e.target.value.replace(/\D/g, "").slice(0, 12)
                    )
                  }
                  maxLength={12}
                  className="pr-10"
                />
                {/* Optional: Add icon inside input if needed */}
              </div>
            </div>
          </div>
        </section>

        {/* Price List Status */}
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Price List Status</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Price List Approved?</Label>
              <RadioGroup
                value={shopkeeper.priceListApproved ? "yes" : "no"}
                onValueChange={(v) => setField("priceListApproved", v === "yes")}
                className="grid grid-cols-2 gap-4"
              >
                <label
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                    shopkeeper.priceListApproved ? "border-black bg-gray-50" : "border-gray-200"
                  )}
                >
                  <RadioGroupItem value="yes" id="price-yes" />
                  <span className="text-sm font-medium">Yes, approved</span>
                </label>
                <label
                  className={cn(
                    "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                    !shopkeeper.priceListApproved ? "border-black bg-gray-50" : "border-gray-200"
                  )}
                >
                  <RadioGroupItem value="no" id="price-no" />
                  <span className="text-sm font-medium">No, not approved</span>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-1">
              <Label>Effective from</Label>
              <Input
                type="date"
                value={shopkeeper.priceListEffectiveFrom ? shopkeeper.priceListEffectiveFrom.split('T')[0] : ""}
                onChange={(e) => setField("priceListEffectiveFrom", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
          </div>
        </section>

        {/* Worker Details & Man Power */}
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Worker Details & Man Power</h3>

          <div className="space-y-4 mb-6">
            <div className="space-y-1">
              <Label>Total Number of Workers</Label>
              <Input
                type="text"
                value={shopkeeper.workers.length}
                readOnly
                className="bg-gray-50 text-gray-500"
              />
            </div>

            <div className="space-y-4 rounded-lg bg-gray-50/50 p-4 border border-gray-100">
              <h4 className="text-sm font-medium text-gray-900">Enter Each Worker Details</h4>
              <p className="text-xs text-gray-500 -mt-3">Click on "Add Worker button" to add all workers details</p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Name of Worker</Label>
                  <SuggestionInput
                    placeholder="Enter Worker Name"
                    value={tempWorker.name}
                    onChange={(v) => setTempWorker((prev) => ({ ...prev, name: v }))}
                    fieldType="workerName"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Aadhar Card No.</Label>
                  <Input
                    placeholder="Enter Aadhar Number"
                    value={tempWorker.aadhar}
                    onChange={(e) =>
                      setTempWorker((prev) => ({
                        ...prev,
                        aadhar: e.target.value.replace(/\D/g, "").slice(0, 12),
                      }))
                    }
                    maxLength={12}
                  />
                </div>
                <div className="space-y-2">
                  <Label>This worker is?</Label>
                  <RadioGroup
                    value={tempWorker.type}
                    onValueChange={(v) =>
                      setTempWorker((prev) => ({ ...prev, type: v as WorkerType }))
                    }
                    className="grid grid-cols-3 gap-3"
                  >
                    {[
                      { value: "ex-man", label: "Ex-Man" },
                      { value: "civil-male", label: "Civil (Male)" },
                      { value: "civil-female", label: "Civil (Female)" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center justify-center space-x-2 rounded-md border py-2 px-1 cursor-pointer hover:bg-gray-50 transition-colors",
                          tempWorker.type === opt.value ? "border-black bg-gray-50" : "border-gray-200"
                        )}
                      >
                        <RadioGroupItem value={opt.value} id={`w-${opt.value}`} />
                        <span className="text-xs font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleAddWorker}
                    variant="outline"
                    className="gap-2 text-xs h-9 bg-white hover:bg-gray-50"
                  >
                    <span>+</span> Add Worker
                  </Button>
                </div>
              </div>
            </div>

            {/* Workers List Table */}
            {shopkeeper.workers.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">List of Workers:</h4>
                </div>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-4 py-2 w-12">Sr no.</th>
                        <th className="px-4 py-2">Worker Name</th>
                        <th className="px-4 py-2">Aadhar Card No.</th>
                        <th className="px-4 py-2">Worker Type</th>
                        <th className="px-4 py-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {shopkeeper.workers.map((worker: any, idx: number) => (
                        <tr key={idx} className="bg-white">
                          <td className="px-4 py-2 text-gray-500">{idx + 1}.</td>
                          <td className="px-4 py-2 font-medium">{worker.name}</td>
                          <td className="px-4 py-2 text-gray-500">{worker.aadhar}</td>
                          <td className="px-4 py-2 text-gray-500">
                            {worker.type === "ex-man" ? "Ex-Man" : worker.type === "civil-male" ? "Civil (Male)" : "Civil (Female)"}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleRemoveWorker(idx)}
                              className="text-red-500 hover:text-red-700 bg-red-50 p-1 rounded hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
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

        {/* Pass Validity */}
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Pass Validity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Valid From</Label>
              <Input
                type="date"
                value={shopkeeper.validFrom ? shopkeeper.validFrom.split('T')[0] : ""}
                onChange={(e) => setField("validFrom", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
            <div className="space-y-1">
              <Label>Valid Till</Label>
              <Input
                type="date"
                value={shopkeeper.validTill ? shopkeeper.validTill.split('T')[0] : ""}
                onChange={(e) => setField("validTill", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
          </div>
        </section>

      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t mt-8 bg-white sticky bottom-0 z-10">
        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onCancel} className="px-8">Cancel</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-8" disabled={isPending}>
            {isPending ? "Saving..." : "Save & Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
