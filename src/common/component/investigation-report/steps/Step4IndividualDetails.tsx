// "use client";

// import { FormSection } from "@/common/component/FormSection";
// import { useForm } from "@/context/FormContext";
// import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
// import OffenderWithoutVehicleForm from "@/common/component/OffenderWithoutVehicleForm";
// import VehiclePrimaryQuestion from "@/common/component/VehiclePrimaryQuestion";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";
// import DynamicOffenderList from "../../DynamicOffenderLIst";

// export default function Step4IndividualDetails() {
//   const { state, dispatch } = useForm();

//   const mp = state.formData.mpReport.individualDetails;
//   const add = state.formData.mpReport.additionalIndividual;

//   const offenders = mp.offenderList || [];

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [extraVehicleStatus, setExtraVehicleStatus] = useState<"" | "yes" | "no">("");

//   /* ================= NORMALIZE VEHICLE ================= */
//   const normalizeVehicle = (v: any): "yes" | "no" | "" => {
//     if (v === "vehicle" || v === "yes") return "yes";
//     if (v === "noVehicle" || v === "no") return "no";
//     return "";
//   };

//   /* ================= MAIN VEHICLE ================= */
//   const setVehicleInvolved = (value: any) => {
//     dispatch({
//       type: "SET_PATH",
//       path: "formData.mpReport.individualDetails.vehicleInvolved",
//       value: normalizeVehicle(value),
//     });
//   };

//   /* ================= SAVE MAIN ================= */
//   const handleSaveMain = () => {
//     let temp: any = null;

//     if (mp.vehicleInvolved === "no") {
//       if (!mp.tempOffender?.details) {
//         toast.error("Please fill main offender details!");
//         return;
//       }

//       temp = {
//         offenderType: mp.tempOffender.offenderType,
//         details: structuredClone(mp.tempOffender.details),
//       };
//     }

//     if (mp.vehicleInvolved === "yes") {
//       if (!mp.vehicleData?.driverType) {
//         toast.error("Please fill main offender details!");
//         return;
//       }

//       temp = {
//         offenderType: mp.vehicleData.driverType,
//         details: structuredClone(mp.vehicleData),
//       };
//     }

//     if (!temp || !Object.keys(temp.details).length) {
//       toast.error("Please fill main offender details!");
//       return;
//     }

//     dispatch({
//       type: "SET_PATH",
//       path: "formData.mpReport.individualDetails.offenderList",
//       value: [...offenders, temp],
//     });

//     dispatch({
//       type: "SET_PATH",
//       path: "formData.mpReport.individualDetails.tempOffender",
//       value: {},
//     });

//     toast.success("Main Person Added!");
//   };

//   /* ================= DELETE ================= */
//   const handleDeleteOffender = (index: number) => {
//     dispatch({
//       type: "SET_PATH",
//       path: "formData.mpReport.individualDetails.offenderList",
//       value: offenders.filter((_, i) => i !== index),
//     });

//     toast.success("Person removed");
//   };

//   /* ================= SAVE ADDITIONAL ================= */
//   const handleSaveAdditional = () => {
//     let temp: any = null;

//     if (add.vehicleInvolved === "no") {
//       if (!add.tempOffender?.details) {
//         toast.error("Please fill additional person details!");
//         return;
//       }

//       temp = {
//         offenderType: add.tempOffender.offenderType,
//         details: structuredClone(add.tempOffender.details),
//       };
//     }

//     if (add.vehicleInvolved === "yes") {
//       if (!add.vehicleData?.driverType) {
//         toast.error("Please fill additional person details!");
//         return;
//       }

//       temp = {
//         offenderType: add.vehicleData.driverType,
//         details: structuredClone(add.vehicleData),
//       };
//     }

//     if (!temp || !Object.keys(temp.details).length) {
//       toast.error("Please fill additional person details!");
//       return;
//     }

//     dispatch({
//       type: "SET_PATH",
//       path: "formData.mpReport.individualDetails.offenderList",
//       value: [...offenders, temp],
//     });

//     /* 🔥 CRITICAL RESET (UNLIMITED ADD FIX) */
//     dispatch({ type: "CLEAR_MP_ADDITIONAL" });
//     setExtraVehicleStatus("");
//     setShowAddForm(false);

//     toast.success("Additional Person Added!");
//   };

