
// "use client";

// import { useState, useEffect } from "react";
// import { FormInput, FormSelect } from "@/common/component/FormInput";
// import { SuggestionInput } from "@/common/component/SuggestionInput";
// import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
// import { useForm } from "@/context/FormContext";
// import { cn } from "@/lib/utils";

// interface OffenderDynamicFormProps {
//   title: string;
//   helperText?: string;
//   fields: any[];
//   showCoDriver?: boolean;
//   scope?: "traffic" | "static" | "mp-main" | "mp-additional";
//   path?: string;
// }

// const getByPath = (obj: any, path?: string) => {
//   if (!obj || !path) return {};
//   const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
//   return keys.reduce((o, k) => (o ? o[k] : undefined), obj) || {};
// };

// const labelKeyMap: Record<string, string> = {
//   "Full Name": "name",
//   Name: "name",
//   Rank: "rank",
//   "Army Rider / Driver Number": "armyNumber",
//   "Army Number": "armyNumber",
//   Unit: "unit",
//   Command: "command",
//   FMN: "fmn",
//   Address: "address",
//   "ID Card Number": "iCardNumber",
//   "Aadhar Card Number": "iCardNumber",
//   "I Card Number": "iCardNumber",
// };

// export default function OffenderDynamicForm({
//   title,
//   helperText,
//   fields,
//   showCoDriver = false,
//   scope = "traffic",
//   path = "",
// }: OffenderDynamicFormProps) {
//   const { state, dispatch } = useForm();

//   const globalData = getByPath(state, path);
//   const [localData, setLocalData] = useState<any>({});

//   const [hasCoDriver, setHasCoDriver] = useState(false);
//   const [coDriverType, setCoDriverType] = useState("");
//   const [coDriverIndex, setCoDriverIndex] = useState<number | null>(null);

//   const isMainCivilian =
//     title.toLowerCase().includes("civilian") &&
//     !title.toLowerCase().includes("co-driver");

// useEffect(() => {
//   setLocalData(structuredClone(globalData || {}));
// }, [JSON.stringify(globalData), path]);



// const saveField = (label: string, value: string) => {
//   const key = labelKeyMap[label] || label;
//   setLocalData((prev: any) => ({ ...prev, [key]: value }));
// };


//   // const saveField = (label: string, value: string) => {
//   //   if (!path) return;
//   //   const key = labelKeyMap[label] || label;

//   //   const updated = { ...(globalData || {}), [key]: value };
//   //   setLocalData(updated);

//   //   dispatch({
//   //     type: "SET_PATH",
//   //     path,
//   //     value: updated,
//   //   });
//   // };

//   const ensureCoDriverSlot = (type: string) => {
//     const peoplePath =
//       scope === "static"
//         ? "formData.staticSpeed.offenderPeople"
//         : "formData.traffic.offenderPeople";

//     const list = getByPath(state, peoplePath) || [];
//     const existingIndex = list.findIndex(
//       (p: any) => p.whoIsIt === "Co-Driver"
//     );

//     let newList = [...list];
//     let index = existingIndex;

//     if (existingIndex >= 0) {
//       newList[existingIndex] = { ...newList[existingIndex], type };
//     } else {
//       index = list.length;
//       newList.push({ type, whoIsIt: "Co-Driver", details: {} });
//     }

//     dispatch({
//       type: "SET_PATH",
//       path: peoplePath,
//       value: newList,
//     });

//     return index;
//   };

//   return (
//     <div className="space-y-6 mt-4 bg-white p-6 shadow-sm">
//       <p className="font-semibold text-lg">{title}</p>
//       {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

//       {/* ================= MAIN FORM ================= */}
//       <div className="grid grid-cols-2 gap-4">
//         {fields?.map((f: any, i: number) => {
//           const key = f.key || labelKeyMap[f.label] || f.label;
//           const value = localData?.[key] || "";

//           const isSuggestion = [
//             "Unit",
//             "FMN",
//             "Command",
//             "Select Rank",
//             "Trade",
//             "Place of QTR.",
//             "Place of Work",
//             "Place of Stay",
//             "Address",
//             "Department",
//           ].includes(f.label);

//           if (isSuggestion) {
//             return (
//               <SuggestionInput
//                 key={i}
//                 label={f.label}
//                 placeholder={f.placeholder}
//                 value={value}
//                 onChange={(v) => saveField(f.label, v)}
//                 fieldType={
//                   f.label === "Select Rank"
//                     ? "rank"
//                     : f.label.toLowerCase()
//                 }
//                 className={cn(
//                   value ? "border-blue-500 bg-blue-50" : "border-gray-300"
//                 )}
//               />
//             );
//           }

//           return f.type === "select" ? (
//             <FormSelect
//               key={i}
//               label={f.label}
//               options={f.options || []}
//               value={value}
//               onChange={(v) => saveField(f.label, v)}
//             />
//           ) : (
//             <FormInput
//               key={i}
//               label={f.label}
//               placeholder={f.placeholder}
//               value={value}
//               onChange={(v) => saveField(f.label, v)}
//             />
//           );
//         })}
//       </div>

//       {/* 🔥 CO-DRIVER — ONLY FOR TRAFFIC / STATIC */}
//       {showCoDriver &&
//         !isMainCivilian &&
//         (scope === "traffic" || scope === "static") && (
//           <>
//             <div className="mt-6 flex items-start gap-2">
//               <Checkbox
//                 checked={hasCoDriver}
//                 onCheckedChange={(v) => {
//                   setHasCoDriver(Boolean(v));
//                   setCoDriverType("");
//                   setCoDriverIndex(null);
//                 }}
//               />
//               <p className="text-sm">
//                 Was there a <b>Co-Driver / Pillion Rider</b>?
//               </p>
//             </div>

