"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { cn } from "@/lib/utils";

type ScopeType = "traffic" | "static";

interface VehicleDetailsFormProps {
  scope?: ScopeType;
}

export default function VehicleDetailsForm({
  scope = "traffic",
}: VehicleDetailsFormProps) {
  const { state, dispatch } = useForm();

  const traffic = state.formData.traffic;
  const staticSpeed = state.formData.staticSpeed;

  /* ================= GUARD ================= */
  if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;
  if (scope === "static" && staticSpeed.vehicleInvolved !== "yes") return null;

  /* ================= VEHICLE STATE ================= */
  const vehicleState =
    scope === "traffic"
      ? traffic.vehicleDetails
      : staticSpeed.vehicleDetails;

  const category = vehicleState?.category || "";
  const vehicleType = vehicleState?.vehicleType || "";
  const driverType = vehicleState?.driverType || "";

  const vehiclePath =
    scope === "traffic"
      ? "formData.traffic.vehicleDetails"
      : "formData.staticSpeed.vehicleDetails";

  const offenderPeoplePath =
    scope === "traffic"
      ? "formData.traffic.offenderPeople"
      : "formData.staticSpeed.offenderPeople";

  /* ================= UPDATE VEHICLE ================= */
  const updateVehicle = (data: any) => {
    dispatch({
      type: "SET_PATH",
      path: vehiclePath,
      value: { ...vehicleState, ...data },
    });
  };

  return (
    <div className="bg-white p-4 space-y-6">
      {/* VEHICLE CATEGORY */}
      <div>
        <p className="font-semibold mb-2">Select Vehicle Category</p>
        <RadioGroup
          value={category}
          onValueChange={(v) => updateVehicle({ category: v })}
          className="grid sm:grid-cols-2 gap-3"
        >
          {["2w", "4w"].map((v) => (
            <label
              key={v}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                category === v
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <RadioGroupItem value={v} />
              {v === "2w" ? "2-Wheeler" : "4-Wheeler"}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* VEHICLE TYPE */}
      <div>
        <p className="font-semibold mb-2">
          Which Type Of Vehicle Was Involved?
        </p>
        <RadioGroup
          value={vehicleType}
          onValueChange={(v) =>
            updateVehicle({
              vehicleType: v,
              vehicleNumber: "",
              vehicleName: "",
            })
          }
          className="grid sm:grid-cols-2 gap-3"
        >
          {["civilian", "dd"].map((v) => (
            <label
              key={v}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                vehicleType === v
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <RadioGroupItem value={v} />
              {v === "civilian" ? "Civilian Vehicle" : "DD Vehicle"}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* VEHICLE DETAILS */}
      {vehicleType && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Vehicle Number</Label>
            <SuggestionInput
              value={vehicleState.vehicleNumber || ""}
              onChange={(v) => updateVehicle({ vehicleNumber: v })}
              fieldType="vehicleNumber"
            />
          </div>

          <div>
            <Label>Make & Type</Label>
            <SuggestionInput
              value={vehicleState.vehicleName || ""}
              onChange={(v) => updateVehicle({ vehicleName: v })}
              fieldType="vehicleName"
            />
          </div>
        </div>
      )}

      {/* DRIVER */}
      <div>
        <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>
        <RadioGroup
          value={driverType}
          onValueChange={(v) => {
            updateVehicle({ driverType: v });

            dispatch({
              type: "SET_PATH",
              path: offenderPeoplePath,
              value: [
                {
                  whoIsIt: "Driver",
                  type: v,
                  details: {},
                },
              ],
            });
          }}
          className="grid sm:grid-cols-2 gap-3"
        >
          {Object.keys(offenderFormsConfig).map((item) => (
            <label
              key={item}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                driverType === item
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <RadioGroupItem value={item} />
              {item}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* DRIVER FORM +  CO-DRIVER ENABLED */}
      {driverType && (
        <div className="border rounded-xl p-4 mt-4">
          <OffenderDynamicForm
            scope={scope}
            title={`${driverType} Details`}
            fields={offenderFormsConfig[driverType].fields}
            path={`${offenderPeoplePath}[0].details`}
            showCoDriver={true}   // 🔥 FIX
          />
        </div>
      )}
    </div>
  );
}