//   return (
//     <FormSection title="">
//       <VehiclePrimaryQuestion
//         title="Does this occurrence involve vehicles?"
//         vehicleStatus={mp.vehicleInvolved}
//         setVehicleStatus={setVehicleInvolved}
//       />

//       {mp.vehicleInvolved === "yes" && <VehicleDetailsForm scope="mp-main" />}
//       {mp.vehicleInvolved === "no" && (
//         <OffenderWithoutVehicleForm scope="mp-main" />
//       )}

//       {mp.vehicleInvolved && (
//         <div className="mt-4 flex justify-end">
//           <Button onClick={handleSaveMain}>Save Details</Button>
//         </div>
//       )}

//       {/* ================= ADDITIONAL PERSON ================= */}
//       {showAddForm && (
//         <div className="mt-6 border rounded-lg p-6 bg-gray-50">
//           <VehiclePrimaryQuestion
//             title="Does this additional person involve vehicle?"
//             vehicleStatus={extraVehicleStatus}
//             setVehicleStatus={(v) => {
//               const norm = normalizeVehicle(v);
//               setExtraVehicleStatus(norm);

//               dispatch({
//                 type: "SET_PATH",
//                 path: "formData.mpReport.additionalIndividual.vehicleInvolved",
//                 value: norm,
//               });
//             }}
//           />

//           {extraVehicleStatus === "yes" && (
//             <VehicleDetailsForm scope="mp-additional" />
//           )}

//           {extraVehicleStatus === "no" && (
//             <OffenderWithoutVehicleForm scope="mp-additional" />
//           )}

//           <div className="mt-4 flex justify-end gap-3">
//             <Button variant="outline" onClick={() => setShowAddForm(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveAdditional}>Save Person</Button>
//           </div>
//         </div>
//       )}

//       <div className="mt-6">
//         <Button
//           onClick={() => {
//             dispatch({ type: "CLEAR_MP_ADDITIONAL" });
//             setExtraVehicleStatus("");
//             setShowAddForm(true);
//           }}
//         >
//           + Add More People
//         </Button>
//       </div>

//       <DynamicOffenderList onDelete={handleDeleteOffender} data={offenders} />
//     </FormSection>
//   );
// }




"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
import OffenderWithoutVehicleForm from "@/common/component/OffenderWithoutVehicleForm";
import VehiclePrimaryQuestion from "@/common/component/VehiclePrimaryQuestion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import DynamicOffenderList from "../../DynamicOffenderLIst";

type YesNo = "yes" | "no" | "";

