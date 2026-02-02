

"use client";

import { useState, useEffect } from "react";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

type OffenderKey = Extract<
  keyof typeof offenderFormsConfig,
  string
>;


type Block = {
  id: number;
  type?: OffenderKey;
  index?: number;
};

interface Props {
  scope?: "traffic" | "static"| "mp-main" | "mp-additional";
  rootPath?: string;
}

/* ================= COMPONENT ================= */

export default function OffenderWithoutVehicleForm({
  scope = "traffic",

}: Props) {
  const { state, dispatch } = useForm();

  const [blocks, setBlocks] = useState<Block[]>([{ id: Date.now() }]);
  const [hasArmyRelative, setHasArmyRelative] = useState(false); // ✅ NEW
  const [relativeType, setRelativeType] = useState<OffenderKey | "">(""); // ✅ NEW

  /* ================= SOURCE LIST ================= */
  const people =
    scope === "static"
      ? state.formData.staticSpeed?.offenderPeople || []
      : state.formData.traffic?.offenderPeople || [];

  /* ================= HYDRATE ================= */
  useEffect(() => {
    if (people.length > 0) {
      const restored = people.map((p: any, i: number) => ({
        id: Date.now() + i,
        type: p.type,
        index: i,
      }));
      setBlocks(restored);
    }
  }, []);

  /* ================= MAIN SELECT ================= */
  const handleSelect = (blockId: number, type: OffenderKey) => {
  const peoplePath =
  scope === "static"
    ? "formData.staticSpeed.offenderPeople"
    : scope === "traffic"
    ? "formData.traffic.offenderPeople"
    : scope === "mp-main"
    ? "formData.mpReport.individualDetails.tempOffender"
    : "formData.mpReport.additionalIndividual.tempOffender";


    let updated = [...people];

    const existingIndex = blocks.find((b) => b.id === blockId)?.index;

    const idx =
      existingIndex !== undefined ? existingIndex : updated.length;

    updated[idx] = {
      whoIsIt: "Offender",
      type,
      details: {},
    };

    dispatch({
      type: "SET_PATH",
      path: peoplePath,
      value: updated,
    });

    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, type, index: idx } : b
      )
    );

    // reset relative
    setHasArmyRelative(false);
    setRelativeType("");
  };

  /* ================= RELATIVE SELECT ================= */
  const handleRelativeSelect = (type: OffenderKey) => {
    const peoplePath =
      scope === "static"
        ? "formData.staticSpeed.offenderPeople"
        : "formData.traffic.offenderPeople";

    const updated = [...people];

    updated[1] = {
      whoIsIt: "Relative",
      type,
      details: {},
    };

    dispatch({
      type: "SET_PATH",
      path: peoplePath,
      value: updated,
    });

    setRelativeType(type);
  };

  return (
    <div className="space-y-6  p-6 bg-white">
      <p className="font-semibold text-lg">
        Select Who was the Offender?
      </p>

      {/* ================= MAIN OFFENDER ================= */}
      {blocks.map((block) => (
        <div key={block.id} className="space-y-4">
          <RadioGroup
            value={(block.type as string) || ""}
            onValueChange={(v) =>
              handleSelect(block.id, v as OffenderKey)
            }
            className="grid grid-cols-2 gap-3"
          >
            {Object.keys(offenderFormsConfig).map((item) => (
              <label
                key={item}
                className={cn(
                  "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                  block.type === item
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                )}
              >
                <RadioGroupItem value={item} />
                {item}
              </label>
            ))}
          </RadioGroup>

          {block.type && block.index !== undefined && (
            <OffenderDynamicForm
              title={`${block.type} Details`}
              fields={offenderFormsConfig[block.type].fields}
              scope={scope}
              path={
                scope === "traffic"
                  ? `formData.traffic.offenderPeople[${block.index}].details`
                  : `formData.staticSpeed.offenderPeople[${block.index}].details`
              }
              isRoot={false}
            />
          )}
        </div>
      ))}

      {/* ================= CIVILIAN RELATIVE ================= */}
      {blocks[0]?.type === "Civilian" && (
        <div className="space-y-3">
          <label className="flex gap-2 items-center font-medium">
            <input
              type="checkbox"
              checked={hasArmyRelative}
              onChange={(e) => {
                setHasArmyRelative(e.target.checked);
                if (!e.target.checked) setRelativeType("");
              }}
            />
            Does the civilian have any relative in Army?
          </label>

          {hasArmyRelative && (
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
                      : "border-gray-300"
                  )}
                >
                  <RadioGroupItem value={item} />
                  {item}
                </label>
              ))}
            </RadioGroup>
          )}

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
        </div>
      )}
    </div>
  );
}