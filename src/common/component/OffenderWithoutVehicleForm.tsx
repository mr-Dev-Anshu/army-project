"use client";

import { useState, useEffect, useRef } from "react";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { cn } from "@/lib/utils";

type OffenderKey = Extract<keyof typeof offenderFormsConfig, string>;

interface Props {
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
  rootPath?: string; 
}


export default function OffenderWithoutVehicleForm({
  scope = "traffic",
  rootPath,
}: Props) {
  const { state, dispatch } = useForm();

  const people =
    scope === "static"
      ? state.formData.staticSpeed?.offenderPeople || []
      : state.formData.traffic?.offenderPeople || [];

  /* ================= STABLE BLOCK STATE ================= */
  const [selectedType, setSelectedType] = useState<OffenderKey | "">("");
  const [hasArmyRelative, setHasArmyRelative] = useState(false);
  const [relativeType, setRelativeType] = useState<OffenderKey | "">("");

  const hydratedRef = useRef(false);

  /* ================= 🔥 HYDRATE ONLY ONCE ================= */
  useEffect(() => {
    if (hydratedRef.current) return;

    if (people?.length > 0) {
      const main = people.find((p: any) => p.whoIsIt !== "Relative");

      if (main) {
        setSelectedType(main.type || main.offenderType);
      }

      const relative = people.find((p: any) => p.whoIsIt === "Relative");

      if (relative) {
        setHasArmyRelative(true);
        setRelativeType(relative.type || relative.offenderType);
      }
    }

    hydratedRef.current = true;
  }, []);

  /* ================= MAIN SELECT ================= */
  const handleSelect = (type: OffenderKey) => {
    setSelectedType(type);

    const peoplePath =
      scope === "static"
        ? "formData.staticSpeed.offenderPeople"
        : "formData.traffic.offenderPeople";

    dispatch({
      type: "SET_PATH",
      path: peoplePath,
      value: [
        {
          whoIsIt: "Offender",
          type,
          details: people[0]?.details || {},
        },
      ],
    });

    setHasArmyRelative(false);
    setRelativeType("");
  };

  /* ================= RELATIVE SELECT ================= */
  const handleRelativeSelect = (type: OffenderKey) => {
    setRelativeType(type);

    const peoplePath =
      scope === "static"
        ? "formData.staticSpeed.offenderPeople"
        : "formData.traffic.offenderPeople";

    dispatch({
      type: "SET_PATH",
      path: peoplePath,
      value: [
        people[0],
        {
          whoIsIt: "Relative",
          type,
          details: {},
        },
      ],
    });
  };

  return (
    <div className="space-y-6 p-6 bg-white">
      <p className="font-semibold text-lg">
        Select Who was the Offender?
      </p>

      {/* ================= MAIN OFFENDER ================= */}
      <RadioGroup
        value={selectedType}
        onValueChange={(v) => handleSelect(v as OffenderKey)}
        className="grid grid-cols-2 gap-3"
      >
        {Object.keys(offenderFormsConfig).map((item) => (
          <label
            key={item}
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition",
              selectedType === item
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300",
            )}
          >
            <RadioGroupItem value={item} />
            {item}
          </label>
        ))}
      </RadioGroup>

      {/* ================= DYNAMIC FORM ================= */}
      {selectedType && (
        <OffenderDynamicForm
          title={`${selectedType} Details`}
          fields={offenderFormsConfig[selectedType].fields}
          scope={scope}
          path={
            scope === "traffic"
              ? "formData.traffic.offenderPeople[0].details"
              : "formData.staticSpeed.offenderPeople[0].details"
          }
          isRoot={false}
        />
      )}

      {/* ================= RELATIVE ================= */}
      {selectedType === "Civilian" && (
        <div className="space-y-4">
          <label className="flex gap-2 items-center font-medium">
            <input
              type="checkbox"
              checked={hasArmyRelative}
              onChange={(e) => {
                setHasArmyRelative(e.target.checked);
                if (!e.target.checked) {
                  setRelativeType("");
                }
              }}
            />
            Does the civilian have any relative in Army?
          </label>

          {hasArmyRelative && (
            <>
              <RadioGroup
                value={relativeType}
                onValueChange={(v) =>
                  handleRelativeSelect(v as OffenderKey)
                }
                className="grid grid-cols-2 gap-3"
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

              {relativeType && (
                <OffenderDynamicForm
                  title={`${relativeType} (Relative) Details`}
                  fields={offenderFormsConfig[relativeType].fields}
                  scope={scope}
                  path={
                    scope === "traffic"
                      ? "formData.traffic.offenderPeople[1].details"
                      : "formData.staticSpeed.offenderPeople[1].details"
                  }
                  isRoot={false}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
