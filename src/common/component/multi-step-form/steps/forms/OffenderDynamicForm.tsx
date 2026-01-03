
"use client";
import { FormInput } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { Label } from "@/components/ui/label";

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
  const keys = path.match(/[^[.\]]+/g) || [];
  return keys.reduce((o, k) => (o ? o[k] : undefined), obj) || {};
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
  const [coDriverIndex, setCoDriverIndex] = useState<number | null>(null);

  const [hasCoDriver, setHasCoDriver] = useState(false);
  const [coDriverType, setCoDriverType] = useState("");

  const [civilianRelative, setCivilianRelative] = useState(false);
  const [relativeRelation, setRelativeRelation] = useState("");
  const [relativeType, setRelativeType] = useState("");

  const isMainCivilian =
    title.toLowerCase().includes("civilian") &&
    !title.toLowerCase().includes("co-driver");

  useEffect(() => {
    if (scope === "traffic" && path) setLocalData(preData);
    else setLocalData({});
  }, [scope, path]);
  /* ================= LABEL → KEY MAP ================= */
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
    "Aadhar Card Number": "iCardNumber",
    "I Card Number": "iCardNumber",
  };

  /* ================= SAVE FIELD (FIXED) ================= */
  const saveField = (label: string, value: string) => {
    let targetPath = path;

    if (!targetPath && scope === "mp-main")
      targetPath = "formData.mpReport.individualDetails.tempOffender";

    if (!targetPath && scope === "mp-additional")
      targetPath = "formData.mpReport.additionalIndividual.tempOffender";

    const key = labelKeyMap[label] || label; // ⭐ FIX

    setLocalData((prev: any) => ({
      ...(prev || {}),
      [key]: value,
    }));

    if (!targetPath) return;

    const prevGlobal = getValueByPath(state, targetPath) || {};

    dispatch({
      type: "SET_PATH",
      path: targetPath,
      value: {
        ...prevGlobal,
        [key]: value,
      },
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
          const key = labelKeyMap[label] || label;
          const value = localData?.[key] || "";

          if ((f as any).type === "suggestion") {
            return (
              <div key={i} className="flex flex-col gap-1">
                <Label className="font-semibold">{label}</Label>
                <SuggestionInput
                  placeholder={f.placeholder}
                  value={value}
                  onChange={(v) => saveField(label, v)}
                  fieldType={(f as any).fieldType}
                />
              </div>
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

      {/* ================= CIVILIAN → RELATIVE FLOW ================= */}
      {isMainCivilian && (
        <>
          <p className="font-semibold mt-4">
            <input
              type="checkbox"
              checked={civilianRelative}
              onChange={(e) => {
                setCivilianRelative(e.target.checked);
                setRelativeRelation("");
                setRelativeType("");
              }}
              className="mr-2"
            />
            Is this civilian a Dependent or Relative of a Military Personnel?
          </p>

          {civilianRelative && (
            <>
              <p className="font-semibold mt-3">
                Enter Relation of Military Person
              </p>

              <SuggestionInput
                placeholder="e.g. Father / Husband / Brother"
                value={relativeRelation}
                onChange={setRelativeRelation}
                fieldType="relation"
              />

              <p className="font-semibold mt-4">
                Select Military Relative Type
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Military Person",
                  "Employee",
                  "Servant/Maid",
                  "Shop Keeper",
                  "Temporary Hired Worker",
                ].map((item) => (
                  <label
                    key={item}
                    className={cn(
                      "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                      relativeType === item
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="relativeType"
                      value={item}
                      checked={relativeType === item}
                      onChange={() => setRelativeType(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>

              {relativeType && (
                <OffenderDynamicForm
                  title={`${relativeType} Details`}
                  helperText={
                    relativeRelation ? `Relation: ${relativeRelation}` : ""
                  }
                  fields={offenderFormsConfig[relativeType].fields}
                  scope="traffic"
                  path="formData.traffic.offenderPeople[2].details"
                  showCoDriver={false}
                />
              )}
            </>
          )}
        </>
      )}

      {/* ================= NON-CIVILIAN → CODRIVER FLOW ================= */}
      {showCoDriver && !isMainCivilian && (
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
            Was there a Co-Driver or Pillion Rider with the driver/rider?
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
                      onChange={() => {
                        const index =
                          state.formData.traffic.offenderPeople.length;

                        setCoDriverType(item);
                        setCoDriverIndex(index);

                        dispatch({
                          type: "PUSH_PATH",
                          path: "formData.traffic.offenderPeople",
                          value: {
                            type: item,
                            whoIsIt: "Co-Driver",
                            details: {},
                          },
                        });
                      }}
                    />
                    {item}
                  </label>
                ))}
              </div>

              {coDriverType && offenderFormsConfig[coDriverType] && (
                <OffenderDynamicForm
                  title={`${coDriverType} Details`}
                  fields={offenderFormsConfig[coDriverType].fields}
                  scope="traffic"
                  path={`formData.traffic.offenderPeople[${
                    state.formData.traffic.offenderPeople.length - 1
                  }].details`}
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
