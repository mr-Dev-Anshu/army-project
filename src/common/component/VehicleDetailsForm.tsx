// "use client";
// import { useState } from "react";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
// import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
// import { useForm } from "@/context/FormContext";
// import { SuggestionInput } from "@/common/component/SuggestionInput";
// import { cn } from "@/lib/utils";
// import { Checkbox } from "@/components/ui/checkbox";

// type ScopeType = "traffic" | "static" | "mp-main" | "mp-additional";

// interface VehicleDetailsFormProps {
//   scope?: ScopeType;
// }

// export default function VehicleDetailsForm({
//   scope = "traffic",
// }: VehicleDetailsFormProps) {
//   const { state, dispatch } = useForm();

//   const traffic = state.formData.traffic;
//   const staticSpeed = state.formData.staticSpeed;

//   const [offenders, setOffenders] = useState<
//     { id: number; type: string | null }[]
//   >([]);

//   const [coDriverIndex, setCoDriverIndex] = useState<number | null>(null);

//   if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;

//   const vehicleState =
//     scope === "traffic"
//       ? traffic?.vehicleDetails || {}
//       : scope === "static"
//       ? staticSpeed?.vehicleDetails || {}
//       : scope === "mp-main"
//       ? state.formData?.mpReport?.individualDetails?.vehicleData || {}
//       : scope === "mp-additional"
//       ? state.formData?.mpReport?.additionalIndividual?.vehicleData || {}
//       : {};

//   const { category = "", vehicleType = "", driverType = "" } = vehicleState;

//   const updateVehicle = (data: any) => {
//     const updated = { ...vehicleState, ...data };

//     dispatch({
//       type: "SET_PATH",
//       path:
//         scope === "traffic"
//           ? "formData.traffic.vehicleDetails"
//           : scope === "static"
//           ? "formData.staticSpeed.vehicleDetails"
//           : scope === "mp-main"
//           ? "formData.mpReport.individualDetails.vehicleData"
//           : "formData.mpReport.additionalIndividual.vehicleData",
//       value: updated,
//     });
//   };

//   const [hasCoDriver, setHasCoDriver] = useState("");
//   const [coDriverType, setCoDriverType] = useState("");
//   const [civilianRelative, setCivilianRelative] = useState("");

//   const driverPath =
//     scope === "traffic"
//       ? "formData.traffic.offenderPeople"
//       : scope === "static"
//       ? "formData.staticSpeed.offenderPeople"
//       : scope === "mp-main"
//       ? "formData.mpReport.individualDetails.tempOffender"
//       : "formData.mpReport.additionalIndividual.tempOffender";

//   const coDriverPath =
//     scope === "traffic"
//       ? "formData.traffic.vehicleDetails.coDriver"
//       : scope === "static"
//       ? "formData.staticSpeed.vehicleDetails.coDriver"
//       : scope === "mp-main"
//       ? "formData.mpReport.individualDetails.tempOffender"
//       : "formData.mpReport.additionalIndividual.tempOffender";

//   return (
//     <div className="bg-white p-4 space-y-6">
//       <div>
//         <p className="font-semibold mb-2">Select Vehicle Category</p>

//         <RadioGroup
//           value={category}
//           onValueChange={(v) => updateVehicle({ category: v })}
//           className="grid sm:grid-cols-2 gap-3"
//         >
//           <label
//             className={cn(
//               "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
//               category === "2w"
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-300"
//             )}
//           >
//             <RadioGroupItem value="2w" /> 2-Wheeler
//           </label>

//           <label
//             className={cn(
//               "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
//               category === "4w"
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-300"
//             )}
//           >
//             <RadioGroupItem value="4w" /> 4-Wheeler
//           </label>
//         </RadioGroup>
//       </div>

//       <div>
//         <p className="font-semibold mb-2">
//           Which Type Of Vehicle Was Involved?
//         </p>

//         <RadioGroup
//           value={vehicleType}
//           onValueChange={(v) =>
//             updateVehicle({
//               vehicleType: v,
//               vehicleNumber: "",
//               vehicleName: "",
//             })
//           }
//           className="grid sm:grid-cols-2 gap-3"
//         >
//           <label
//             className={cn(
//               "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
//               vehicleType === "civilian"
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-300"
//             )}
//           >
//             <RadioGroupItem value="civilian" /> Civilian Vehicle
//           </label>

