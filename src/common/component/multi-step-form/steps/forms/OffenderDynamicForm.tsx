
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
  "Civil/DD Vehicle Rider/Driver Name": "name",
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
  "Aadhar Card Number": "aadharNumber",
  "Name the relation": "relationName",
  "Who is it?": "relativeType",
  "Who was the Co-Driver / Pillion Rider?": "coDriverType",
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
    const issueKey = "passIssueDate";
    const expireKey = "passExpireDate";

    let issueDate = updated[issueKey];
    let expireDate = updated[expireKey];

    // If current field is issue date or expire date, re-validate
    if (key === issueKey || key === expireKey) {
      if (issueDate && expireDate) {
        const i = new Date(issueDate);
        const e = new Date(expireDate);

        if (e <= i) {
          setErrors((prev) => ({
            ...prev,
            "Pass Expire Date": "Pass Expire Date must be later than Pass Issue Date",
          }));
        } else {
          setErrors((prev) => {
            const newErr = { ...prev };
            delete newErr["Pass Expire Date"];
            return newErr;
          });
        }
      } else {
        // If one is missing, clear error just in case? Or wait? 
        // Better to clear error if one is removed.
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
    <div className="space-y-6 mt-4 bg-white p-6 shadow-sm rounded-lg">
      <div className="space-y-1">
        <p className="font-semibold text-base text-black">{title}</p>
        {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>

      {/* ================= MAIN FORM ================= */}
      <div className="grid grid-cols-1 gap-4">
        {fields.map((f: any, i: number) => {
          // Handle checkbox fields with nested content
          if (f.type === "checkbox") {
            const checkboxKey = `checkbox_${i}`;
            const isChecked = localData?.[checkboxKey] || false;

            return (
              <div key={i} className="space-y-4">
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(v) => {
                      const updated = {
                        ...localData,
                        [checkboxKey]: Boolean(v),
                      };
                      setLocalData(updated);
                      dispatch({
                        type: "SET_PATH",
                        path,
                        value: updated,
                      });
                    }}
                  />
                  <label className="text-sm leading-relaxed cursor-pointer">{f.label}</label>
                </div>

                {/* Render nested fields when checkbox is checked */}
                {isChecked && f.fields && f.fields.length > 0 && (
                  <div className="space-y-4">
                    {f.fields.map((nestedField: any, nIdx: number) => {
                      const nestedKey = labelKeyMap[nestedField.label] || `nested_${checkboxKey}_${nIdx}`;
                      const nestedValue = localData?.[nestedKey] || "";

                      // Handle nested checkbox within checkbox
                      if (nestedField.type === "checkbox") {
                        const nestedCheckboxKey = `${checkboxKey}_nested_${nIdx}`;
                        const isNestedChecked = localData?.[nestedCheckboxKey] || false;

                        return (
                          <div key={nIdx} className="space-y-4">
                            <div className="flex items-start gap-2">
                              <Checkbox
                                checked={isNestedChecked}
                                onCheckedChange={(v) => {
                                  const updated = {
                                    ...localData,
                                    [nestedCheckboxKey]: Boolean(v),
                                  };
                                  setLocalData(updated);
                                  dispatch({
                                    type: "SET_PATH",
                                    path,
                                    value: updated,
                                  });
                                }}
                              />
                              <label className="text-sm leading-relaxed cursor-pointer">
                                {nestedField.label}
                              </label>
                            </div>

                            {/* Render fields within nested checkbox */}
                            {isNestedChecked && nestedField.fields && nestedField.fields.length > 0 && (
                              <div className="space-y-4">
                                {nestedField.fields.map((deepNestedField: any, dnIdx: number) => {
                                  const deepNestedKey = labelKeyMap[deepNestedField.label] || `deep_${nestedCheckboxKey}_${dnIdx}`;
                                  const deepNestedValue = localData?.[deepNestedKey] || "";

                                  // Handle deep nested radio group (for co-driver selection)
                                  if (deepNestedField.type === "radio") {
                                    return (
                                      <div key={dnIdx} className="space-y-4">
                                        <div className="space-y-2">
                                          <label className="font-semibold text-sm block">{deepNestedField.label}</label>
                                          <RadioGroup
                                            value={deepNestedValue}
                                            onValueChange={(v) => {
                                              const updated = {
                                                ...localData,
                                                [deepNestedKey]: v,
                                              };
                                              setLocalData(updated);
                                              dispatch({
                                                type: "SET_PATH",
                                                path,
                                                value: updated,
                                              });
                                            }}
                                            className="grid grid-cols-2 gap-3"
                                          >
                                            {deepNestedField.options?.map((opt: any) => (
                                              <label
                                                key={opt.value}
                                                className={cn(
                                                  "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-colors",
                                                  deepNestedValue === opt.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-300"
                                                )}
                                              >
                                                <RadioGroupItem value={opt.value} />
                                                {opt.label}
                                              </label>
                                            ))}
                                          </RadioGroup>
                                        </div>

                                        {/* Show dynamic form fields for co-driver type */}
                                        {deepNestedValue && offenderFormsConfig[deepNestedValue] && (
                                          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="font-semibold text-sm mb-3">
                                              {deepNestedValue} Details
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                              {offenderFormsConfig[deepNestedValue].fields.map((dynamicField: any, dfIdx: number) => {
                                                const dynamicKey = `${deepNestedKey}_${labelKeyMap[dynamicField.label] || dynamicField.label}`;
                                                const dynamicValue = localData?.[dynamicKey] || "";

                                                return (
                                                  <FormInput
                                                    key={dfIdx}
                                                    label={dynamicField.label}
                                                    placeholder={dynamicField.placeholder}
                                                    value={dynamicValue}
                                                    onChange={(v) => {
                                                      const updated = {
                                                        ...localData,
                                                        [dynamicKey]: v,
                                                      };
                                                      setLocalData(updated);
                                                      dispatch({
                                                        type: "SET_PATH",
                                                        path,
                                                        value: updated,
                                                      });
                                                    }}
                                                    type={dynamicField.type === "input" ? "text" : dynamicField.type}
                                                  />
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }

                                  return null;
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Handle nested radio group
                      if (nestedField.type === "radio") {
                        return (
                          <div key={nIdx} className="space-y-3">
                            <label className="font-medium text-sm text-black block">{nestedField.label}</label>
                            <RadioGroup
                              value={nestedValue}
                              onValueChange={(v) => saveField(nestedField.label, v)}
                              className="grid grid-cols-2 gap-3"
                            >
                              {nestedField.options?.map((opt: any) => (
                                <label
                                  key={opt.value}
                                  className={cn(
                                    "border rounded-lg px-4 py-3 flex gap-2 cursor-pointer transition-all duration-200",
                                    nestedValue === opt.value
                                      ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                                      : "border-gray-300 hover:border-gray-400 bg-white"
                                  )}
                                >
                                  <RadioGroupItem value={opt.value} />
                                  <span className="text-sm">{opt.label}</span>
                                </label>
                              ))}
                            </RadioGroup>

                            {/* Show dynamic form fields based on selected type */}
                            {nestedValue && offenderFormsConfig[nestedValue] && (
                              <div className="mt-4 p-5 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="font-medium text-sm text-black mb-4">
                                  {nestedValue} Details
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                  {offenderFormsConfig[nestedValue].fields.map((dynamicField: any, dfIdx: number) => {
                                    const dynamicKey = `${nestedKey}_${labelKeyMap[dynamicField.label] || dynamicField.label}`;
                                    const dynamicValue = localData?.[dynamicKey] || "";

                                    return (
                                      <FormInput
                                        key={dfIdx}
                                        label={dynamicField.label}
                                        placeholder={dynamicField.placeholder}
                                        value={dynamicValue}
                                        onChange={(v) => {
                                          const updated = {
                                            ...localData,
                                            [dynamicKey]: v,
                                          };
                                          setLocalData(updated);
                                          dispatch({
                                            type: "SET_PATH",
                                            path,
                                            value: updated,
                                          });
                                        }}
                                        type={dynamicField.type === "input" ? "text" : dynamicField.type}
                                      />
                                    );
                                  })}
                                </div>

                                {/* Show Co-Driver checkbox after the dynamic fields */}
                                {nestedField.label === "Who is it?" && (
                                  <div className="mt-6 pt-5 border-t border-gray-300">
                                    <div className="flex items-start gap-2 mb-4">
                                      <Checkbox
                                        checked={localData?.coDriverCheckbox || false}
                                        onCheckedChange={(v) => {
                                          const updated = {
                                            ...localData,
                                            coDriverCheckbox: Boolean(v),
                                          };
                                          setLocalData(updated);
                                          dispatch({
                                            type: "SET_PATH",
                                            path,
                                            value: updated,
                                          });
                                        }}
                                      />
                                      <label className="text-sm leading-relaxed cursor-pointer">
                                        Was there a Co-Driver or Pillion Rider with the driver/rider?
                                      </label>
                                    </div>

                                    {/* Co-Driver selection */}
                                    {localData?.coDriverCheckbox && (
                                      <div className="space-y-3">
                                        <label className="font-medium text-sm text-black block">
                                          Who was the Co-Driver / Pillion Rider?
                                        </label>
                                        <RadioGroup
                                          value={localData?.coDriverType || ""}
                                          onValueChange={(v) => {
                                            const updated = {
                                              ...localData,
                                              coDriverType: v,
                                            };
                                            setLocalData(updated);
                                            dispatch({
                                              type: "SET_PATH",
                                              path,
                                              value: updated,
                                            });
                                          }}
                                          className="grid grid-cols-2 gap-3"
                                        >
                                          {[
                                            { label: "Military Personnel", value: "Military Person" },
                                            { label: "Civilian / Dependent", value: "Civilian / Dependent" },
                                            { label: "Employee", value: "Employee" },
                                            { label: "Servant / Maid", value: "Servant/Maid" },
                                            { label: "Shop Keeper", value: "Shop Keeper" },
                                            { label: "Temporary Hired Worker", value: "Temporary Hired Worker" },
                                          ].map((opt) => (
                                            <label
                                              key={opt.value}
                                              className={cn(
                                                "border rounded-lg px-4 py-3 flex gap-2 cursor-pointer transition-all duration-200",
                                                localData?.coDriverType === opt.value
                                                  ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                                                  : "border-gray-300 hover:border-gray-400 bg-white"
                                              )}
                                            >
                                              <RadioGroupItem value={opt.value} />
                                              <span className="text-sm">{opt.label}</span>
                                            </label>
                                          ))}
                                        </RadioGroup>

                                        {/* Co-Driver dynamic fields */}
                                        {localData?.coDriverType && offenderFormsConfig[localData.coDriverType] && (
                                          <div className="mt-4 p-5 bg-white rounded-lg border border-gray-300">
                                            <p className="font-medium text-sm text-black mb-4">
                                              {localData.coDriverType} Details
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                              {offenderFormsConfig[localData.coDriverType].fields.map((cdField: any, cdIdx: number) => {
                                                const cdKey = `coDriver_${labelKeyMap[cdField.label] || cdField.label}`;
                                                const cdValue = localData?.[cdKey] || "";

                                                return (
                                                  <FormInput
                                                    key={cdIdx}
                                                    label={cdField.label}
                                                    placeholder={cdField.placeholder}
                                                    value={cdValue}
                                                    onChange={(v) => {
                                                      const updated = {
                                                        ...localData,
                                                        [cdKey]: v,
                                                      };
                                                      setLocalData(updated);
                                                      dispatch({
                                                        type: "SET_PATH",
                                                        path,
                                                        value: updated,
                                                      });
                                                    }}
                                                    type={cdField.type === "input" ? "text" : cdField.type}
                                                  />
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Handle nested input
                      return (
                        <FormInput
                          key={nIdx}
                          label={nestedField.label}
                          placeholder={nestedField.placeholder}
                          value={nestedValue}
                          onChange={(v) => saveField(nestedField.label, v)}
                          type="text"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular field handling
          const key = labelKeyMap[f.label] || f.label;
          const value = localData?.[key] || "";

          const isSuggestion = [
            "Unit",
            "FMN",
            "Command",
            "Select Rank",
            "Address",
            "ID Card Number",
            "I Card Number",
            "Army Rider / Driver Number",
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
              defaultOptions={f.options}
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
