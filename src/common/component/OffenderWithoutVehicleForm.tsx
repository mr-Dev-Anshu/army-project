// // "use client";

// // import { useState } from "react";
// // import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
// // import { useForm } from "@/context/FormContext";
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// // import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
// // import { Checkbox } from "@/components/ui/checkbox";

// // /* ================= TYPES ================= */

// // type OffenderKey = keyof typeof offenderFormsConfig;

// // interface OffenderWithoutVehicleFormProps {
// //   scope?: "traffic" | "static" | "mp-main" | "mp-additional";
// //   externalType?: OffenderKey;
// // }

// // /* ================= COMPONENT ================= */

// // export default function OffenderWithoutVehicleForm({
// //   scope = "traffic",
// //   externalType,
// // }: OffenderWithoutVehicleFormProps) {
// //   const offenderConfig = offenderFormsConfig;
// //   const { dispatch } = useForm();

// //   const [offenderType, setOffenderType] = useState<OffenderKey | "">(
// //     externalType ?? ""
// //   );
// //   const [hasMilitaryRelative, setHasMilitaryRelative] = useState(false);
// //   const [relativeRelation, setRelativeRelation] = useState("");
// //   const [relativeType, setRelativeType] = useState<OffenderKey | "">("");

// //   if (!offenderConfig) return null;

// //   /* ================= PATH RESOLVER ================= */

// //   const getPath = () => {
// //     if (scope === "mp-main")
// //       return "formData.mpReport.individualDetails.tempOffender.details";

// //     if (scope === "mp-additional")
// //       return "formData.mpReport.additionalIndividual.tempOffender.details";

// //     // traffic / static
// //     return "formData.traffic.offenderPeople[0].details";
// //   };

// //   /* ================= SELECT HANDLER ================= */

// //   const handleOffenderSelect = (value: OffenderKey) => {
// //     setOffenderType(value);
// //     setHasMilitaryRelative(false);
// //     setRelativeRelation("");
// //     setRelativeType("");

// //     /* traffic / static */
// //     if (scope === "traffic" || scope === "static") {
// //       dispatch({
// //         type: "SET_PATH",
// //         path: "formData.traffic.offenderPeople",
// //         value: [
// //           ...(state.formData.traffic.offenderPeople || []),
// //           {
// //             type: value,
// //             whoIsIt: "Offender",
// //             details: {},
// //           },
// //         ],
// //       });

// //       dispatch({
// //         type: "SET_PATH",
// //         path: "formData.traffic.vehicleInvolved",
// //         value: "no",
// //       });
// //     }

// //     /* mp-main */
// //     if (scope === "mp-main") {
// //       dispatch({
// //         type: "SET_PATH",
// //         path: "formData.mpReport.individualDetails.tempOffender",
// //         value: { offenderType: value, details: {} },
// //       });
// //     }

// //     /* mp-additional */
// //     if (scope === "mp-additional") {
// //       dispatch({
// //         type: "SET_PATH",
// //         path: "formData.mpReport.additionalIndividual.tempOffender",
// //         value: { offenderType: value, details: {} },
// //       });
// //     }
// //   };

// //   /* ================= UI ================= */

// //   return (
// //     <div className="border rounded-lg p-6 space-y-6">
// //       <p className="font-semibold text-lg">Who was the Offender?</p>

// //       {/* PRIMARY SELECT */}
// //       <RadioGroup
// //         value={offenderType}
// //         onValueChange={(v) => handleOffenderSelect(v as OffenderKey)}
// //         className="grid grid-cols-2 gap-3"
// //       >
// //         {Object.keys(offenderConfig).map((item) => (
// //           <label key={item} className="border rounded-lg px-4 py-2 flex gap-2">
// //             <RadioGroupItem value={item} />
// //             {item}
// //           </label>
// //         ))}
// //       </RadioGroup>

// //       {/* CIVILIAN FLOW */}
// //       {offenderType === "Civilian" && (
// //         <>
// //           <OffenderDynamicForm
// //             scope={scope}
// //             title="Civilian Details"
// //             fields={offenderFormsConfig.Civilian.fields}
// //             path={getPath()}
// //             showCoDriver={false}
// //           />

// //           <div className="flex gap-2 items-center mt-4">
// //             <Checkbox
// //               checked={hasMilitaryRelative}
// //               onCheckedChange={(v) => {
// //                 setHasMilitaryRelative(Boolean(v));
// //                 setRelativeRelation("");
// //                 setRelativeType("");
// //               }}
// //             />
// //             <p className="font-semibold">
// //               Is this person Dependent / Relative of Military Personnel?
// //             </p>
// //           </div>

