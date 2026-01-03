"use client";

import { FormInput } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";

/* ================= TYPES ================= */

export type ScopeType =
  | "traffic"
  | "static"
  | "mp-main"
  | "mp-additional"
  | "mt-accident";

/** 🔒 Discriminated union (fully type-safe) */
export type FieldType =
  | {
      label: string;
      name: string; // backend key (armyNumber, name, rank, etc.)
      placeholder?: string;
      type: "input";
    }
  | {
      label: string;
      name: string;
      placeholder?: string;
      type: "suggestion";
      fieldType: string; // REQUIRED
    };

interface OffenderDynamicFormProps {
  title: string;
  helperText?: string;
  fields: FieldType[];
  scope?: ScopeType;
  path?: string;
  showCoDriver?: boolean;
}

/* ================= HELPERS ================= */

const getValueByPath = (obj: any, path?: string) => {
  if (!path) return {};
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj) || {};
};

/* ================= COMPONENT ================= */

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  scope = "traffic",
  path,
  showCoDriver = false,
}: OffenderDynamicFormProps) {
  const { state, dispatch } = useForm();

  /* ================= MAIN DATA ================= */

  const backendData =
    scope && path ? getValueByPath(state, path) : {};

  const [localData, setLocalData] = useState<Record<string, string>>({});

  /* ================= CO-DRIVER STATE ================= */

  const [hasCoDriver, setHasCoDriver] = useState(false);
  const [coDriverType, setCoDriverType] = useState("");

  /* ================= HYDRATE ON EDIT ================= */

  useEffect(() => {
    if (!backendData || Object.keys(backendData).length === 0) return;

    const mapped: Record<string, string> = {};
    fields.forEach((f) => {
      if (backendData[f.name] !== undefined) {
        mapped[f.name] = backendData[f.name];
      }
    });

    console.log("🟢 OffenderDynamicForm hydrated:", mapped);
    setLocalData(mapped);
  }, [backendData, fields]);

  /* ================= SAVE FIELD ================= */

  const resolveTargetPath = () => {
    if (path) return path;
    if (scope === "mp-main")
      return "formData.mpReport.individualDetails.tempOffender";
    if (scope === "mp-additional")
      return "formData.mpReport.additionalIndividual.tempOffender";
    return undefined;
  };

  const saveField = (name: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [name]: value }));

    const targetPath = resolveTargetPath();
    if (!targetPath) return;

    const prev = getValueByPath(state, targetPath) || {};

    dispatch({
      type: "SET_PATH",
      path: targetPath,
      value: { ...prev, [name]: value },
    });
  };

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6 mt-4 bg-white p-6 rounded-xl shadow-sm">
      <p className="font-semibold text-lg">{title}</p>
      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* ================= MAIN FIELDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f, i) => {
          const value = localData[f.name] ?? "";

          if (f.type === "suggestion") {
            return (
              <div key={i} className="flex flex-col gap-1">
                <Label>{f.label}</Label>
                <SuggestionInput
                  value={value}
                  placeholder={f.placeholder}
                  onChange={(v) => saveField(f.name, v)}
                  fieldType={f.fieldType} // ✅ always string
                />
              </div>
            );
          }

          return (
            <div key={i} className="flex flex-col gap-1">
              <Label>{f.label}</Label>
              <FormInput
                label=""
                placeholder={f.placeholder}
                value={value}
                onChange={(v) => saveField(f.name, v)}
              />
            </div>
          );
        })}
      </div>

      {/* ================= CO-DRIVER FLOW ================= */}
      {showCoDriver && (
        <>
          <label className="flex items-center gap-2 font-semibold mt-4">
            <input
              type="checkbox"
              checked={hasCoDriver}
              onChange={(e) => {
                setHasCoDriver(e.target.checked);
                setCoDriverType("");
              }}
            />
            Was there a Co-Driver / Pillion Rider?
          </label>

          {hasCoDriver && (
            <>
              <p className="font-semibold mt-3">
                Select Co-Driver / Rider Type
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {Object.keys(offenderFormsConfig).map((type) => (
                  <label
                    key={type}
                    className={cn(
                      "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                      coDriverType === type
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="coDriver"
                      checked={coDriverType === type}
                      onChange={() => setCoDriverType(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>

              {coDriverType && offenderFormsConfig[coDriverType] && (
                <OffenderDynamicForm
                  title={`${coDriverType} Details`}
                  fields={offenderFormsConfig[coDriverType].fields}
                  scope={scope}
                  path={`${resolveTargetPath()}.coDriver`}
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
