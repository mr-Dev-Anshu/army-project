"use client";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";

interface FieldType {
  label: string;
  placeholder?: string;
  type: "input" | "select";
  options?: string[];
}

interface OffenderDynamicFormProps {
  title: string;
  helperText?: string;
  fields: FieldType[];
  showCoDriver?: boolean;
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
  path?: string;
}

const getValueByPath = (obj: any, path?: string) => {
  if (!path) return {};
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj) || {};
};

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
    scope === "traffic" && path ? getValueByPath(state, path) : {};

  const [localData, setLocalData] = useState<any>({});
  const [hasCoDriver, setHasCoDriver] = useState(false);
  const [coDriverType, setCoDriverType] = useState("");

  useEffect(() => {
    if (scope === "traffic" && path) setLocalData(preData);
    else setLocalData({});
  }, [scope, path]);

  const saveField = (label: string, value: string) => {
    let targetPath = path;

    if (!targetPath && scope === "mp-main")
      targetPath = "formData.mpReport.individualDetails.tempOffender";

    if (!targetPath && scope === "mp-additional")
      targetPath = "formData.mpReport.additionalIndividual.tempOffender";

    if (!targetPath) return;

    const prevGlobal = getValueByPath(state, targetPath) || {};

    const updated = {
      ...(localData || {}),
      ...prevGlobal,
      [label]: value,
    };

    setLocalData(updated);

    dispatch({
      type: "SET_PATH",
      path: targetPath,
      value: updated,
    });
  };

  return (
    <div className="space-y-6 mt-4 bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {/* ================= MAIN FIELDS ================= */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f, i) => {
          const label = f.label;
          const value = localData?.[label] || "";

          if (f.type === "suggestion") {
            return (
              <SuggestionInput
                key={i}
                placeholder={f.placeholder}
                value={value}
                onChange={(v) => saveField(label, v)}
                fieldType={(f as any).fieldType}
              />
            );
          }

          return (
            <FormInput
              key={i}
              label={label}
              placeholder={f.placeholder}
              value={value}
              onChange={(v) => saveField(label, v)}
            />
          );
        })}
      </div>

      {showCoDriver && (
        <>
          <p className="font-semibold mt-4">
            <input
              type="checkbox"
              checked={hasCoDriver}
              onChange={(e) => {
                setHasCoDriver(e.target.checked);
                setCoDriverType("");
              }}
              className="mr-2"
            />
            Was there any Co-Driver / Rider?
          </p>

          {hasCoDriver && (
            <>
              <p className="font-semibold mt-3">
                Select Who was Co-Driver / Rider
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
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
                    <input
                      type="radio"
                      name="coDriver"
                      value={item}
                      checked={coDriverType === item}
                      onChange={() => setCoDriverType(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>

              {coDriverType && offenderFormsConfig[coDriverType] && (
                <OffenderDynamicForm
                  title={`${coDriverType} Details`}
                  fields={offenderFormsConfig[coDriverType].fields}
                  scope={scope}
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
