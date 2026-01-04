// "use client";

// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
// import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
// import { useForm } from "@/context/FormContext";
// import { SuggestionInput } from "@/common/component/SuggestionInput";
// import { cn } from "@/lib/utils";

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
//   const mpMain = state.formData.mpReport.individualDetails;
//   const mpAdd = state.formData.mpReport.additionalIndividual;

//   /* ================= GUARD ================= */
//   if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;
//   if (scope === "static" && staticSpeed.vehicleInvolved !== "yes") return null;
//   if (scope === "mp-main" && mpMain.vehicleInvolved !== "yes") return null;
//   if (scope === "mp-additional" && mpAdd.vehicleInvolved !== "yes") return null;

//   /* ================= VEHICLE STATE ================= */
//   const vehicleState =
//     scope === "traffic"
//       ? traffic.vehicleDetails
//       : scope === "static"
//       ? staticSpeed.vehicleDetails
//       : scope === "mp-main"
//       ? mpMain.vehicleData
//       : mpAdd.vehicleData;

//   const category = vehicleState?.category || "";
//   const vehicleType = vehicleState?.vehicleType || "";
//   const driverType = vehicleState?.driverType || "";

//   const vehiclePath =
//     scope === "traffic"
//       ? "formData.traffic.vehicleDetails"
//       : scope === "static"
//       ? "formData.staticSpeed.vehicleDetails"
//       : scope === "mp-main"
//       ? "formData.mpReport.individualDetails.vehicleData"
//       : "formData.mpReport.additionalIndividual.vehicleData";

//   /* ================= UPDATE VEHICLE ================= */
//   const updateVehicle = (data: any) => {
//     dispatch({
//       type: "SET_PATH",
//       path: vehiclePath,
//       value: { ...(vehicleState || {}), ...data },
//     });
//   };

//   return (
//     <div className="bg-white p-4 space-y-6">
//       {/* VEHICLE CATEGORY */}
//       <div>
//         <p className="font-semibold mb-2">Select Vehicle Category</p>
//         <RadioGroup
//           value={category}
//           onValueChange={(v) => updateVehicle({ category: v })}
//           className="grid sm:grid-cols-2 gap-3"
//         >
//           {["2w", "4w"].map((v) => (
//             <label
//               key={v}
//               className={cn(
//                 "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
//                 category === v
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-300"
//               )}
//             >
//               <RadioGroupItem value={v} />
//               {v === "2w" ? "2-Wheeler" : "4-Wheeler"}
//             </label>
//           ))}
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
//           {["civilian", "dd"].map((v) => (
//             <label
//               key={v}
//               className={cn(
//                 "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
//                 vehicleType === v
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-300"
//               )}
//             >
//               <RadioGroupItem value={v} />
//               {v === "civilian" ? "Civilian Vehicle" : "DD Vehicle"}
//             </label>
//           ))}
//         </RadioGroup>
//       </div>

//       {/* VEHICLE DETAILS */}
//       {vehicleType && (
//         <div className="grid sm:grid-cols-2 gap-4">
//           <div>
//             <Label>Vehicle Number</Label>
//             <SuggestionInput
//               value={vehicleState?.vehicleNumber || ""}
//               onChange={(v) => updateVehicle({ vehicleNumber: v })}
//               fieldType="vehicleNumber"
//             />
//           </div>

//           <div>
//             <Label>Make & Type</Label>
//             <SuggestionInput
//               value={vehicleState?.vehicleName || ""}
//               onChange={(v) => updateVehicle({ vehicleName: v })}
//               fieldType="vehicleName"
//             />
//           </div>
//         </div>
//       )}

//       {/* 🔥 DRIVER / RIDER (ALL FLOWS – INCLUDING MP) */}
//       <div>
//         <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>
//         <RadioGroup
//           value={driverType}
//           onValueChange={(v) => {
//             updateVehicle({ driverType: v });
//           }}
//           className="grid sm:grid-cols-2 gap-3"
//         >
//           {Object.keys(offenderFormsConfig).map((item) => (
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

//       {/* 🔥 OFFENDER DETAILS (ALL FLOWS) */}
//       {driverType && (
//         <div className="border rounded-xl p-4 mt-4">
//           <OffenderDynamicForm
//             scope={scope}
//             title={`${driverType} Details`}
//             fields={offenderFormsConfig[driverType].fields}
//             path={`${vehiclePath}`}
//             showCoDriver={scope === "traffic" || scope === "static"}
//           />
//         </div>
//       )}
//     </div>
//   );
// }





