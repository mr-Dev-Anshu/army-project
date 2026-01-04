"use client";

import { useState, useEffect } from "react";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */
interface OffenderDynamicFormProps {
  title: string;
  helperText?: string;
  fields: any[];
  showCoDriver?: boolean;
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
  path?: string;
}

/* ================= HELPERS ================= */
const getValueByPath = (obj: any, path?: string) => {
  if (!path) return {};
  const keys = path.match(/[^[.\]]+/g) || [];
  return keys.reduce((o, k) => (o ? o[k] : undefined), obj) || {};
};

/* ⭐ SINGLE SOURCE OF TRUTH FOR KEYS */
const labelKeyMap: Record<string, string> = {
  "Full Name": "name",
  Name: "name",
  Rank: "rank",
  "Select Rank": "rank",
  "Army Rider / Driver Number": "armyNumber",
  "Army Number": "armyNumber",
  Unit: "unit",
  Command: "command",
  FMN: "fmn",
  Address: "address",
  "Place of Stay": "address",
  "Place of Work": "address",
  "Shop Address": "address",
  "ID Card Number": "iCardNumber",
  "I Card Number": "iCardNumber",
  "Aadhar Card Number": "iCardNumber",
};

/* ================= COMPONENT ================= */
export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  showCoDriver = false,
  scope = "traffic",
  path,
}: OffenderDynamicFormProps) {
  const { state, dispatch } = useForm();

  const preData =
    (scope === "traffic" || scope === "static") && path
      ? getValueByPath(state, path)
      : {};

  const [localData, setLocalData] = useState<any>({});
  const [hasCoDriver, setHasCoDriver] = useState(false);
  const [coDriverType, setCoDriverType] = useState("");

  /* ================= SYNC LOCAL ↔ GLOBAL ================= */
  useEffect(() => {
    setLocalData(preData || {});
  }, [path]);

  /* ================= SAVE FIELD (🔥 FIXED) ================= */
  const saveField = (label: string, value: string) => {
    const key = labelKeyMap[label] || label;

    // 1️⃣ local state
    setLocalData((prev: any) => ({
      ...(prev || {}),
      [key]: value,
    }));

    // 2️⃣ MP FLOW
    if (scope.startsWith("mp")) {
      const section =
        scope === "mp-additional"
          ? "additionalIndividual"
          : "individualDetails";

      dispatch({
        type: "SET_PATH",
        path: `formData.mpReport.${section}.tempOffender`,
        value: {
          ...(getValueByPath(
            state,
            `formData.mpReport.${section}.tempOffender`
          ) || {}),
          [key]: value,
        },
      });
      return;
    }

    // 3️⃣ TRAFFIC / STATIC
    if (!path) return;

    dispatch({
      type: "SET_PATH",
      path,
      value: {
        ...(getValueByPath(state, path) || {}),
        [key]: value,
      },
    });
  };

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* ================= MAIN FIELDS ================= */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f: any, i: number) => {
          const label = f.label;
          const key = labelKeyMap[label] || label;
          const value = localData?.[key] || "";

          const isSuggestion =
            f.type === "suggestion" ||
            [
              "Unit",
              "FMN",
              "Command",
              "Rank",
              "Select Rank",
              "Place of Stay",
              "Place of Work",
              "Shop Address",
              "Address",
            ].includes(label);

          if (isSuggestion) {
            return (
              <div key={i} className="flex flex-col gap-1">
                <Label className="font-semibold">{label}</Label>
                <SuggestionInput
                  placeholder={f.placeholder}
                  value={value}
                  onChange={(v) => saveField(label, v)}
                  fieldType={f.fieldType || key}
                />
              </div>
            );
          }

          if (f.type === "select") {
            return (
              <FormSelect
                key={i}
                label={label}
                placeholder={f.placeholder}
                value={value}
                options={f.options || []}
                onChange={(v) => saveField(label, v)}
              />
            );
          }

          return (
            <div key={i} className="flex flex-col gap-1">
              <Label className="font-semibold">{label}</Label>
              <FormInput
                label=""
                placeholder={f.placeholder}
                value={value}
                onChange={(v) => saveField(label, v)}
              />
            </div>
          );
        })}
      </div>

      {/* ================= CO-DRIVER FLOW ================= */}
      {showCoDriver && (
        <>
          <div className="mt-6 flex items-start gap-2">
            <Checkbox
              checked={hasCoDriver}
              onCheckedChange={(v) => {
                setHasCoDriver(Boolean(v));
                setCoDriverType("");
              }}
            />
            <p className="text-sm">
              Was there a <b>Co-Driver / Pillion Rider</b>?
            </p>
          </div>

          {hasCoDriver && (
            <>
              <p className="font-semibold mt-4">
                Select Who was Co-Driver / Rider
              </p>

              <RadioGroup
                className="grid sm:grid-cols-2 gap-3"
                value={coDriverType}
                onValueChange={(v) => {
                  setCoDriverType(v);

                  dispatch({
                    type: "PUSH_PATH",
                    path:
                      scope === "static"
                        ? "formData.staticSpeed.offenderPeople"
                        : "formData.traffic.offenderPeople",
                    value: {
                      type: v,
                      role: "Co-Driver",
                      details: {},
                    },
                  });
                }}
              >
                {[
                  "Military Person",
                  "Civilian",
                  "Employee",
                  "Servant/Maid",
                  "Shop Keeper",
                  "Temporary Hired Worker",
                ].map((item) => (
                  <label
                    key={item}
                    className={cn(
                      "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                      coDriverType === item
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    )}
                  >
                    <RadioGroupItem value={item} />
                    {item}
                  </label>
                ))}
              </RadioGroup>

              {coDriverType && offenderFormsConfig[coDriverType] && (
                <OffenderDynamicForm
                  title={`${coDriverType} Details`}
                  fields={offenderFormsConfig[coDriverType].fields}
                  scope={scope}
                  path={
                    scope === "static"
                      ? `formData.staticSpeed.offenderPeople[${
                          state.formData.staticSpeed.offenderPeople.length - 1
                        }].details`
                      : `formData.traffic.offenderPeople[${
                          state.formData.traffic.offenderPeople.length - 1
                        }].details`
                  }
                  showCoDriver={false}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
