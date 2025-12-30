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

//   if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;

//   const vehicleState =
//     scope === "traffic"
//       ? traffic.vehicleDetails
//       : scope === "static"
//       ? staticSpeed.vehicleDetails
//       : scope === "mp-main"
//       ? state.formData.mpReport.individualDetails.vehicleData || {}
//       : scope === "mp-additional"
//       ? state.formData.mpReport.additionalIndividual.vehicleData || {}
//       : {};

//   const { category = "", vehicleType = "", driverType = "" } = vehicleState;

//   /* ================= UPDATE VEHICLE ================= */
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

//   /* ================= LOCAL ================= */
//   const [hasCoDriver, setHasCoDriver] = useState("");
//   const [coDriverType, setCoDriverType] = useState("");
//   const [civilianRelative, setCivilianRelative] = useState("");

//   /* ================= DYNAMIC PATHS ================= */
//   const driverPath =
//     scope === "traffic"
//       ? "formData.traffic.vehicleDetails.driver"
//       : scope === "static"
//       ? "formData.staticSpeed.vehicleDetails.driver"
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
//     <div className="border rounded-lg bg-white p-4 space-y-6">
//       {/* CATEGORY */}
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

//       {/* VEHICLE TYPE */}
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

//       {/* CIVILIAN */}
//       {vehicleType === "civilian" && (
//         <div>
//           <p className="font-semibold mb-2">Fill Vehicle Identification</p>
//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <Label className="mb-3">Civil Vehicle Registration Number</Label>
//               <SuggestionInput
//                 placeholder="e.g. MP04 AB 1234"
//                 value={vehicleState.vehicleNumber || ""}
//                 onChange={(v) => updateVehicle({ vehicleNumber: v })}
//                 fieldType="vehicleNumber"
//               />
//             </div>

//             <div>
//               <Label className="mb-3">
//                 Make & Type{" "}
//                 <span className="text-gray-500">(Vehicle Name)</span>
//               </Label>
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

//       {/* DD VEHICLE */}
//       {vehicleType === "dd" && (
//         <div>
//           <p className="font-semibold mb-2">Fill Vehicle Identification</p>

//           <div className="grid sm:grid-cols-2 gap-4">
//             <div>
//               <Label className="mb-3">DD Vehicle BA Number</Label>
//               <SuggestionInput
//                 placeholder="e.g. 12A 345678Z"
//                 value={vehicleState.vehicleNumber || ""}
//                 onChange={(v) => updateVehicle({ vehicleNumber: v })}
//                 fieldType="vehicleNumber"
//               />
//             </div>

//             <div>
//               <Label className="mb-3">
//                 Make & Type{" "}
//                 <span className="text-gray-500">(Vehicle Name)</span>
//               </Label>
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

//       {/* DRIVER TYPE */}
//       <div>
//         <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>

//         <RadioGroup
//           value={driverType}
//           onValueChange={(v) => {
//             updateVehicle({ driverType: v });
//             setHasCoDriver("");
//             setCoDriverType("");
//             setCivilianRelative("");
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

//       {/* NON CIVILIAN */}
//       {driverType && driverType !== "Civilian" && (
//         <>
//           <OffenderDynamicForm
//             scope={scope}
//             title={offenderFormsConfig[driverType].title}
//             fields={offenderFormsConfig[driverType].fields}
//             showCoDriver={false}
//             path={driverPath}
//           />

//           <p className="font-semibold flex items-center gap-3">
//             <Checkbox
//               checked={hasCoDriver === "yes"}
//               onCheckedChange={(checked) =>
//                 setHasCoDriver(checked ? "yes" : "no")
//               }
//               className="w-5 h-5"
//             />
//             Any Co-Driver / Pillion?
//           </p>

//           {hasCoDriver === "yes" && (
//             <>
//               <p className="font-semibold">Who was Co-Driver / Pillion?</p>

//               <RadioGroup
//                 value={coDriverType}
//                 onValueChange={setCoDriverType}
//                 className="grid sm:grid-cols-2 gap-3"
//               >
//                 {Object.keys(offenderFormsConfig).map((i) => (
//                   <label
//                     key={i}
//                     className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
//                   >
//                     <RadioGroupItem value={i} />
//                     {i}
//                   </label>
//                 ))}
//               </RadioGroup>

