

"use client";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (scope === "traffic" && path) {
      setLocalData(preData);
    } else {
      setLocalData({});
    }
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

    console.log("🔥 TEMP UPDATED =>", updated);
  };

  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      <div className="grid grid-cols-2 gap-4">
        {fields.map((f, i) => {
          const label = f.label;
          const value = localData?.[label] || "";

          if (label === "Select Rank")
            return (
              <SuggestionInput
                key={i}
                label="Select Rank"
                placeholder="Enter Rank"
                value={value}
                onChange={(v) => saveField("Select Rank", v)}
                fieldType="rank"
                className={cn(
                  "transition-all",
                  value ? "border-blue-500 bg-blue-50" : "border-gray-300"
                )}
              />
            );

          if (label === "Unit")
            return (
              <SuggestionInput
                key={i}
                label="Unit"
                placeholder="Enter Unit"
                value={value}
                onChange={(v) => saveField("Unit", v)}
                fieldType="unit"
                className={cn(
                  "transition-all",
                  value ? "border-blue-500 bg-blue-50" : "border-gray-300"
                )}
              />
            );

          const isSuggestion = [
            "FMN",
            "Command",
            "Trade",
            "Place of QTR.",
            "Place of Work",
            "Place of Stay",
            "Address",
            "Department",
          ].includes(label);

          if (isSuggestion)
            return (
              <SuggestionInput
                key={i}
                label={label}
                placeholder={f.placeholder}
                value={value}
                onChange={(v) => saveField(label, v)}
                fieldType={label.toLowerCase()}
                className={cn(
                  "transition-all",
                  value ? "border-blue-500 bg-blue-50" : "border-gray-300"
                )}
              />
            );

          return f.type === "input" ? (
            <FormInput
              key={i}
              label={label}
              placeholder={f.placeholder}
              value={value}
              onChange={(v) => saveField(label, v)}
              className={cn(
                "transition-all",
                value ? "border-blue-500 bg-blue-50" : "border-gray-300"
              )}
            />
          ) : (
            <FormSelect
              key={i}
              label={label}
              placeholder={f.placeholder}
              value={value}
              options={(f.options || []).map((o: any) =>
                typeof o === "string"
                  ? { label: o, value: o }
                  : { label: o.label, value: o.value }
              )}
              onChange={(v) => saveField(label, v)}
              className={cn(
                "transition-all",
                value ? "border-blue-500 bg-blue-50" : "border-gray-300"
              )}
            />
          );
        })}
      </div>

      {/* ---------------- EXTRA FIELDS ONLY FOR MILITARY PERSON ---------------- */}
      {fields.some((f) => f.label === "Select Rank") && (
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Name"
            placeholder="e.g. John Apradhi"
            value={localData["Name"] || ""}
            onChange={(v) => saveField("Name", v)}
            className={cn(
              "transition-all",
              localData["Name"]
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          />

          <FormInput
            label="Army Number"
            placeholder="e.g. 12345678A"
            value={localData["Army Number"] || ""}
            onChange={(v) => saveField("Army Number", v)}
            className={cn(
              "transition-all",
              localData["Army Number"]
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          />

          <FormInput
            label="Service Type"
            placeholder="Regular / TA / DSC"
            value={localData["Service Type"] || ""}
            onChange={(v) => saveField("Service Type", v)}
            className={cn(
              "transition-all",
              localData["Service Type"]
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          />

          <FormInput
            label="Posting Location"
            placeholder="Enter Posting Location"
            value={localData["Posting Location"] || ""}
            onChange={(v) => saveField("Posting Location", v)}
            className={cn(
              "transition-all",
              localData["Posting Location"]
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          />

          <SuggestionInput
            label="Address"
            placeholder="e.g. C/O 56 APO"
            value={localData["Address"] || ""}
            onChange={(v) => saveField("Address", v)}
            fieldType="address"
            className={cn(
              "transition-all",
              localData["Address"]
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          />

          <FormInput
            label="Phone Number"
            placeholder="e.g. 9876543210"
            value={localData["Phone Number"] || ""}
            onChange={(v) => saveField("Phone Number", v)}
            className={cn(
              "transition-all",
              localData["Phone Number"]
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          />
        </div>
      )}

      {showCoDriver && <></>}
    </div>
  );
}
