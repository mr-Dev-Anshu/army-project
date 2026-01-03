"use client";

import { FormInput } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useForm } from "@/context/FormContext";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

/* ================= TYPES ================= */

/** 🔒 Discriminated union (type-safe) */
type FieldType =
  | {
      label: string;
      name: string;
      placeholder?: string;
      type: "input";
    }
  | {
      label: string;
      name: string;
      placeholder?: string;
      type: "suggestion";
      fieldType: string; // ✅ REQUIRED for suggestion
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
  path,
}: OffenderDynamicFormProps) {
  const { state, dispatch } = useForm();

  const backendData = path ? getValueByPath(state, path) : {};
  const [localData, setLocalData] = useState<Record<string, string>>({});

  /* ✅ HYDRATE ON EDIT */
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

  const saveField = (name: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [name]: value }));

    if (!path) return;

    const prev = getValueByPath(state, path) || {};

    dispatch({
      type: "SET_PATH",
      path,
      value: { ...prev, [name]: value },
    });
  };

  return (
    <div className="space-y-6 mt-4 bg-white p-6 rounded-xl">
      <p className="font-semibold text-lg">{title}</p>
      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f, i) => {
          const value = localData[f.name] ?? "";

          /* ✅ Suggestion field (fieldType guaranteed) */
          if (f.type === "suggestion") {
            return (
              <div key={i} className="flex flex-col gap-1">
                <Label>{f.label}</Label>
                <SuggestionInput
                  value={value}
                  placeholder={f.placeholder}
                  onChange={(v) => saveField(f.name, v)}
                  fieldType={f.fieldType} // ✅ ALWAYS string now
                />
              </div>
            );
          }

          /* ✅ Normal input */
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
    </div>
  );
}