//               {coDriverType && (
//                 <OffenderDynamicForm
//                   scope={scope}
//                   title={offenderFormsConfig[coDriverType].title}
//                   helperText="Co-Driver Details"
//                   fields={offenderFormsConfig[coDriverType].fields}
//                   showCoDriver={false}
//                   path={coDriverPath}
//                 />
//               )}
//             </>
//           )}
//         </>
//       )}

//       {/* CIVILIAN */}
//       {driverType === "Civilian" && (
//         <>
//           <OffenderDynamicForm
//             scope={scope}
//             title="Civilian Details"
//             fields={offenderFormsConfig["Civilian"].fields}
//             showCoDriver={false}
//             path={driverPath}
//           />

//           {/* CHECKBOX */}
//           <p className="font-semibold mt-4 flex items-center gap-3">
//             <Checkbox
//               checked={civilianRelative === "yes"}
//               onCheckedChange={(checked) =>
//                 setCivilianRelative(checked ? "yes" : "")
//               }
//               className="w-5 h-5"
//             />
//             Civilian has Military Relative?
//           </p>

//           {civilianRelative === "yes" && (
//             <>
//               {/* STEP 2 — RELATION (OPTIONAL INPUT) */}
//               <p className="font-semibold mt-3">
//                 Enter Relation of Military Person
//               </p>

//               <SuggestionInput
//                 placeholder="e.g. Father / Husband / Brother "
//                 value={coDriverType}
//                 onChange={setCoDriverType}
//                 fieldType="relation"
//               />

//               {/* STEP 3 — CATEGORY OPTIONS (ALWAYS SHOW AFTER YES) */}
//               <p className="font-semibold mt-4">Select Military Person Type</p>

//               <RadioGroup
//                 onValueChange={setHasCoDriver}
//                 value={hasCoDriver}
//                 className="grid sm:grid-cols-2 gap-3"
//               >
//                 {[
//                   "Military Person",
//                   "Employee",
//                   "Servant/Maid",
//                   "Shop Keeper",
//                   "Temporary Hired Worker",
//                 ].map((item) => (
//                   <label
//                     key={item}
//                     className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
//                   >
//                     <RadioGroupItem value={item} />
//                     {item}
//                   </label>
//                 ))}
//               </RadioGroup>

//               {/* FINAL FORM */}
//               {hasCoDriver && (
//                 <OffenderDynamicForm
//                   scope={scope}
//                   title={`${hasCoDriver} Details`}
//                   helperText={coDriverType ? `Relation: ${coDriverType}` : ""}
//                   fields={offenderFormsConfig[hasCoDriver].fields}
//                   showCoDriver={false}
//                   path={coDriverPath}
//                 />
//               )}
//             </>
//           )}
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
import { Checkbox } from "@/components/ui/checkbox";

type ScopeType = "traffic" | "static" | "mp-main" | "mp-additional";

interface VehicleDetailsFormProps {
  scope?: ScopeType;
}