"use client";

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
  const mpMain = state.formData.mpReport.individualDetails;
  const mpAdd = state.formData.mpReport.additionalIndividual;

  /* ================= GUARD ================= */
  if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;
  if (scope === "static" && staticSpeed.vehicleInvolved !== "yes") return null;
  if (scope === "mp-main" && mpMain.vehicleInvolved !== "yes") return null;
  if (scope === "mp-additional" && mpAdd.vehicleInvolved !== "yes") return null;

  /* ================= VEHICLE STATE ================= */
  const vehicleState =
    scope === "traffic"
      ? traffic.vehicleDetails
      : scope === "static"
      ? staticSpeed.vehicleDetails
      : scope === "mp-main"
      ? mpMain.vehicleData
      : mpAdd.vehicleData;

  const category = vehicleState?.category || "";
  const vehicleType = vehicleState?.vehicleType || "";
  const driverType = vehicleState?.driverType || "";

  const vehiclePath =
    scope === "traffic"
      ? "formData.traffic.vehicleDetails"
      : scope === "static"
      ? "formData.staticSpeed.vehicleDetails"
      : scope === "mp-main"
      ? "formData.mpReport.individualDetails.vehicleData"
      : "formData.mpReport.additionalIndividual.vehicleData";

  /* ================= UPDATE VEHICLE ================= */
  const updateVehicle = (data: any) => {
    dispatch({
      type: "SET_PATH",
      path: vehiclePath,
      value: { ...(vehicleState || {}), ...data },
    });
  };

  /* ================= ENSURE MAIN OFFENDER SLOT ================= */
  const ensureMainOffender = (type: string) => {
    if (scope !== "traffic" && scope !== "static") return;

    const peoplePath =
      scope === "traffic"
        ? "formData.traffic.offenderPeople"
        : "formData.staticSpeed.offenderPeople";

    const list =
      scope === "traffic"
        ? traffic.offenderPeople
        : staticSpeed.offenderPeople;

    if (!list || list.length === 0) {
      dispatch({
        type: "SET_PATH",
        path: peoplePath,
        value: [{ type, whoIsIt: "Driver", details: {} }],
      });
    } else {
      dispatch({
        type: "SET_PATH",
        path: `${peoplePath}[0].type`,
        value: type,
      });
    }
  };

  return (
    <div className="bg-white p-4 space-y-6">
      {/* VEHICLE CATEGORY */}
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
              <RadioGroupItem value={v} />
              {v === "2w" ? "2-Wheeler" : "4-Wheeler"}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* VEHICLE TYPE */}
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

      {/* VEHICLE DETAILS */}
      {vehicleType && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Vehicle Number</Label>
            <SuggestionInput
              value={vehicleState?.vehicleNumber || ""}
              onChange={(v) => updateVehicle({ vehicleNumber: v })}
              fieldType="vehicleNumber"
            />
          </div>

          <div>
            <Label>Make & Type</Label>
            <SuggestionInput
              value={vehicleState?.vehicleName || ""}
              onChange={(v) => updateVehicle({ vehicleName: v })}
              fieldType="vehicleName"
            />
          </div>
        </div>
      )}

      {/* DRIVER / RIDER */}
      <div>
        <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>
        <RadioGroup
          value={driverType}
          onValueChange={(v) => {
            updateVehicle({ driverType: v });
            ensureMainOffender(v);
          }}
          className="grid sm:grid-cols-2 gap-3"
        >
          {Object.keys(offenderFormsConfig).map((item) => (
            <label
              key={item}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                driverType === item
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

      {/* OFFENDER DETAILS */}
      {driverType && (
        <div className="border rounded-xl p-4 mt-4">
          <OffenderDynamicForm
            scope={scope}
            title={`${driverType} Details`}
            fields={offenderFormsConfig[driverType].fields}
            path={
              scope === "traffic"
                ? "formData.traffic.offenderPeople[0].details"
                : scope === "static"
                ? "formData.staticSpeed.offenderPeople[0].details"
                : scope === "mp-main"
                ? "formData.mpReport.individualDetails.offenderList[0].details"
                : "formData.mpReport.additionalIndividual.tempOffender.details"
            }
            showCoDriver={scope === "traffic" || scope === "static"}
          />
        </div>
      )}
    </div>
  );
}