export default function Step4IndividualDetails() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport.individualDetails;
  const offenders = mp.offenderList || [];

  /* ================= LOCAL STATE ================= */
  const [additionalForms, setAdditionalForms] = useState<number[]>([]);
  const [extraVehicleMap, setExtraVehicleMap] = useState<Record<number, YesNo>>(
    {}
  );

  /* ================= HELPERS ================= */
  const normalizeVehicle = (v: any): YesNo => {
    if (v === "vehicle" || v === "yes") return "yes";
    if (v === "noVehicle" || v === "no") return "no";
    return "";
  };

  /* ================= MAIN VEHICLE ================= */
  const setVehicleInvolved = (value: any) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.vehicleInvolved",
      value: normalizeVehicle(value),
    });
  };

  /* ================= SAVE MAIN ================= */
  const handleSaveMain = () => {
    let temp: any = null;

    if (mp.vehicleInvolved === "no") {
      if (!mp.tempOffender?.details) {
        toast.error("Please fill main offender details!");
        return;
      }

      temp = {
        offenderType: mp.tempOffender.offenderType,
        details: structuredClone(mp.tempOffender.details),
      };
    }

    if (mp.vehicleInvolved === "yes") {
      if (!mp.vehicleData?.driverType) {
        toast.error("Please fill main offender details!");
        return;
      }

      temp = {
        offenderType: mp.vehicleData.driverType,
        details: structuredClone(mp.vehicleData),
      };
    }

    if (!temp || !Object.keys(temp.details).length) {
      toast.error("Please fill main offender details!");
      return;
    }

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.offenderList",
      value: [...offenders, temp],
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.tempOffender",
      value: {},
    });

    toast.success("Main Person Added!");
  };

  /* ================= DELETE ================= */
  const handleDeleteOffender = (index: number) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.offenderList",
      value: offenders.filter((_, i) => i !== index),
    });

    toast.success("Person removed");
  };

  /* ================= SAVE ADDITIONAL ================= */
  /* ================= SAVE ADDITIONAL ================= */
  const handleSaveAdditional = (formId: number) => {
    // Helper to get deep value
    const getValue = (obj: any, path: string) =>
      path.split(".").reduce((o, k) => (o || {})[k], obj);

    // Read unique local state
    const uniquePath = `formData.mpReport.additionalIndividual.tempList.${formId}`;
    const add = getValue(state, uniquePath);

    if (!add) {
      toast.error("Form data not found!");
      return;
    }

    let temp: any = null;

    if (add.vehicleInvolved === "no") {
      if (!add.tempOffender?.details) {
        toast.error("Please fill additional person details!");
        return;
      }

      temp = {
        offenderType: add.tempOffender.offenderType,
        details: structuredClone(add.tempOffender.details),
      };
    }

    if (add.vehicleInvolved === "yes") {
      if (!add.vehicleData?.driverType) {
        toast.error("Please fill additional person details!");
        return;
      }

      temp = {
        offenderType: add.vehicleData.driverType,
        details: structuredClone(add.vehicleData),
      };
    }

    if (!temp || !Object.keys(temp.details).length) {
      toast.error("Please fill additional person details!");
      return;
    }

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.offenderList",
      value: [...offenders, temp],
    });

    /* 🔒 remove only this form */
    setAdditionalForms((prev) => prev.filter((id) => id !== formId));

    // Cleanup temporary state
    dispatch({
      type: "SET_PATH",
      path: uniquePath,
      value: undefined
    });

    toast.success("Additional Person Added!");
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="font-semibold text-lg text-gray-900 mb-2">
          MP must verify personal particulars
        </p>
        <p className="text-gray-500 text-sm leading-relaxed">
          (To be read out to the Offender(s) by the MP above recorded personal
          particulars have been given by me voluntarily and I certify and sign
          them as correct. If found otherwise. I am liable for disciplinary
          action under the Army Act&apos;)
        </p>
      </div>
      {/* ================= MAIN PERSON ================= */}
      <VehiclePrimaryQuestion
        title="Does this occurrence involve vehicles?"
        vehicleStatus={mp.vehicleInvolved}
        setVehicleStatus={setVehicleInvolved}
      />

      {mp.vehicleInvolved === "yes" && <VehicleDetailsForm scope="mp-main" />}
      {mp.vehicleInvolved === "no" && (
        <OffenderWithoutVehicleForm scope="mp-main" />
      )}

      {mp.vehicleInvolved && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveMain}>Save Details</Button>
        </div>
      )}

      {/* ================= ADDITIONAL PERSON FORMS ================= */}
      {additionalForms.map((id, index) => {
        // Unique state location for this form instance
        const rootPath = `formData.mpReport.additionalIndividual.tempList.${id}`;

        return (
          <div key={id} className="mt-6 border rounded-lg p-6 bg-gray-50">
            <VehiclePrimaryQuestion
              title={`Additional Person ${index + 1}`}
              vehicleStatus={extraVehicleMap[id] || ""}
              setVehicleStatus={(v) => {
                const norm = normalizeVehicle(v);

                setExtraVehicleMap((prev) => ({
                  ...prev,
                  [id]: norm,
                }));

                const finalPath = `${rootPath}.vehicleInvolved`;
                dispatch({
                  type: "SET_PATH",
                  path: finalPath,
                  value: norm,
                });
              }}
            />

            {extraVehicleMap[id] === "yes" && (
              <VehicleDetailsForm scope="mp-additional" rootPath={rootPath} />
            )}

            {extraVehicleMap[id] === "no" && (
              <OffenderWithoutVehicleForm
                scope="mp-additional"
                rootPath={rootPath}
              />
            )}

            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  setAdditionalForms((prev) => prev.filter((x) => x !== id))
                }
              >
                Cancel
              </Button>
              <Button onClick={() => handleSaveAdditional(id)}>
                Save Person
              </Button>
            </div>
          </div>
        );
      })}

      {/* ================= ADD BUTTON ================= */}
      <div className="mt-6">
        <Button
          onClick={() =>
            setAdditionalForms((prev) => [...prev, Date.now()])
          }
        >
          + Add More People
        </Button>
      </div>

      {/* ================= LIST ================= */}
      <DynamicOffenderList
        onDelete={handleDeleteOffender}
        data={offenders}
      />
    </div>
  );
}

