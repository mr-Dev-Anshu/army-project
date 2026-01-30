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

import { useState, useEffect } from "react";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

type OffenderKey = keyof typeof offenderFormsConfig;

type Block = {
  id: number;
  type?: OffenderKey;
  index?: number;
};

interface Props {
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
  rootPath?: string; // 👈 NEW: Allow overriding the state path
}

/* ================= COMPONENT ================= */

export default function OffenderWithoutVehicleForm({
  scope = "traffic",
  rootPath,
}: Props) {
  const { state, dispatch } = useForm();
  const [blocks, setBlocks] = useState<Block[]>([{ id: Date.now() }]);

  /* ================= HYDRATE FROM STATE ================= */
  /* ================= HYDRATE FROM STATE ================= */
  useEffect(() => {
    let list: any[] = [];
    let isMp = false;

    // 1. Traffic / Static (Array)
    if (scope === "traffic" || scope === "static") {
      list = scope === "static"
        ? state.formData.staticSpeed?.offenderPeople || []
        : state.formData.traffic?.offenderPeople || [];
    }

    // 2. MP / Root Path (Single Object wrapped in array for consistent logic here)
    if (scope === "mp-main" || scope === "mp-additional" || rootPath) {
      isMp = true;
      let tempPath = "";
      if (rootPath) {
        tempPath = `${rootPath}.tempOffender`;
      } else if (scope === "mp-main") {
        tempPath = "formData.mpReport.individualDetails.tempOffender";
      } else if (scope === "mp-additional") {
        tempPath = "formData.mpReport.additionalIndividual.tempOffender";
      }

      // Helper to access deep path
      const getValue = (obj: any, path: string) =>
        path.split(".").reduce((o, k) => (o || {})[k], obj);

      const temp = getValue(state, tempPath);
      if (temp?.offenderType) {
        list = [{ type: temp.offenderType, index: 0 }];
      }
    }

    // SYNC LOGIC
    // We only update blocks if the list from state is different structurally (length or types)
    // from our local blocks, to avoid re-generating IDs and losing focus/state.

    // Check length mismatch
    let shouldUpdate = list.length !== blocks.length;

    // Check type mismatch
    if (!shouldUpdate) {
      shouldUpdate = list.some((p: any, i: number) => {
        // MP logic differs slightly in object structure, but 'type' field is common in my mapping above?
        // Wait, for MP I constructed a list item with 'type'. For traffic, 'p' has 'type'.
        const stateType = p.type || p.offenderType;
        const blockType = blocks[i]?.type;
        return stateType !== blockType;
      });
    }

    if (shouldUpdate) {
      if (list.length > 0) {
        const restored = list.map((p: any, i: number) => ({
          id: Date.now() + i, // Generate new IDs only when structure mismatch (e.g. hydration)
          type: p.type || p.offenderType,
          index: i,
        }));
        setBlocks(restored);
      } else {
        // If state is empty but we have blocks (and it's not default empty block), clear.
        // But we usually want at least one empty block?
        // Use default if nothing in state.
        setBlocks([{ id: Date.now() }]);
      }
    }

  }, [state.formData, scope, rootPath]); // We rely on blocks in closure for comparison, which is fine since we want to compare with CURRENT blocks. 
  // Warning: exhaustive-deps might want 'blocks' in dependency.
  // If we add 'blocks', every local update triggers this. 
  // BUT we only update if mismatch. So it should stabilize.


  /* ================= ADD MORE ================= */
  const addMore = () => {
    setBlocks((prev) => [...prev, { id: Date.now() }]);
  };

  /* ================= SELECT HANDLER ================= */
  const handleSelect = (blockId: number, type: OffenderKey) => {
    /* --- CASE 1: TRAFFIC / STATIC (ARRAY) --- */
    if (scope === "traffic" || scope === "static") {
      const peoplePath =
        scope === "static"
          ? "formData.staticSpeed.offenderPeople"
          : "formData.traffic.offenderPeople";

      const existing =
        scope === "static"
          ? state.formData.staticSpeed?.offenderPeople || []
          : state.formData.traffic?.offenderPeople || [];

      // Logic: If block already mapped to index, update it. Else append.
      const currentBlock = blocks.find((b) => b.id === blockId);
      let newList = [...existing];
      let finalIndex = existing.length;

      if (
        currentBlock?.index !== undefined &&
        currentBlock.index < existing.length
      ) {
        finalIndex = currentBlock.index;
        newList[finalIndex] = {
          whoIsIt: "Offender",
          type,
          details: {},
        };
      } else {
        newList.push({
          whoIsIt: "Offender",
          type,
          details: {},
        });
      }

      dispatch({
        type: "SET_PATH",
        path: peoplePath,
        value: newList,
      });

      if (scope === "traffic") {
        dispatch({
          type: "SET_PATH",
          path: "formData.traffic.vehicleInvolved",
          value: "no",
        });
      }

      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId ? { ...b, type, index: finalIndex } : b
        )
      );
    }

    /* --- CASE 2: MP / ROOT PATH (SINGLE OBJECT) --- */
    else {
      let tempPath = "";
      if (rootPath) {
        tempPath = `${rootPath}.tempOffender`;
      } else if (scope === "mp-main") {
        tempPath = "formData.mpReport.individualDetails.tempOffender";
      } else if (scope === "mp-additional") {
        tempPath = "formData.mpReport.additionalIndividual.tempOffender";
      }

      dispatch({
        type: "SET_PATH",
        path: tempPath,
        value: { offenderType: type, details: {} },
      });

      setBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, type, index: 0 } : b))
      );
    }
  };

  /* ================= PATH HELPER FOR RENDER ================= */
  const getRenderPath = (block: Block) => {
    if (scope === "traffic")
      return `formData.traffic.offenderPeople[${block.index}].details`;
    if (scope === "static")
      return `formData.staticSpeed.offenderPeople[${block.index}].details`;

    if (rootPath) return `${rootPath}.tempOffender.details`;

    if (scope === "mp-main")
      return "formData.mpReport.individualDetails.tempOffender.details";
    if (scope === "mp-additional")
      return "formData.mpReport.additionalIndividual.tempOffender.details";

    return "";
  };

  return (
    <div className="space-y-6 border rounded-lg p-6 bg-white">
      <p className="font-semibold text-lg">Select Who was the Driver / Rider?</p>

      {/* ================= BLOCKS ================= */}
      {blocks.map((block) => (
        <div key={block.id} className="space-y-4">
          {/* 🔹 OPTIONS */}
          <div className="border rounded-lg p-4">
            <RadioGroup
              value={(block.type as string) || ""}
              onValueChange={(v) => handleSelect(block.id, v as OffenderKey)}
              className="grid grid-cols-2 gap-3"
            >
              {Object.keys(offenderFormsConfig).map((item) => (
                <label
                  key={item}
                  className={cn(
                    "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition",
                    block.type === item
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  )}
                >
                  <RadioGroupItem value={item} />
                  {item}
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* 🔹 FORM */}
          {block.type && block.index !== undefined && (
            <OffenderDynamicForm
              title={`${String(block.type)} Details`}
              fields={offenderFormsConfig[block.type].fields}
              scope={scope as any}
              path={getRenderPath(block)}
              isRoot={false}
            />
          )}
        </div>
      ))}

      {/* ================= ADD MORE BUTTON (Only Traffic/Static) ================= */}
      {(scope === "traffic" || scope === "static") && (
        <div className="flex justify-end">
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
