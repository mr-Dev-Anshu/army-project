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
  const { dispatch } = useForm();

  const [offenderType, setOffenderType] = useState<OffenderKey | "">(
    externalType as OffenderKey
  );
  const [hasMilitaryRelative, setHasMilitaryRelative] = useState(false);
  const [relativeRelation, setRelativeRelation] = useState("");
  const [relativeType, setRelativeType] = useState("");

  if (!offenderConfig) return null;

  /* ================= PATH RESOLVER (🔥 MOST IMPORTANT) ================= */

  const getPath = () => {
    if (scope === "mp-main")
      return "formData.mpReport.individualDetails.tempOffender";

    if (scope === "mp-additional")
      return "formData.mpReport.additionalIndividual.tempOffender";

    // traffic / static
    return "formData.traffic.offenderPeople[0].details";
  };

  /* ================= SELECT HANDLER ================= */

  const handleOffenderSelect = (value: OffenderKey) => {
    setOffenderType(value);
    setHasMilitaryRelative(false);
    setRelativeRelation("");
    setRelativeType("");

    // traffic/static init
    if (scope === "traffic" || scope === "static") {
      dispatch({
        type: "SET_PATH",
        path: "formData.traffic.offenderPeople",
        value: [
          {
            type: value,
            role: "Offender",
            details: {},
          },
        ],
      });

      dispatch({
        type: "SET_PATH",
        path: "formData.traffic.vehicleInvolved",
        value: "no",
      });
    }

    // mp init
    if (scope === "mp-main") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.individualDetails.tempOffender",
        value: { offenderType: value, details: {} },
      });
    }

    if (scope === "mp-additional") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.additionalIndividual.tempOffender",
        value: { offenderType: value, details: {} },
      });
    }
  };

  /* ================================================= */

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <p className="font-semibold text-lg">Who was the Offender?</p>

      {/* ================= PRIMARY SELECT ================= */}
      <RadioGroup
        value={offenderType}
        onValueChange={(v) => handleOffenderSelect(v as OffenderKey)}
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
            fields={offenderFormsConfig.Civilian.fields}
            path={getPath()}
            showCoDriver={false}
          />

          <div className="flex gap-2 items-center mt-4">
            <Checkbox
              checked={hasMilitaryRelative}
              onCheckedChange={(v) => {
                setHasMilitaryRelative(!!v);
                setRelativeRelation("");
                setRelativeType("");
              }}
            />
            <p className="font-semibold">
              Is this person Dependent / Relative of Military Personnel?
            </p>
          </div>

          {hasMilitaryRelative && (
            <>
              <input
                className="border rounded-lg px-4 py-2 w-full"
                placeholder="Relation (Father / Brother / Husband)"
                value={relativeRelation}
                onChange={(e) => setRelativeRelation(e.target.value)}
              />

              <RadioGroup
                value={relativeType}
                onValueChange={setRelativeType}
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
                  title={`${relativeRelation || "Relative"} (${relativeType}) Details`}
                  fields={offenderFormsConfig[relativeType].fields}
                  path={getPath()}
                  showCoDriver={false}
                />
              )}
            </>
          )}
        </>
      )}

      {/* ================= OTHER OFFENDERS ================= */}
      {offenderType &&
        offenderType !== "Civilian" &&
        offenderConfig[offenderType] && (
          <OffenderDynamicForm
            scope={scope}
            title={offenderConfig[offenderType].title}
            helperText={offenderConfig[offenderType].helperText}
            fields={offenderFormsConfig[offenderType].fields}
            path={getPath()}
            showCoDriver={false}
          />
        )}
    </div>
  );
}
