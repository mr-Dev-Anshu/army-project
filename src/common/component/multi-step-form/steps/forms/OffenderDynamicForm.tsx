"use client";

import { useEffect, useState } from "react";
import { useForm } from "@/context/FormContext";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";

/* ================= TYPES ================= */

type FieldType =
  | { label: string; placeholder?: string; type: "input" }
  | {
      label: string;
      placeholder?: string;
      type: "suggestion";
      fieldType: string;
    };

interface Props {
  title: string;
  helperText?: string;
  fields: FieldType[];
  path: string;
}

/* ================= HELPERS ================= */

const getValueByPath = (obj: any, path?: string) => {
  if (!path) return {};
  return path.split(".").reduce((o: any, k) => o?.[k], obj) || {};
};

/* 🔑 LABEL → KEY MAP (CRITICAL FIX) */
const labelKeyMap: Record<string, string> = {
  "Full Name": "name",
  Name: "name",
  Rank: "rank",
  Unit: "unit",
  Command: "command",
  FMN: "fmn",
  Address: "address",
  "Army Rider / Driver Number": "armyNumber",
  "Army Number": "armyNumber",
  "Aadhar Card Number": "iCardNumber",
  "ID Card Number": "iCardNumber",
  "I Card Number": "iCardNumber",
};

/* ================= COMPONENT ================= */

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  path,
}: Props) {
  const { state, dispatch } = useForm();

  const globalData = getValueByPath(state, path);
  const [localData, setLocalData] = useState<any>({});

  useEffect(() => {
    setLocalData(globalData || {});
  }, [globalData]);

  /* ===== SAVE FIELD (FIXED) ===== */
  const saveField = (label: string, value: any) => {
    const key = labelKeyMap[label] || label;

    const updated = {
      ...(localData || {}),
      [key]: value,
    };

    setLocalData(updated);

    dispatch({
      type: "SET_PATH",
      path,
      value: updated,
    });
  };

  return (
    <div className="space-y-6 border rounded-lg p-5 bg-white">
      {/* ===== HEADER ===== */}
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        {helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>

      {/* ===== FIELDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f, i) => {
          const key = labelKeyMap[f.label] || f.label;
          const value = localData?.[key] || "";

          if (f.type === "suggestion") {
            return (
              <div key={i}>
                <Label>{f.label}</Label>
                <SuggestionInput
                  placeholder={f.placeholder}
                  fieldType={f.fieldType}
                  value={value}
                  onChange={(v) => saveField(f.label, v)}
                />
              </div>
            );
          }

          return (
            <div key={i}>
              <Label>{f.label}</Label>
              <FormInput
                label=""
                placeholder={f.placeholder}
                value={value}
                onChange={(v) => saveField(f.label, v)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