export default function VehicleDetailsForm({ scope = "traffic" }: VehicleDetailsFormProps) {
  const { state, dispatch } = useForm();

  const traffic = state.formData.traffic;
  const staticSpeed = state.formData.staticSpeed;

  if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;

  const vehicleState =
    scope === "traffic"
      ? traffic.vehicleDetails
      : scope === "static"
      ? staticSpeed.vehicleDetails
      : scope === "mp-main"
      ? state.formData.mpReport.individualDetails.vehicleData || {}
      : scope === "mp-additional"
      ? state.formData.mpReport.additionalIndividual.vehicleData || {}
      : {};

  const { category = "", vehicleType = "", driverType = "" } = vehicleState;

  const updateVehicle = (data: any) => {
    const updated = { ...vehicleState, ...data };

    dispatch({
      type: "SET_PATH",
      path:
        scope === "traffic"
          ? "formData.traffic.vehicleDetails"
          : scope === "static"
          ? "formData.staticSpeed.vehicleDetails"
          : scope === "mp-main"
          ? "formData.mpReport.individualDetails.vehicleData"
          : "formData.mpReport.additionalIndividual.vehicleData",
      value: updated,
    });
  };

  const [hasCoDriver, setHasCoDriver] = useState("");
  const [coDriverType, setCoDriverType] = useState("");
  const [civilianRelative, setCivilianRelative] = useState("");

  const driverPath =
    scope === "traffic"
      ? "formData.traffic.vehicleDetails.driver"
      : scope === "static"
      ? "formData.staticSpeed.vehicleDetails.driver"
      : scope === "mp-main"
      ? "formData.mpReport.individualDetails.tempOffender"
      : "formData.mpReport.additionalIndividual.tempOffender";

  const coDriverPath =
    scope === "traffic"
      ? "formData.traffic.vehicleDetails.coDriver"
      : scope === "static"
      ? "formData.staticSpeed.vehicleDetails.coDriver"
      : scope === "mp-main"
      ? "formData.mpReport.individualDetails.tempOffender"
      : "formData.mpReport.additionalIndividual.tempOffender";

  return (
    <div className="border rounded-xl bg-white p-3 sm:p-4 md:p-5 space-y-5 sm:space-y-6 md:space-y-7">

      {/* CATEGORY */}
      <div>
        <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
          Select Vehicle Category
        </p>

        <RadioGroup
          value={category}
          onValueChange={(v) => updateVehicle({ category: v })}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4"
        >
          {[
            { label: "2-Wheeler", value: "2w" },
            { label: "4-Wheeler", value: "4w" },
          ].map((i) => (
            <label
              key={i.value}
              className={cn(
                "border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base flex gap-2 cursor-pointer",
                category === i.value ? "border-blue-500 bg-blue-50" : "border-gray-300"
              )}
            >
              <RadioGroupItem value={i.value} />
              {i.label}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* VEHICLE TYPE */}
      <div>
        <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
          Which Type Of Vehicle Was Involved?
        </p>

        <RadioGroup
          value={vehicleType}
          onValueChange={(v) =>
            updateVehicle({ vehicleType: v, vehicleNumber: "", vehicleName: "" })
          }
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4"
        >
          {[
            { label: "Civilian Vehicle", value: "civilian" },
            { label: "DD Vehicle", value: "dd" },
          ].map((i) => (
            <label
              key={i.value}
              className={cn(
                "border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base flex gap-2 cursor-pointer",
                vehicleType === i.value ? "border-blue-500 bg-blue-50" : "border-gray-300"
              )}
            >
              <RadioGroupItem value={i.value} />
              {i.label}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* CIVILIAN VEHICLE */}
      {vehicleType === "civilian" && (
        <div>
          <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
            Fill Vehicle Identification
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <Label className="text-xs sm:text-sm md:text-base">
                Civil Vehicle Registration Number
              </Label>
              <SuggestionInput
                placeholder="e.g. MP04 AB 1234"
                value={vehicleState.vehicleNumber || ""}
                onChange={(v) => updateVehicle({ vehicleNumber: v })}
                fieldType="vehicleNumber"
              />
            </div>

            <div>
              <Label className="text-xs sm:text-sm md:text-base">
                Make & Type <span className="text-gray-500">(Vehicle Name)</span>
              </Label>
              <SuggestionInput
                placeholder="e.g. Honda CB Hornet"
                value={vehicleState.vehicleName || ""}
                onChange={(v) => updateVehicle({ vehicleName: v })}
                fieldType="vehicleName"
              />
            </div>
          </div>
        </div>
      )}

      {/* DD VEHICLE */}
      {vehicleType === "dd" && (
        <div>
          <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
            Fill Vehicle Identification
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <Label className="text-xs sm:text-sm md:text-base">
                DD Vehicle BA Number
              </Label>
              <SuggestionInput
                placeholder="e.g. 12A 345678Z"
                value={vehicleState.vehicleNumber || ""}
                onChange={(v) => updateVehicle({ vehicleNumber: v })}
                fieldType="vehicleNumber"
              />
            </div>

            <div>
              <Label className="text-xs sm:text-sm md:text-base">
                Make & Type <span className="text-gray-500">(Vehicle Name)</span>
              </Label>
              <SuggestionInput
                placeholder="e.g. ALS W/B"
                value={vehicleState.vehicleName || ""}
                onChange={(v) => updateVehicle({ vehicleName: v })}
                fieldType="vehicleName"
              />
            </div>
          </div>
        </div>
      )}

      {/* DRIVER TYPE */}
      <div>
        <p className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
          Select Who was the Driver/Rider?
        </p>

        <RadioGroup
          value={driverType}
          onValueChange={(v) => {
            updateVehicle({ driverType: v });
            setHasCoDriver("");
            setCoDriverType("");
            setCivilianRelative("");
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4"
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
                "border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base flex gap-2 cursor-pointer",
                driverType === item ? "border-blue-500 bg-blue-50" : "border-gray-300"
              )}
            >
              <RadioGroupItem value={item} />
              {item}
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