// //           {hasMilitaryRelative && (
// //             <>
// //               <input
// //                 className="border rounded-lg px-4 py-2 w-full"
// //                 placeholder="Relation (Father / Brother / Husband)"
// //                 value={relativeRelation}
// //                 onChange={(e) => setRelativeRelation(e.target.value)}
// //               />

// //               <RadioGroup
// //                 value={relativeType}
// //                 onValueChange={(v) => setRelativeType(v as OffenderKey)}
// //                 className="grid grid-cols-2 gap-3"
// //               >
// //                 {Object.keys(offenderConfig)
// //                   .filter((i) => i !== "Civilian")
// //                   .map((item) => (
// //                     <label
// //                       key={item}
// //                       className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
// //                     >
// //                       <RadioGroupItem value={item} />
// //                       {item}
// //                     </label>
// //                   ))}
// //               </RadioGroup>

// //               {relativeType && (
// //                 <OffenderDynamicForm
// //                   scope={scope}
// //                   title={`${
// //                     relativeRelation || "Relative"
// //                   } (${relativeType}) Details`}
// //                   fields={offenderFormsConfig[relativeType].fields}
// //                   path={getPath()}
// //                   showCoDriver={false}
// //                 />
// //               )}
// //             </>
// //           )}
// //         </>
// //       )}

// //       {/* OTHER OFFENDERS */}
// //       {offenderType &&
// //         offenderType !== "Civilian" &&
// //         offenderConfig[offenderType] && (
// //           <OffenderDynamicForm
// //             scope={scope}
// //             title={offenderConfig[offenderType].title}
// //             helperText={offenderConfig[offenderType].helperText}
// //             fields={offenderFormsConfig[offenderType].fields}
// //             path={getPath()}
// //             showCoDriver={false}
// //           />
// //         )}
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
// import { useForm } from "@/context/FormContext";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
// import { Checkbox } from "@/components/ui/checkbox";

// /* ================= TYPES ================= */

// type OffenderKey = keyof typeof offenderFormsConfig;

// interface OffenderWithoutVehicleFormProps {
//   scope?: "traffic" | "static" | "mp-main" | "mp-additional";
//   externalType?: OffenderKey;
// }

// /* ================= COMPONENT ================= */

// export default function OffenderWithoutVehicleForm({
//   scope = "traffic",
//   externalType,
// }: OffenderWithoutVehicleFormProps) {
//   const offenderConfig = offenderFormsConfig;
//   const { state, dispatch } = useForm(); // ✅ state added

//   const [offenderType, setOffenderType] = useState<OffenderKey | "">(
//     externalType ?? ""
//   );
//   const [hasMilitaryRelative, setHasMilitaryRelative] = useState(false);
//   const [relativeRelation, setRelativeRelation] = useState("");
//   const [relativeType, setRelativeType] = useState<OffenderKey | "">("");

//   if (!offenderConfig) return null;

//   /* ================= PATH RESOLVER ================= */

//   const getPath = () => {
//     if (scope === "mp-main")
//       return "formData.mpReport.individualDetails.tempOffender.details";

//     if (scope === "mp-additional")
//       return "formData.mpReport.additionalIndividual.tempOffender.details";

//     // traffic / static → last offender index
//     const list =
//       scope === "static"
//         ? state.formData.staticSpeed?.offenderPeople || []
//         : state.formData.traffic?.offenderPeople || [];

//     const index = Math.max(list.length - 1, 0);

//     return scope === "static"
//       ? `formData.staticSpeed.offenderPeople[${index}].details`
//       : `formData.traffic.offenderPeople[${index}].details`;
//   };

//   /* ================= SELECT HANDLER ================= */

//   const handleOffenderSelect = (value: OffenderKey) => {
//     setOffenderType(value);
//     setHasMilitaryRelative(false);
//     setRelativeRelation("");
//     setRelativeType("");

//     /* ================= TRAFFIC / STATIC ================= */
//     if (scope === "traffic" || scope === "static") {
//       const peoplePath =
//         scope === "static"
//           ? "formData.staticSpeed.offenderPeople"
//           : "formData.traffic.offenderPeople";

//       const existing =
//         scope === "static"
//           ? state.formData.staticSpeed?.offenderPeople || []
//           : state.formData.traffic?.offenderPeople || [];

//       dispatch({
//         type: "SET_PATH",
//         path: peoplePath,
//         value: [
//           ...existing,
//           {
//             type: value,
//             whoIsIt: "Offender",
//             details: {},
//           },
//         ],
//       });

//       // no-vehicle flow
//       if (scope === "traffic") {
//         dispatch({
//           type: "SET_PATH",
//           path: "formData.traffic.vehicleInvolved",
//           value: "no",
//         });
//       }
//     }