//             {hasCoDriver && (
//               <div className="mt-4 space-y-4">
//                 <RadioGroup
//                   className="grid grid-cols-2 gap-3"
//                   value={coDriverType}
//                   onValueChange={(v) => {
//                     setCoDriverType(v);
//                     const idx = ensureCoDriverSlot(v);
//                     setCoDriverIndex(idx);
//                   }}
//                 >
//                   {Object.keys(offenderFormsConfig).map((item) => (
//                     <label
//                       key={item}
//                       className="border rounded-lg px-4 py-2 flex gap-2"
//                     >
//                       <RadioGroupItem value={item} />
//                       {item}
//                     </label>
//                   ))}
//                 </RadioGroup>

//                 {coDriverType && coDriverIndex !== null && (
//                   <OffenderDynamicForm
//                     title={`${coDriverType} Details`}
//                     fields={offenderFormsConfig[coDriverType].fields}
//                     scope={scope}
//                     path={
//                       scope === "static"
//                         ? `formData.staticSpeed.offenderPeople[${coDriverIndex}].details`
//                         : `formData.traffic.offenderPeople[${coDriverIndex}].details`
//                     }
//                     showCoDriver={false}
//                   />
//                 )}
//               </div>
//             )}
//           </>
//         )}
//     </div>
//   );
// }





"use client";

import { useState, useEffect, useRef } from "react";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";

interface OffenderDynamicFormProps {
  title: string;
  helperText?: string;
  fields: any[];
  showCoDriver?: boolean;
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
  path?: string;
}

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
  "Aadhar Card Number": "iCardNumber",
  "I Card Number": "iCardNumber",
};

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  showCoDriver = false,
  scope = "traffic",
  path = "",
}: OffenderDynamicFormProps) {
  const { state, dispatch } = useForm();

  const globalData = getByPath(state, path);
  const [localData, setLocalData] = useState<any>({});

  const [hasCoDriver, setHasCoDriver] = useState(false);
  const [coDriverType, setCoDriverType] = useState("");
  const [coDriverIndex, setCoDriverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const isMainCivilian =
    title.toLowerCase().includes("civilian") &&
    !title.toLowerCase().includes("co-driver");

  /* sync local state */
  useEffect(() => {
    setLocalData(structuredClone(globalData || {}));
  }, [JSON.stringify(globalData), path]);

  /* 🔥 AUTO SCROLL + AUTO FOCUS */
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    const t = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 200);

    return () => clearTimeout(t);
  }, [path]);

const saveField = (label: string, value: string) => {
  if (!path) return;

  const key = labelKeyMap[label] || label;

  const updated = {
    ...(globalData || {}),
    [key]: value,
  };

  setLocalData(updated);

  dispatch({
    type: "SET_PATH",
    path,
    value: updated,
  });
};


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
      newList.push({ type, whoIsIt: "Co-Driver", details: {} });
    }

    dispatch({
      type: "SET_PATH",
      path: peoplePath,
      value: newList,
    });

    return index;
  };

  return (
    <div
      ref={containerRef}
      className="space-y-6 mt-4 bg-white p-6 shadow-sm"
    >
      <p className="font-semibold text-lg">{title}</p>
      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {/* ================= MAIN FORM ================= */}
      <div className="grid grid-cols-2 gap-4">
        {fields?.map((f: any, i: number) => {
          const key = f.key || labelKeyMap[f.label] || f.label;
          const value = localData?.[key] || "";

          const isSuggestion = [
            "Unit",
            "FMN",
            "Command",
            "Select Rank",
            "Trade",
            "Place of QTR.",
            "Place of Work",
            "Place of Stay",
            "Address",
            "Department",
          ].includes(f.label);

          if (isSuggestion) {
            return (
              <SuggestionInput
                key={i}
                label={f.label}
                placeholder={f.placeholder}
                value={value}
                onChange={(v) => saveField(f.label, v)}
                fieldType={
                  f.label === "Select Rank"
                    ? "rank"
                    : f.label.toLowerCase()
                }
                className={cn(
                  value ? "border-blue-500 bg-blue-50" : "border-gray-300"
                )}
              />
            );
          }

          return f.type === "select" ? (
            <FormSelect
              key={i}
              label={f.label}
              options={f.options || []}
              value={value}
              onChange={(v) => saveField(f.label, v)}
            />
          ) : (
            <FormInput
              ref={i === 0 ? firstInputRef : undefined}
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              value={value}
              onChange={(v) => saveField(f.label, v)}
            />
          );
        })}
      </div>

      {/* 🔥 CO-DRIVER — ONLY FOR TRAFFIC / STATIC */}
      {showCoDriver &&
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
                  className="grid grid-cols-2 gap-3"
                  value={coDriverType}
                  onValueChange={(v) => {
                    setCoDriverType(v);
                    const idx = ensureCoDriverSlot(v);
                    setCoDriverIndex(idx);
                  }}
                >
                  {Object.keys(offenderFormsConfig).map((item) => (
                    <label
                      key={item}
                      className="border rounded-lg px-4 py-2 flex gap-2"
                    >
                      <RadioGroupItem value={item} />
                      {item}
                    </label>
                  ))}
                </RadioGroup>

                {coDriverType && coDriverIndex !== null && (
                  <OffenderDynamicForm
                    title={`${coDriverType} Details`}
                    fields={offenderFormsConfig[coDriverType].fields}
                    scope={scope}
                    path={
                      scope === "static"
                        ? `formData.staticSpeed.offenderPeople[${coDriverIndex}].details`
                        : `formData.traffic.offenderPeople[${coDriverIndex}].details`
                    }
                    showCoDriver={false}
                  />
                )}
              </div>
            )}
          </>
        )}
    </div>
  );
}
