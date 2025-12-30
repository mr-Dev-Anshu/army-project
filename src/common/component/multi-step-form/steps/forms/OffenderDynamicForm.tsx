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

/* safe getter */
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
    scope === "traffic" && path 
      ? getValueByPath(state, path)
      : {};

  const [localData, setLocalData] = useState<any>({});

  /* ✅ traffic ko hi preload karna allowed */
  useEffect(() => {
    if (scope === "traffic" && path) {
      setLocalData(preData);
    } else {
      setLocalData({});
    }
  }, [scope, path]);        //  IMPORTANT FIX

  const saveField = (label: string, value: string) => {
    let targetPath = path;

    if (!targetPath && scope === "mp-main") {
      targetPath = "formData.mpReport.individualDetails.tempOffender";
    }

    if (!targetPath && scope === "mp-additional") {
      targetPath = "formData.mpReport.additionalIndividual.tempOffender";
    }

    if (!targetPath) return;

    // 🔥 Always use latest value from global also
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
              <FormSelect
                key={i}
                label="Select Rank"
                placeholder="Select Rank"
                value={value}
                options={["L/Nk", "Nk", "Hav", "Subedar"]}
                onChange={(v) => saveField("Select Rank", v)}
              />
            );

          if (label === "Unit")
            return (
              <FormSelect
                key={i}
                label="Unit"
                placeholder="Select Unit"
                value={value}
                options={["11 Engr Regt", "MP Unit 12", "HQ Unit"]}
                onChange={(v) => saveField("Unit", v)}
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
            />
          );
        })}
      </div>

      {showCoDriver && <></>}
    </div>
  );
}