//           <label
//             className={cn(
//               "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
//               vehicleType === "dd"
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-300"
//             )}
//           >
//             <RadioGroupItem value="dd" /> DD Vehicle
//           </label>
//         </RadioGroup>
//       </div>

//       {vehicleType === "civilian" && (
//         <div>
//           <p className="font-semibold mb-2">Fill Vehicle Identification</p>

//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <Label className="mb-3 ">Civil Vehicle Registration Number</Label>
//               <SuggestionInput
//                 placeholder="e.g. MP04 AB 1234"
//                 value={vehicleState.vehicleNumber || ""}
//                 onChange={(v) => updateVehicle({ vehicleNumber: v })}
//                 fieldType="vehicleNumber"
//               />
//             </div>

//             <div>
//               <Label className="mb-3">Make & Type (Vehicle Name)</Label>
//               <SuggestionInput
//                 placeholder="e.g. Honda CB Hornet"
//                 value={vehicleState.vehicleName || ""}
//                 onChange={(v) => updateVehicle({ vehicleName: v })}
//                 fieldType="vehicleName"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {vehicleType === "dd" && (
//         <div>
//           <p className="font-semibold mb-2">Fill Vehicle Identification</p>

//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <Label>DD Vehicle BA Number</Label>
//               <SuggestionInput
//                 placeholder="e.g. 12A 345678Z"
//                 value={vehicleState.vehicleNumber || ""}
//                 onChange={(v) => updateVehicle({ vehicleNumber: v })}
//                 fieldType="vehicleNumber"
//               />
//             </div>

//             <div>
//               <Label>Make & Type (Vehicle Name)</Label>
//               <SuggestionInput
//                 placeholder="e.g. ALS W/B"
//                 value={vehicleState.vehicleName || ""}
//                 onChange={(v) => updateVehicle({ vehicleName: v })}
//                 fieldType="vehicleName"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       <div>
//         <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>

//         <RadioGroup
//           value={driverType}
//           onValueChange={(v) => {
//             updateVehicle({ driverType: v });

//             setHasCoDriver("");
//             setCoDriverType("");
//             setCivilianRelative("");

//             const id = Date.now();
//             setOffenders([{ id, type: v }]);

//             if (scope === "traffic") {
//               dispatch({
//                 type: "SET_PATH",
//                 path: "formData.traffic.offenderPeople",
//                 value: [
//                   {
//                     id,
//                     type: v,
//                     details: {},
//                   },
//                 ],
//               });
//             }
//           }}
//           className="grid sm:grid-cols-2 gap-3"
//         >
//           {[
//             "Military Person",
//             "Civilian",
//             "Employee",
//             "Servant/Maid",
//             "Shop Keeper",
//             "Temporary Hired Worker",
//           ].map((item) => (
//             <label
//               key={item}
//               className={cn(
//                 "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
//                 driverType === item
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-300"
//               )}
//             >
//               <RadioGroupItem value={item} />
//               {item}
//             </label>
//           ))}
//         </RadioGroup>
//       </div>

//       {driverType && driverType !== "Civilian" && (
//         <>
//           {offenders.map((o, index) => (
//             <div key={o.id} className="border rounded-xl p-4 mt-4">
//               <OffenderDynamicForm
//                 scope={scope}
//                 title={`${o.type} Details`}
//                 fields={offenderFormsConfig[o.type!].fields}
//                 path={
//                   scope === "mp-main" || scope === "mp-additional"
//                     ? driverPath
//                     : `${driverPath}[${index}].details`
//                 }
//                 showCoDriver={index === 0}
//               />
//             </div>
//           ))}
//         </>
//       )}

//       {driverType === "Civilian" && (
//         <>
//           {(() => {
//             let index = coDriverIndex;

//             // ✅ ensure offender array me entry ho
//             if (index === null) {
//               index = state.formData.traffic.offenderPeople.length;
//               setCoDriverIndex(index);

//               dispatch({
//                 type: "PUSH_PATH",
//                 path: "formData.traffic.offenderPeople",
//                 value: {
//                   offenderType: "Civilian",
//                   role: "Co-Driver",
//                   details: {},
//                 },
//               });
//             }

//             return (
//               <OffenderDynamicForm
//                 title="Civilian Co-Driver Details"
//                 fields={offenderFormsConfig["Civilian"].fields}
//                 scope="traffic"
//                 path={`formData.traffic.offenderPeople[${index}].details`}
//                 showCoDriver={false}
//               />
//             );
//           })()}
//         </>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { cn } from "@/lib/utils";