//     /* ================= MP MAIN ================= */
//     if (scope === "mp-main") {
//       dispatch({
//         type: "SET_PATH",
//         path: "formData.mpReport.individualDetails.tempOffender",
//         value: { offenderType: value, details: {} },
//       });
//     }

//     /* ================= MP ADDITIONAL ================= */
//     if (scope === "mp-additional") {
//       dispatch({
//         type: "SET_PATH",
//         path: "formData.mpReport.additionalIndividual.tempOffender",
//         value: { offenderType: value, details: {} },
//       });
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="border rounded-lg p-6 space-y-6">
//       <p className="font-semibold text-lg">Who was the Offender?</p>

//       {/* PRIMARY SELECT */}
//       <RadioGroup
//         value={offenderType}
//         onValueChange={(v) => handleOffenderSelect(v as OffenderKey)}
//         className="grid grid-cols-2 gap-3"
//       >
//         {Object.keys(offenderConfig).map((item) => (
//           <label key={item} className="border rounded-lg px-4 py-2 flex gap-2">
//             <RadioGroupItem value={item} />
//             {item}
//           </label>
//         ))}
//       </RadioGroup>

//       {/* ================= CIVILIAN FLOW ================= */}
//       {offenderType === "Civilian" && (
//         <>
//           <OffenderDynamicForm
//             scope={scope}
//             title="Civilian Details"
//             fields={offenderFormsConfig.Civilian.fields}
//             path={getPath()}
//             showCoDriver={false}
//           />

//           <div className="flex gap-2 items-center mt-4">
//             <Checkbox
//               checked={hasMilitaryRelative}
//               onCheckedChange={(v) => {
//                 setHasMilitaryRelative(Boolean(v));
//                 setRelativeRelation("");
//                 setRelativeType("");
//               }}
//             />
//             <p className="font-semibold">
//               Is this person Dependent / Relative of Military Personnel?
//             </p>
//           </div>

//           {hasMilitaryRelative && (
//             <>
//               <input
//                 className="border rounded-lg px-4 py-2 w-full"
//                 placeholder="Relation (Father / Brother / Husband)"
//                 value={relativeRelation}
//                 onChange={(e) => setRelativeRelation(e.target.value)}
//               />

//               <RadioGroup
//                 value={relativeType}
//                 onValueChange={(v) =>
//                   setRelativeType(v as OffenderKey)
//                 }
//                 className="grid grid-cols-2 gap-3"
//               >
//                 {Object.keys(offenderConfig)
//                   .filter((i) => i !== "Civilian")
//                   .map((item) => (
//                     <label
//                       key={item}
//                       className="border rounded-lg px-4 py-2 flex gap-2"
//                     >
//                       <RadioGroupItem value={item} />
//                       {item}
//                     </label>
//                   ))}
//               </RadioGroup>

//               {relativeType && (
//                 <OffenderDynamicForm
//                   scope={scope}
//                   title={`${relativeRelation || "Relative"} (${relativeType}) Details`}
//                   fields={offenderFormsConfig[relativeType].fields}
//                   path={getPath()}
//                   showCoDriver={false}
//                 />
//               )}
//             </>
//           )}
//         </>
//       )}

//       {/* ================= OTHER OFFENDERS ================= */}
//       {offenderType &&
//         offenderType !== "Civilian" &&
//         offenderConfig[offenderType] && (
//           <OffenderDynamicForm
//             scope={scope}
//             title={offenderConfig[offenderType].title}
//             helperText={offenderConfig[offenderType].helperText}
//             fields={offenderFormsConfig[offenderType].fields}
//             path={getPath()}
//             showCoDriver={false}
//           />
//         )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

type OffenderKey = keyof typeof offenderFormsConfig;

interface OffenderWithoutVehicleFormProps {
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
  externalType?: OffenderKey;
}

/* ================= COMPONENT ================= */

