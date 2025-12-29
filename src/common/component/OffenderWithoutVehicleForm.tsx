"use client";

import { useState } from "react";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";

type OffenderKey = keyof typeof offenderFormsConfig & string;

interface OffenderWithoutVehicleFormProps {
  offenderType?: OffenderKey;
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
}

export default function OffenderWithoutVehicleForm({
  offenderType: externalType = "",
  scope = "traffic",
}: OffenderWithoutVehicleFormProps) {
  const offenderConfig = offenderFormsConfig;

  const [offenderType, setOffenderType] = useState<OffenderKey | "">(
    externalType as OffenderKey
  );

  const [hasMilitaryRelative, setHasMilitaryRelative] = useState(false);
  const [relativeRelation, setRelativeRelation] = useState("");
  const [relativeType, setRelativeType] = useState("");

  const { dispatch } = useForm();

  if (!offenderConfig) return null;

  /* ---------------- PRIMARY SELECT HANDLER ---------------- */
  const storeTraffic = (value: any) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.traffic.offenderWithoutVehicle",
      value,
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.traffic.vehicleInvolved",
      value: "no",
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.traffic.vehicleDetails",
      value: {
        category: "",
        vehicleType: "",
        driverType: "",
      },
    });
  };

  const storeMpMain = (value: any) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.tempOffender",
      value,
    });

  const storeMpAdditional = (value: any) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.additionalIndividual.tempOffender",
      value,
    });

  const saveToContext = (payload: any) => {
    if (scope === "traffic") storeTraffic(payload);
    if (scope === "mp-main") storeMpMain(payload);
    if (scope === "mp-additional") storeMpAdditional(payload);
  };

  const handleOffenderSelect = (value: OffenderKey) => {
    setOffenderType(value);
    setHasMilitaryRelative(false);
    setRelativeRelation("");
    setRelativeType("");

    saveToContext({
      offenderType: value,
      hasMilitaryRelative: false,
      relativeRelation: "",
      relativeType: "",
    });
  };

  /* ===================================================== */

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <p className="font-semibold text-lg mb-2">Who was the Offender ?</p>

      {/* PRIMARY OFFENDER SELECT */}
      <RadioGroup
        value={offenderType ?? ""}
        onValueChange={handleOffenderSelect}
        className="grid grid-cols-2 gap-3"
      >
        {Object.keys(offenderConfig).map((item) => (
          <label
            key={item}
            className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
          >
            <RadioGroupItem value={item} />
            {item}
          </label>
        ))}
      </RadioGroup>

      {/* ================= CIVILIAN FLOW ================= */}
      {offenderType === "Civilian" && (
        <>
          <OffenderDynamicForm
            scope={scope}
            title="Civilian Details"
            fields={offenderFormsConfig["Civilian"].fields}
            showCoDriver={false}
          />

          {/* Checkbox */}
          <div className="flex gap-2 items-center mt-4">
            <Checkbox
              checked={hasMilitaryRelative}
              onCheckedChange={(v) => {
                const val = !!v;
                setHasMilitaryRelative(val);
                setRelativeRelation("");
                setRelativeType("");

                saveToContext({
                  offenderType,
                  hasMilitaryRelative: val,
                  relativeRelation: "",
                  relativeType: "",
                });
              }}
            />
            <p className="font-semibold">
              Does Civilian have any Military Relative?
            </p>
          </div>

          {/* Relation Input */}
          {hasMilitaryRelative && (
            <>
              <p className="font-semibold mt-4">
                Enter Relation of Military Person
              </p>

              <input
                type="text"
                className="border rounded-lg px-4 py-2 w-full outline-none focus:border-blue-500"
                placeholder="Father / Brother / Husband..."
                value={relativeRelation}
                onChange={(e) => {
                  setRelativeRelation(e.target.value);
                  saveToContext({
                    offenderType,
                    hasMilitaryRelative,
                    relativeRelation: e.target.value,
                    relativeType,
                  });
                }}
              />

              {/* Always show options right below input */}
              <p className="font-semibold mt-4">
                Select Military Relative Type
              </p>

              <RadioGroup
                value={relativeType}
                onValueChange={(v) => {
                  setRelativeType(v);
                  saveToContext({
                    offenderType,
                    hasMilitaryRelative,
                    relativeRelation,
                    relativeType: v,
                  });
                }}
                className="grid grid-cols-2 gap-3"
              >
                {Object.keys(offenderConfig)
                  .filter((i) => i !== "Civilian")
                  .map((item) => (
                    <label
                      key={item}
                      className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
                    >
                      <RadioGroupItem value={item} />
                      {item}
                    </label>
                  ))}
              </RadioGroup>

              {relativeType && (
                <OffenderDynamicForm
                  scope={scope}
                  title={`${
                    relativeRelation || "Relative"
                  } (${relativeType}) Details`}
                  fields={offenderFormsConfig[relativeType].fields}
                  showCoDriver={false}
                />
              )}
            </>
          )}
        </>
      )}

      {/* ================= OTHER NORMAL FLOW ================= */}
      {offenderType &&
        offenderType !== "Civilian" &&
        offenderConfig[offenderType] && (
          <OffenderDynamicForm
            scope={scope}
            title={offenderConfig[offenderType].title}
            helperText={offenderConfig[offenderType].helperText}
            fields={offenderFormsConfig[offenderType].fields.slice(1)}
            showCoDriver={false}
          />
        )}
    </div>
  );
}
