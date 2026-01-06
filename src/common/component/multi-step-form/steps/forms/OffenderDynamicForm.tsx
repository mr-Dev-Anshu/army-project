
"use client";

import { useState, useEffect } from "react";
import { FormInput } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";

interface OffenderDynamicFormProps {
  title: string;
  helperText?: string;
  fields: any[];
  scope?: "traffic" | "static";
  path?: string;
  isRoot?: boolean;
}

type Step = {
  id: number;
  type?: string;
  index?: number;
};

const getByPath = (obj: any, path?: string) => {
  if (!obj || !path) return {};
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  return keys.reduce((o, k) => (o ? o[k] : undefined), obj) || {};
};

const labelKeyMap: Record<string, string> = {
  "Full Name": "name",
  Name: "name",
  Rank: "rank",
  "Army Rider / Driver Number": "armyNumber",
  "Army Number": "armyNumber",
  Unit: "unit",
  Command: "command",
  FMN: "fmn",
  Address: "address",
  "ID Card Number": "iCardNumber",
  "Father's Name (Son of)": "so",
  "Father's / Husband's Name": "so",
  "Army Official Name": "armyOfficialName",
  "Pass No.": "passNo",
  "Maid/Servant Pass Number": "passNo",
  "Pass Issue Date": "passIssueDate",
  "Pass Expire Date": "passExpireDate",
};

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  scope = "traffic",
  path = "",
  isRoot = false,
}: OffenderDynamicFormProps) {
  const { state, dispatch } = useForm();

  const globalData = getByPath(state, path);
  const [localData, setLocalData] = useState<any>({});
  const [steps, setSteps] = useState<Step[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ===== CO-DRIVER STATES ===== */
  const [hasCoDriver, setHasCoDriver] = useState(false);
  const [coDriverType, setCoDriverType] = useState("");
  const [coDriverIndex, setCoDriverIndex] = useState<number | null>(null);

  const isMainCivilian =
    title.toLowerCase().includes("civilian") &&
    !title.toLowerCase().includes("co-driver");

  /* ================= SYNC LOCAL DATA ================= */
  useEffect(() => {
    setLocalData(structuredClone(globalData || {}));
    setErrors({}); // ✅ Clear errors on form switch
  }, [path, globalData]);

  /* ================= HYDRATE UI STATE (Fix Back Navigation) ================= */
  useEffect(() => {
    if (!isRoot) return;

    const peoplePath =
      scope === "static"
        ? "formData.staticSpeed.offenderPeople"
        : "formData.traffic.offenderPeople";

    const list = getByPath(state, peoplePath);

    if (Array.isArray(list) && list.length > 0) {
      // 1. Hydrate Co-Driver
      const coDriverIdx = list.findIndex((p: any) => p.whoIsIt === "Co-Driver");
      if (coDriverIdx !== -1) {
        setHasCoDriver(true);
        setCoDriverType(list[coDriverIdx].type);
        setCoDriverIndex(coDriverIdx);
      }

      // 2. Hydrate Additional People
      const newSteps: Step[] = [];
      list.forEach((p: any, idx: number) => {
        // Skip Main Driver (Index 0) and Co-Driver
        if (idx === 0) return;
        if (idx === coDriverIdx) return;

        newSteps.push({
          id: Date.now() + idx, // Generate unique ID
          type: p.type,
          index: idx,
        });
      });

      if (newSteps.length > 0) {
        setSteps(newSteps);
      }
    }
    // Run only once on mount to restore UI
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= SAVE FIELD ================= */
  const saveField = (label: string, value: string) => {
    if (!path) return;

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

    // Validate Dates
    let issueDate = updated["passIssueDate"];
    let expireDate = updated["passExpireDate"];

    if (issueDate && expireDate) {
      const i = new Date(issueDate);
      const e = new Date(expireDate);

      if (e <= i) {
        setErrors((prev) => ({
          ...prev,
          "Pass Expire Date": "Expire date must be greater than Issue date",
        }));
      } else {
        setErrors((prev) => {
          const newErr = { ...prev };
          delete newErr["Pass Expire Date"];
          return newErr;
        });
      }
    }
  };

  /* ================= ADD MORE ================= */
  const addMore = () => {
    setSteps((prev) => [...prev, { id: Date.now() }]);
  };

  /* ================= ADD OFFENDER ================= */
  const handleSelect = (stepId: number, type: string) => {
    const peoplePath =
      scope === "static"
        ? "formData.staticSpeed.offenderPeople"
        : "formData.traffic.offenderPeople";

    const list = getByPath(state, peoplePath) || [];
    const newIndex = list.length;

    dispatch({
      type: "SET_PATH",
      path: peoplePath,
      value: [
        ...list,
        {
          whoIsIt: "Offender",
          type,
          details: {},
        },
      ],
    });

    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, type, index: newIndex } : s
      )
    );
  };

  /* ================= ENSURE CO-DRIVER ================= */
  const ensureCoDriverSlot = (type: string) => {
    const peoplePath =
      scope === "static"
        ? "formData.staticSpeed.offenderPeople"
        : "formData.traffic.offenderPeople";

    const list = getByPath(state, peoplePath) || [];
    const existingIndex = list.findIndex(
      (p: any) => p.whoIsIt === "Co-Driver"
    );

    let newList = [...list];
    let index = existingIndex;

    if (existingIndex >= 0) {
      newList[existingIndex] = { ...newList[existingIndex], type };
    } else {
      index = list.length;
      newList.push({
        whoIsIt: "Co-Driver",
        type,
        details: {},
      });
    }

    dispatch({
      type: "SET_PATH",
      path: peoplePath,
      value: newList,
    });

    return index;
  };

  return (
    <div className="space-y-6 mt-4 bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>
      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {/* ================= MAIN FORM ================= */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f: any, i: number) => {
          const key = labelKeyMap[f.label] || f.label;
          const value = localData?.[key] || "";

          const isSuggestion = [
            "Unit",
            "FMN",
            "Command",
            "Select Rank",
            "Address",
          ].includes(f.label);

          return isSuggestion ? (
            <SuggestionInput
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              value={value}
              onChange={(v) => saveField(f.label, v)}
              fieldType={f.label.toLowerCase()}
              className={cn(value ? "border-blue-500" : "border-gray-300")}
            />
          ) : (
            <FormInput
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              value={value}
              onChange={(v) => saveField(f.label, v)}
              type={f.type === "input" ? "text" : f.type}
              error={errors[f.label]}
            />
          );
        })}
      </div>

      {/* ================= CO-DRIVER ================= */}
      {isRoot &&
        !isMainCivilian &&
        (scope === "traffic" || scope === "static") && (
          <>
            <div className="mt-6 flex items-start gap-2">
              <Checkbox
                checked={hasCoDriver}
                onCheckedChange={(v) => {
                  setHasCoDriver(Boolean(v));
                  setCoDriverType("");
                  setCoDriverIndex(null);
                }}
              />
              <p className="text-sm">
                Was there a <b>Co-Driver / Pillion Rider</b>?
              </p>
            </div>

            {hasCoDriver && (
              <div className="mt-4 space-y-4">
                <RadioGroup
                  value={coDriverType}
                  onValueChange={(v) => {
                    setCoDriverType(v);
                    const idx = ensureCoDriverSlot(v);
                    setCoDriverIndex(idx);
                  }}
                  className="grid grid-cols-2 gap-3"
                >
                  {Object.keys(offenderFormsConfig).map((item) => (
                    <label
                      key={item}
                      className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
                    >
                      <RadioGroupItem value={item} />
                      {item}
                    </label>
                  ))}
                </RadioGroup>

                {coDriverType && coDriverIndex !== null && (
                  <OffenderDynamicForm
                    title={`${coDriverType} (Co-Driver) Details`}
                    fields={offenderFormsConfig[coDriverType].fields}
                    scope={scope}
                    path={
                      scope === "static"
                        ? `formData.staticSpeed.offenderPeople[${coDriverIndex}].details`
                        : `formData.traffic.offenderPeople[${coDriverIndex}].details`
                    }
                    isRoot={false}
                  />
                )}
              </div>
            )}
          </>
        )}

      {/* ================= EXTRA PEOPLE (STEPS) ================= */}
      {steps.map((step) => (
        <div key={step.id} className="mt-8 border-t pt-6">
          <p className="font-semibold mb-3">Additional Person Details</p>

          {!step.type ? (
            <RadioGroup
              onValueChange={(v) => handleSelect(step.id, v)}
              className="grid sm:grid-cols-2 gap-3"
            >
              {Object.keys(offenderFormsConfig).map((item) => (
                <label
                  key={item}
                  className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
                >
                  <RadioGroupItem value={item} />
                  {item}
                </label>
              ))}
            </RadioGroup>
          ) : (
            <OffenderDynamicForm
              title={`${step.type} Details`}
              fields={offenderFormsConfig[step.type].fields}
              scope={scope}
              path={
                scope === "static"
                  ? `formData.staticSpeed.offenderPeople[${step.index}].details`
                  : `formData.traffic.offenderPeople[${step.index}].details`
              }
              isRoot={false}
            />
          )}
        </div>
      ))}

      {/* ================= ADD MORE ================= */}
      {isRoot && (scope === "traffic" || scope === "static") && (
        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={addMore}
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            + Add More People
          </button>
        </div>
      )}
    </div>
  );
}
