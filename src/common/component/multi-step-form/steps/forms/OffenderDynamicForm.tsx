// "use client";

// import { useState, useEffect, useRef } from "react";
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

//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const firstInputRef = useRef<HTMLInputElement | null>(null);

//   const isMainCivilian =
//     title.toLowerCase().includes("civilian") &&
//     !title.toLowerCase().includes("co-driver");

//   useEffect(() => {
//   setLocalData(structuredClone(globalData || {}));
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [path]);

//   /* 🔥 AUTO SCROLL + AUTO FOCUS */
//   useEffect(() => {
//     if (!containerRef.current) return;

//     containerRef.current.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });

//     const t = setTimeout(() => {
//       firstInputRef.current?.focus();
//     }, 200);

//     return () => clearTimeout(t);
//   }, [path]);

// const saveField = (label: string, value: string) => {
//   if (!path) return;

//   const key = labelKeyMap[label] || label;

//   // ✅ ONLY localData is used
//   const updated = {
//     ...(localData || {}),
//     [key]: value,
//   };

//   setLocalData(updated);

//   dispatch({
//     type: "SET_PATH",
//     path,
//     value: updated,
//   });
// };

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
//     <div
//       ref={containerRef}
//       className="space-y-6 mt-4 bg-white p-6 shadow-sm"
//     >
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
//               ref={i === 0 ? firstInputRef : undefined}
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

import { useState, useEffect } from "react";
import { FormInput } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

  const offenderTypeKey = title.replace(" Details", "").trim();
  const globalData = getByPath(state, path);

  const [localData, setLocalData] = useState<any>({});
  const [steps, setSteps] = useState<Step[]>([]);

  /* ================= SYNC ================= */
  useEffect(() => {
    setLocalData(
      structuredClone(globalData?.detailsByType?.[offenderTypeKey] || {})
    );
  }, [path, offenderTypeKey]);

  /* ================= SAVE FIELD ================= */
  const saveField = (label: string, value: string) => {
    if (!path) return;

    const key = labelKeyMap[label] || label;

    dispatch({
      type: "SET_PATH",
      path,
      value: {
        ...(globalData || {}),
        detailsByType: {
          ...(globalData?.detailsByType || {}),
          [offenderTypeKey]: {
            ...(globalData?.detailsByType?.[offenderTypeKey] || {}),
            [key]: value,
          },
        },
      },
    });
  };

  /* ================= ADD MORE ================= */
  const addMore = () => {
    setSteps((prev) => [...prev, { id: Date.now() }]);
  };

  /* ================= SELECT OFFENDER ================= */
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
          detailsByType: { [type]: {} },
        },
      ],
    });

    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId ? { ...s, type, index: newIndex } : s
      )
    );
  };

  return (
    <div className="space-y-6 mt-4 bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>
      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}

      {/* ================= MAIN FORM ================= */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f: any, i: number) => {
          const value = localData?.[labelKeyMap[f.label]] || "";
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
            />
          );
        })}
      </div>

      {/* ================= STEPS ================= */}
      {steps.map((step) => (
        <div key={step.id} className="space-y-4">
          {/* 🔹 OPTIONS — NEVER HIDDEN */}
          <div className="border rounded-lg p-4">
            <p className="font-semibold mb-2">
              Select Who was the Offender?
            </p>

            <RadioGroup
              value={step.type}
              onValueChange={(v) => handleSelect(step.id, v)}
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
          </div>

          {/* 🔹 FORM — COMES BELOW OPTIONS */}
          {step.type && step.index !== undefined && (
            <OffenderDynamicForm
              title={`${step.type} Details`}
              fields={offenderFormsConfig[step.type].fields}
              scope={scope}
              path={`formData.traffic.offenderPeople[${step.index}].details`}
              isRoot={false}
            />
          )}
        </div>
      ))}

      {/* ================= ADD MORE BUTTON ================= */}
      {isRoot && scope === "traffic" && (
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
