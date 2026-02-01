"use client";

import React, { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { cn } from "@/lib/utils";

type ScopeType = "traffic" | "static" | "mp-main" | "mp-additional";

interface VehicleDetailsFormProps {
  scope?: ScopeType;
  rootPath?: string;
  hideDriverSection?: boolean;
}

export default function VehicleDetailsForm({
  scope = "traffic",
  rootPath,
  hideDriverSection = false,
}: VehicleDetailsFormProps) {
  const { state, dispatch } = useForm();

  const traffic = state.formData.traffic;
  const staticSpeed = state.formData.staticSpeed;
  const mpMain = state.formData.mpReport.individualDetails;

  const [hasArmyRelative, setHasArmyRelative] = useState(false); // ✅ NEW

  /* ================= GUARD ================= */
  if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;
  if (scope === "mp-main" && mpMain.vehicleInvolved !== "yes") return null;

  /* ================= VEHICLE STATE ================= */
  let vehicleState: any = {};

  if (scope === "traffic") vehicleState = traffic.vehicleDetails;
  else if (scope === "static") vehicleState = staticSpeed.vehicleDetails;
  else if (scope === "mp-main") vehicleState = mpMain.vehicleData;
  else if (scope === "mp-additional" && rootPath) {
    vehicleState = state.formData.mpReport?.witnessTemp?.vehicleData || {};
  }

  const category = vehicleState?.category || "";
  const vehicleType = vehicleState?.vehicleType || "";
  const driverType = vehicleState?.driverType || "";
  const relativeType = vehicleState?.relativeType || "";

  const vehiclePath = rootPath
    ? `${rootPath}.vehicleData`
    : scope === "traffic"
      ? "formData.traffic.vehicleDetails"
      : scope === "static"
        ? "formData.staticSpeed.vehicleDetails"
        : scope === "mp-main"
          ? "formData.mpReport.individualDetails.vehicleData"
          : "";

  // const vehiclePath =
  //   scope === "traffic"
  //     ? "formData.traffic.vehicleDetails"
  //     : "formData.staticSpeed.vehicleDetails";

  /* ================= UPDATE VEHICLE ================= */
  const updateVehicle = (data: any) => {
    dispatch({
      type: "SET_PATH",
      path: vehiclePath,
      value: { ...(vehicleState || {}), ...data },
    });
  };

  /* ================= VEHICLE TYPE CHANGE ================= */
  const onVehicleTypeChange = (v: string) => {
    updateVehicle({
      vehicleType: v,
      vehicleNumber: "",
      vehicleName: "",
      driverType: "",
      relativeType: "",
    });
    setHasArmyRelative(false);
  };

  /* ================= OFFENDERS ================= */
  const offenders =
    scope === "traffic"
      ? traffic.offenderPeople || []
      : staticSpeed.offenderPeople || [];

  const ensureMainOffender = (type: string) => {
    if (offenders.length > 0) return;

    dispatch({
      type: "SET_PATH",
      path:
        scope === "traffic"
          ? "formData.traffic.offenderPeople"
          : "formData.staticSpeed.offenderPeople",
      value: [
        {
          type,
          whoIsIt: "Driver",
          details: {},
        },
      ],
    });
  };

  return (
    <div className="bg-white p-4  space-y-6">
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
                  : "border-gray-300",
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
          onValueChange={onVehicleTypeChange}
          className="grid sm:grid-cols-2 gap-3"
        >
          {["civilian", "dd"].map((v) => (
            <label
              key={v}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                vehicleType === v
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300",
              )}
            >
              <RadioGroupItem value={v} />
              {v === "civilian" ? "Civilian Vehicle" : "DD Vehicle"}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* VEHICLE IDENTIFICATION */}
      {vehicleType && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>
              {vehicleType === "civilian"
                ? "Civil Vehicle Registration Number"
                : "DD Vehicle BA Number"}
            </Label>
            <SuggestionInput
              value={vehicleState?.vehicleNumber || ""}
              onChange={(v) => updateVehicle({ vehicleNumber: v })}
              fieldType={
                vehicleType === "civilian" ? "vehicleNumber" : "ddVehicleNumber"
              }
            />
          </div>

          <div>
            <Label>Make & Type (Vehicle Name)</Label>
            <SuggestionInput
              value={vehicleState?.vehicleName || ""}
              onChange={(v) => updateVehicle({ vehicleName: v })}
              fieldType="vehicleName"
            />
          </div>
        </div>
      )}

      {/* DRIVER */}
      <div>
        {/* DRIVER */}
        {!hideDriverSection && (
          <div>
            <p className="font-semibold mb-2">
              Select Who was the Driver / Rider?
            </p>

            <RadioGroup
              value={driverType}
              onValueChange={(v) => {
                updateVehicle({ driverType: v });
                ensureMainOffender(v);
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
                      : "border-gray-300",
                  )}
                >
                  <RadioGroupItem value={item} />
                  {item}
                </label>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      {/* DRIVER FORM */}
      {!hideDriverSection && driverType && (
        <div className="border rounded-xl p-4 mt-4">
          <OffenderDynamicForm
            scope={scope as any}
            title={`${driverType} Details`}
            fields={offenderFormsConfig[driverType].fields}
            path={
              scope === "traffic"
                ? "formData.traffic.offenderPeople[0].details"
                : scope === "static"
                  ? "formData.staticSpeed.offenderPeople[0].details"
                  : scope === "mp-main"
                    ? "formData.mpReport.individualDetails.tempOffender.details"
                    : rootPath
                      ? `${rootPath}.tempOffender.details`
                      : undefined
            }
            isRoot={true}
          />
        </div>
      )}

      {/* CIVILIAN RELATIVE QUESTION */}
      {driverType === "Civilian" && (
        <div className="mt-4">
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={hasArmyRelative}
              onChange={(e) => {
                setHasArmyRelative(e.target.checked);
                if (!e.target.checked) updateVehicle({ relativeType: "" });
              }}
            />
            Does the civilian have any relative in Army?
          </label>
        </div>
      )}

      {/* RELATIVE TYPE */}
      {driverType === "Civilian" && hasArmyRelative && (
        <div>
          <p className="font-semibold mb-2">Select Relative Type</p>

          <RadioGroup
            value={relativeType}
            onValueChange={(v) => updateVehicle({ relativeType: v })}
            className="grid sm:grid-cols-2 gap-3"
          >
            {Object.keys(offenderFormsConfig).map((item) => (
              <label
                key={item}
                className={cn(
                  "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                  relativeType === item
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300",
                )}
              >
                <RadioGroupItem value={item} />
                {item}
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* RELATIVE FORM */}
      {driverType === "Civilian" && hasArmyRelative && relativeType && (
        <div className="border rounded-xl p-4 mt-4">
          <OffenderDynamicForm
            scope={scope as any}
            title={`${relativeType} Details`}
            fields={offenderFormsConfig[relativeType].fields}
            path="formData.traffic.offenderPeople[1].details"
            isRoot={false}
          />
        </div>
      )}
    </div>
  );
}