type ScopeType = "traffic" | "static" | "mp-main" | "mp-additional";

interface VehicleDetailsFormProps {
  scope?: ScopeType;
}

export default function VehicleDetailsForm({
  scope = "traffic",
}: VehicleDetailsFormProps) {
  const { state, dispatch } = useForm();

  const traffic = state.formData.traffic;
  const staticSpeed = state.formData.staticSpeed;

  const [offenders, setOffenders] = useState<
    { id: number; type: string | null }[]
  >([]);

  const [coDriverIndex, setCoDriverIndex] = useState<number | null>(null);

  if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;

  const vehicleState =
    scope === "traffic"
      ? traffic?.vehicleDetails || {}
      : scope === "static"
      ? staticSpeed?.vehicleDetails || {}
      : {};

  const { category = "", vehicleType = "", driverType = "" } = vehicleState;

  /* ---------------- PATH RESOLVER ---------------- */
  const offenderPeoplePath =
    scope === "traffic"
      ? "formData.traffic.offenderPeople"
      : scope === "static"
      ? "formData.staticSpeed.offenderPeople"
      : "";

  const updateVehicle = (data: any) => {
    dispatch({
      type: "SET_PATH",
      path:
        scope === "traffic"
          ? "formData.traffic.vehicleDetails"
          : "formData.staticSpeed.vehicleDetails",
      value: { ...vehicleState, ...data },
    });
  };

  return (
    <div className="bg-white p-4 space-y-6">
      {/* ================= VEHICLE CATEGORY ================= */}
      <div>
        <p className="font-semibold mb-2">Select Vehicle Category</p>
        <RadioGroup
          value={category}
          onValueChange={(v) => updateVehicle({ category: v })}
          className="grid sm:grid-cols-2 gap-3"
        >
          {["2w", "4w"].map((v) => (
            <label
              key={v}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                category === v
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <RadioGroupItem value={v} />{" "}
              {v === "2w" ? "2-Wheeler" : "4-Wheeler"}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* ================= VEHICLE TYPE ================= */}
      <div>
        <p className="font-semibold mb-2">
          Which Type Of Vehicle Was Involved?
        </p>
        <RadioGroup
          value={vehicleType}
          onValueChange={(v) =>
            updateVehicle({
              vehicleType: v,
              vehicleNumber: "",
              vehicleName: "",
            })
          }
          className="grid sm:grid-cols-2 gap-3"
        >
          {["civilian", "dd"].map((v) => (
            <label
              key={v}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                vehicleType === v
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <RadioGroupItem value={v} />
              {v === "civilian" ? "Civilian Vehicle" : "DD Vehicle"}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* ================= VEHICLE DETAILS ================= */}
      {vehicleType && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Vehicle Number</Label>
            <SuggestionInput
              value={vehicleState.vehicleNumber || ""}
              onChange={(v) => updateVehicle({ vehicleNumber: v })}
              fieldType="vehicleNumber"
            />
          </div>

          <div>
            <Label>Make & Type</Label>
            <SuggestionInput
              value={vehicleState.vehicleName || ""}
              onChange={(v) => updateVehicle({ vehicleName: v })}
              fieldType="vehicleName"
            />
          </div>
        </div>
      )}

      {/* ================= DRIVER ================= */}
      <div>
        <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>
        <RadioGroup
          value={driverType}
          onValueChange={(v) => {
            updateVehicle({ driverType: v });

            const id = Date.now();
            setOffenders([{ id, type: v }]);

            if (offenderPeoplePath) {
              dispatch({
                type: "PUSH_PATH",
                path: offenderPeoplePath,
                value: {
                  id,
                  type: v,
                  details: {},
                },
              });
            }
          }}
          className="grid sm:grid-cols-2 gap-3"
        >
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
                driverType === item
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <RadioGroupItem value={item} /> {item}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* ================= DRIVER DETAILS FORM ================= */}
      {driverType &&
        offenders.map((o, index) => (
          <div key={o.id} className="border rounded-xl p-4 mt-4">
            <OffenderDynamicForm
              scope={scope}
              title={`${o.type} Details`}
              fields={offenderFormsConfig[o.type!].fields}
              path={`${offenderPeoplePath}[${index}].details`}
              showCoDriver={index === 0}
            />
          </div>
        ))}
    </div>
  );
}