export default function OffenderWithoutVehicleForm({
  scope = "traffic",
  externalType,
}: OffenderWithoutVehicleFormProps) {
  const offenderConfig = offenderFormsConfig;
  const { state, dispatch } = useForm();

  const [offenderType, setOffenderType] = useState<OffenderKey | "">(
    externalType ?? ""
  );
  const [hasMilitaryRelative, setHasMilitaryRelative] = useState(false);
  const [relativeRelation, setRelativeRelation] = useState("");
  const [relativeType, setRelativeType] = useState<OffenderKey | "">("");

  if (!offenderConfig) return null;

  /* ================= PATH RESOLVER ================= */

  const getPath = () => {
    if (scope === "mp-main")
      return "formData.mpReport.individualDetails.tempOffender.details";

    if (scope === "mp-additional")
      return "formData.mpReport.additionalIndividual.tempOffender.details";

    const list =
      scope === "static"
        ? state.formData.staticSpeed?.offenderPeople || []
        : state.formData.traffic?.offenderPeople || [];

    const index = Math.max(list.length - 1, 0);

    return scope === "static"
      ? `formData.staticSpeed.offenderPeople[${index}].details`
      : `formData.traffic.offenderPeople[${index}].details`;
  };

  /* ================= SELECT HANDLER ================= */

  const handleOffenderSelect = (value: OffenderKey) => {
    setOffenderType(value);
    setHasMilitaryRelative(false);
    setRelativeRelation("");
    setRelativeType("");

    if (scope === "traffic" || scope === "static") {
      const peoplePath =
        scope === "static"
          ? "formData.staticSpeed.offenderPeople"
          : "formData.traffic.offenderPeople";

      const existing =
        scope === "static"
          ? state.formData.staticSpeed?.offenderPeople || []
          : state.formData.traffic?.offenderPeople || [];

      dispatch({
        type: "SET_PATH",
        path: peoplePath,
        value: [
          ...existing,
          {
            type: value,
            whoIsIt: "Offender",
            detailsByType: {
              [value]: {},
            },
          },
        ],
      });

      if (scope === "traffic") {
        dispatch({
          type: "SET_PATH",
          path: "formData.traffic.vehicleInvolved",
          value: "no",
        });
      }
    }

    if (scope === "mp-main") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.individualDetails.tempOffender",
        value: { offenderType: value, details: {} },
      });
    }

    if (scope === "mp-additional") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.additionalIndividual.tempOffender",
        value: { offenderType: value, details: {} },
      });
    }
  };

  /* ================= UI ================= */

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <p className="font-semibold text-lg">Who was the Offender?</p>

      {/* ✅ PRIMARY SELECT (FIXED) */}
      <RadioGroup
        value={offenderType}
        onValueChange={(v) => handleOffenderSelect(v as OffenderKey)}
        className="grid grid-cols-2 gap-3"
      >
        {Object.keys(offenderConfig).map((item) => (
          <label
            key={item}
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition",
              offenderType === item
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          >
            <RadioGroupItem value={item} />
            {item}
          </label>
        ))}
      </RadioGroup>

      {/* ================= CIVILIAN FLOW ================= */}
      {offenderType === "Civilian" && (
        <>
          <OffenderDynamicForm
            scope={scope}
            title="Civilian Details"
            fields={offenderFormsConfig.Civilian.fields}
            path={getPath()}
            showCoDriver={false}
          />

          <div className="flex gap-2 items-center mt-4">
            <Checkbox
              checked={hasMilitaryRelative}
              onCheckedChange={(v) => {
                setHasMilitaryRelative(Boolean(v));
                setRelativeRelation("");
                setRelativeType("");
              }}
            />
            <p className="font-semibold">
              Is this person Dependent / Relative of Military Personnel?
            </p>
          </div>

          {hasMilitaryRelative && (
            <>
              <input
                className="border rounded-lg px-4 py-2 w-full"
                placeholder="Relation (Father / Brother / Husband)"
                value={relativeRelation}
                onChange={(e) => setRelativeRelation(e.target.value)}
              />

              <RadioGroup
                value={relativeType}
                onValueChange={(v) => setRelativeType(v as OffenderKey)}
                className="grid grid-cols-2 gap-3"
              >
                {Object.keys(offenderConfig)
                  .filter((i) => i !== "Civilian")
                  .map((item) => (
                    <label
                      key={item}
                      className={cn(
                        "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                        relativeType === item
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      )}
                    >
                      <RadioGroupItem value={item} />
                      {item}
                    </label>
                  ))}
              </RadioGroup>

              {relativeType && (
                <OffenderDynamicForm
                  key={offenderType}
                  scope={scope}
                  title={`${
                    relativeRelation || "Relative"
                  } (${relativeType}) Details`}
                  fields={offenderFormsConfig[relativeType].fields}
                  path={getPath()}
                  showCoDriver={false}
                />
              )}
            </>
          )}
        </>
      )}

      {/* ================= OTHER OFFENDERS ================= */}
      {offenderType &&
        offenderType !== "Civilian" &&
        offenderConfig[offenderType] && (
          <OffenderDynamicForm
            scope={scope}
            title={offenderConfig[offenderType].title}
            helperText={offenderConfig[offenderType].helperText}
            fields={offenderFormsConfig[offenderType].fields}
            path={getPath()}
            showCoDriver={false}
            isRooti={true}
          />
        )}
    </div>
  );
}
