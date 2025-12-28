

"use client";

import { FormInput, FormSelect } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";

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
}

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  showCoDriver = false,
  scope = "traffic",
}: OffenderDynamicFormProps) {
  const { state, dispatch } = useForm();

  const people =
    scope === "static"
      ? state.formData.staticSpeed.offenderPeople || []
      : state.formData.traffic.offenderPeople || [];

  const mpDriver =
    scope === "mp-main"
      ? state.formData.mpReport.individualDetails.tempOffender || {}
      : state.formData.mpReport.additionalIndividual.tempOffender || {};

  const normalDriver =
    people.find((p: any) => p.type === "Driver")?.details || {};

  const driver = scope.startsWith("mp") ? mpDriver : normalDriver;

  /* ========= MP SAVE ========= */
  const saveToMp = (label: string, value: string) => {
    const section =
      scope === "mp-main" ? "individualDetails" : "additionalIndividual";

    const prev = state.formData.mpReport?.[section]?.tempOffender || {};

    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.${section}.tempOffender`,
      value: {
        ...prev,
        [label]: value,
      },
    });
  };

  /* ========= UNIVERSAL SAVE ========= */
  const saveField = (label: string, value: string) => {
    if (scope.startsWith("mp")) {
      saveToMp(label, value);
      return;
    }

    const isCoDriverField = label.startsWith("CoDriver_");
    const personType = isCoDriverField ? "CoDriver" : "Driver";
    const pureLabel = isCoDriverField ? label.replace("CoDriver_", "") : label;

    const updatePeopleArray = (existing: any[] = []) => {
      const idx = existing.findIndex((p: any) => p.type === personType);

      if (idx >= 0) {
        return existing.map((p) =>
          p.type === personType
            ? {
                ...p,
                details: {
                  ...p.details,
                  [pureLabel]: value,
                },
              }
            : p
        );
      }

      return [
        ...existing,
        {
          type: personType,
          details: {
            [pureLabel]: value,
          },
        },
      ];
    };

    if (scope === "static") {
      dispatch({
        type: "SET_PATH",
        path: "formData.staticSpeed.offenderPeople",
        value: updatePeopleArray(state.formData.staticSpeed.offenderPeople),
      });
    } else {
      dispatch({
        type: "SET_PATH",
        path: "formData.traffic.offenderPeople",
        value: updatePeopleArray(state.formData.traffic.offenderPeople),
      });
    }
  };

  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      <div className="grid grid-cols-2 gap-4">
        {fields.map((f, i) => {
          const label = f.label;

          /* ---------- FORCE RANK DROPDOWN ---------- */
          if (label === "Select Rank") {
            return (
              <FormSelect
                key={i}
                label="Select Rank"
                placeholder="Select Rank"
                value={(driver as any)?.["Select Rank"] || ""}
                options={[
                  "L/Nk",
                  "Nk",
                  "Hav",
                  "Subedar",
                ]}
                onChange={(value) => saveField("Select Rank", value)}
              />
            );
          }

          /* ---------- FORCE UNIT DROPDOWN ---------- */
          if (label === "Unit") {
            return (
              <FormSelect
                key={i}
                label="Unit"
                placeholder="Select Unit"
                value={(driver as any)?.["Unit"] || ""}
                options={[
                  "11 Engr Regt",
                  "MP Unit 12",
                  "HQ Unit",
                ]}
                onChange={(value) => saveField("Unit", value)}
              />
            );
          }

          /* ---------- SUGGESTION INPUTS ---------- */
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

          if (isSuggestion) {
            return (
              <SuggestionInput
                key={i}
                label={label}
                placeholder={f.placeholder}
                value={(driver as any)?.[label] || ""}
                onChange={(value) => saveField(label, value)}
                fieldType={label.toLowerCase()}
                className={cn(
                  "transition-all",
                  (driver as any)?.[label]
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                )}
              />
            );
          }

          /* ---------- DEFAULT INPUT / SELECT ---------- */
          return f.type === "input" ? (
            <FormInput
              key={i}
              label={label}
              placeholder={f.placeholder}
              value={(driver as any)?.[label] || ""}
              onChange={(value) => saveField(label, value)}
            />
          ) : (
            <FormSelect
              key={i}
              label={label}
              placeholder={f.placeholder}
              value={(driver as any)?.[label] || ""}
              options={(f.options || []).map((o: any) =>
                typeof o === "string"
                  ? { label: o, value: o }
                  : { label: o.label, value: o.value }
              )}
              onChange={(value) => saveField(label, value)}
            />
          );
        })}
      </div>

      {showCoDriver && <></>}
    </div>
  );
}
