"use client";

import React, { useState } from "react";
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
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { TempWorker } from "../types";
import { useCreateShopkeeper } from "../hook";

type WorkerType = string;

export default function ShopkeeperSecurityPassEntryForm() {
  const { state, dispatch } = useForm();
  const shopkeeper = state.formData.shopkeeper;
  const { mutate: createShopkeeper, isPending } = useCreateShopkeeper();

  const [tempWorker, setTempWorker] = useState<TempWorker>({
    name: "",
    aadhar: "",
    type: "",
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

  const handleSave = () => {
    createShopkeeper(shopkeeper, {
      onSuccess: () => {
        alert("Security Pass Entry Saved & Generated!");
      },
      onError: (error) => {
        console.error("Error creating shopkeeper pass:", error);
        alert("Failed to create pass.");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Add Security Pass Entry</h2>
      <p className="text-sm text-gray-600 mb-8">
        Fill details to generate pass record
      </p>

      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">Shop Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SuggestionInput
            label="Shop Name"
            placeholder="eg. Fresh Grocery Store"
            value={shopkeeper.shopName}
            onChange={(v) => setField("shopName", v)}
            fieldType="shopName"
          />
          <SuggestionInput
            label="Shop Address"
            placeholder="Shop Location"
            value={shopkeeper.shopAddress}
            onChange={(v) => setField("shopAddress", v)}
            fieldType="shopAddress"
          />
          <SuggestionInput
            label="Unit"
            placeholder="Enter unit responsible for this shop"
            value={shopkeeper.unit}
            onChange={(v) => setField("unit", v)}
            fieldType="unit"
          />
        </div>
      </section>
      <div className="my-12 border-t border-gray-200" />

      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">Shop Owner Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SuggestionInput
            label="Shop Owner Name"
            placeholder="eg. Robert"
            value={shopkeeper.ownerName}
            onChange={(v) => setField("ownerName", v)}
            fieldType="ownerName"
          />
          <SuggestionInput
            label="Mobile Number"
            placeholder="eg. +91 12345 67890"
            value={shopkeeper.ownerMobile}
            onChange={(v) => setField("ownerMobile", v)}
            type="tel"
            fieldType="mobileNumber"
          />
          <div className="col-span-2 space-y-1">
            <Label>Enter Aadhar Card No. for Govt. ID Proof</Label>
            <Input
              placeholder="---- ---- ----"
              value={shopkeeper.ownerAadhar}
              onChange={(e) =>
                setField(
                  "ownerAadhar",
                  e.target.value.replace(/\D/g, "").slice(0, 12)
                )
              }
              maxLength={12}
            />
          </div>
        </div>
      </section>
      <div className="my-12 border-t border-gray-200" />

      {/* Price List Status */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">Price List Status</h3>
        <div className="space-y-4">
          <RadioGroup
            value={shopkeeper.priceListApproved ? "yes" : "no"}
            onValueChange={(v) => setField("priceListApproved", v === "yes")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="price-approved-yes" />
              <Label htmlFor="price-approved-yes">Yes, approved</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="price-approved-no" />
              <Label htmlFor="price-approved-no">No, not approved</Label>
            </div>
          </RadioGroup>

          {shopkeeper.priceListApproved && (
            <div className="space-y-1 w-64">
              <Label>Effective from</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !shopkeeper.priceListEffectiveFrom &&
                      "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {shopkeeper.priceListEffectiveFrom
                      ? format(
                        new Date(shopkeeper.priceListEffectiveFrom),
                        "PPP"
                      )
                      : "Enter Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      shopkeeper.priceListEffectiveFrom
                        ? new Date(shopkeeper.priceListEffectiveFrom)
                        : undefined
                    }
                    onSelect={(date) =>
                      setField(
                        "priceListEffectiveFrom",
                        date ? date.toISOString() : null
                      )
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </section>
      <div className="my-12 border-t border-gray-200" />

      {/* Worker Details & Man Power */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-4">
          Worker Details & Man Power
        </h3>

        <div className="space-y-1 mb-6 max-w-xs">
          <Label>Total Number of Workers</Label>
          <Input
            type="number"
            value={shopkeeper.workers.length}
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="  ">
          <p className="text-sm text-gray-600 mb-4">
            Click on &quot;Add Worker&quot; button to add all workers details
          </p>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <div className="space-y-1">
              <Label>Name of Worker</Label>
              <SuggestionInput
                placeholder="Enter Name here"
                value={tempWorker.name}
                onChange={(v) =>
                  setTempWorker((prev) => ({ ...prev, name: v }))
                }
                fieldType="workerName"
              />
            </div>

            <div className="space-y-1">
              <Label>Aadhar Card No.</Label>
              <Input
                placeholder="---- ---- ----"
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

            <div className="space-y-1 ">
              <Label>This worker is?</Label>
              <RadioGroup
                value={tempWorker.type}
                onValueChange={(v) =>
                  setTempWorker((prev) => ({ ...prev, type: v as WorkerType }))
                }
                className="flex justify-between"
              >
                {[
                  { value: "ex-man" as WorkerType, label: "Ex-Man" },
                  { value: "civil-male" as WorkerType, label: "Civil (Male)" },
                  {
                    value: "civil-female" as WorkerType,
                    label: "Civil (Female)",
                  },
                ].map(({ value, label }) => (
                  <div
                    key={value}
                    className={cn(
                      "flex items-center space-x-3 px-5 py-3 rounded-lg border transition-all cursor-pointer",
                      tempWorker.type === value
                        ? "border-gray-500 bg-gray-50 shadow-sm"
                        : "border-transparent hover:bg-gray-50"
                    )}
                    onClick={() =>
                      setTempWorker((prev) => ({ ...prev, type: value }))
                    } // Optional: click whole row
                  >
                    <RadioGroupItem
                      value={value}
                      id={`worker-type-${value}`}
                      className="w-5 h-5 border-2 border-[#D4D4D4] data-[state=checked]:border-[#0A0A0A] data-[state=checked]:bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
                      style={{
                        backgroundColor: "white",
                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="w-2.5 h-2.5 rounded-full bg-black scale-0 data-[state=checked]:scale-100 transition-transform duration-200" />
                      </div>
                    </RadioGroupItem>

                    <Label
                      htmlFor={`worker-type-${value}`}
                      className="text-base font-normal cursor-pointer select-none flex-1"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className=" w-full  flex  justify-end">
            <Button
              variant={"save-generate"}
              onClick={handleAddWorker}
              className="mb-6 "
            >
              + Add Worker
            </Button>
          </div>

          {shopkeeper.workers.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">List of Workers:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Sr no.</th>
                      <th className="text-left py-2">Worker Name</th>
                      <th className="text-left py-2">Aadhar Card No.</th>
                      <th className="text-left py-2">Worker Type</th>
                      <th className="text-left py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopkeeper.workers.map((worker: any, idx: number) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{idx + 1}.</td>
                        <td className="py-2">{worker.name}</td>
                        <td className="py-2">
                          {worker.aadhar.replace(/(\d{4})(?=\d)/g, "$1 ")}
                        </td>
                        <td className="py-2">
                          {worker.type === "ex-man"
                            ? "Ex-Man"
                            : worker.type === "civil-male"
                              ? "Civil (Male)"
                              : "Civil (Female)"}
                        </td>
                        <td className="py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveWorker(idx)}
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
      <div className="flex justify-end gap-4 mt-12">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
          {isPending ? "Saving..." : "Save & Generate"}
        </Button>
      </div>
    </div>
  );
}
