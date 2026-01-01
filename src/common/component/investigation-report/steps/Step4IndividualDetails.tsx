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

export default function Step4IndividualDetails() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport.individualDetails;
  const add = state.formData.mpReport.additionalIndividual;
  const offenders = mp.offenderList || [];

  const [showAddForm, setShowAddForm] = useState(false);

  const setVehicleInvolved = (value: "yes" | "no" | "") => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.vehicleInvolved",
      value,
    });
  };

  const handleDeleteOffender = (index: number) => {
    const updated = offenders.filter((_, i) => i !== index);

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.offenderList",
      value: updated,
    });
  };

  /* ================== MAIN SAVE ================== */
  const handleSaveMain = () => {
    // 🔥 Always read fresh value
    const person = state.formData.mpReport.individualDetails.tempOffender || {};

    console.log("🔥 MAIN PERSON =>", person);

    // 🔥 Strong validation
    if (
      !person ||
      typeof person !== "object" ||
      Object.keys(person).length === 0
    ) {
      toast.error("Please fill main offender details!");
      return;
    }

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.offenderList",
      value: [...offenders, { ...person }],
    });

    // 🔥 ALWAYS RESET TO {} (NOT null)
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.tempOffender",
      value: {},
    });

    toast.success("Main Person Added!");
  };

  /* ================== ADDITIONAL SAVE ================== */
  const handleSaveAdditional = () => {
    const person =
      state.formData.mpReport.additionalIndividual.tempOffender || {};

    console.log("🔥 ADDITIONAL PERSON =>", person);

    if (
      !person ||
      typeof person !== "object" ||
      Object.keys(person).length === 0
    ) {
      toast.error("Please fill additional person details!");
      return;
    }

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.offenderList",
      value: [...offenders, { ...person }],
    });

    // 🔥 RESET ALWAYS AS {} NOT null
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.additionalIndividual",
      value: {
        vehicleInvolved: "",
        vehicleData: {},
        driverType: "",
        tempOffender: {},
      },
    });

    setShowAddForm(false);
    toast.success("Additional Person Added!");
  };

  return (
    <FormSection title="">
      <p className="font-semibold">MP must verify personal particulars</p>
      <p className="text-sm text-gray-500">
        (To be read out to the Offender(s) by the MP…)
      </p>

      {/* MAIN */}
      <VehiclePrimaryQuestion
        title="Does this occurrence involve vehicles?"
        vehicleStatus={mp.vehicleInvolved as any}
        setVehicleStatus={setVehicleInvolved}
      />

      {mp.vehicleInvolved === "yes" && <VehicleDetailsForm scope="mp-main" />}

      {mp.vehicleInvolved === "no" && (
        <OffenderWithoutVehicleForm scope="mp-main" />
      )}

      {mp.vehicleInvolved && (
        <div className="mt-4 flex justify-end">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSaveMain}
          >
            Save Details
          </Button>
        </div>
      )}

      {/* ADDITIONAL FORM */}
      {showAddForm && (
        <div className="mt-6 border rounded-lg p-6 bg-gray-50">
          <VehiclePrimaryQuestion
            title="Does this additional person involve vehicle?"
            vehicleStatus={add.vehicleInvolved as any}
            setVehicleStatus={(v) =>
              dispatch({
                type: "SET_PATH",
                path: "formData.mpReport.additionalIndividual.vehicleInvolved",
                value: v,
              })
            }
          />

          {add.vehicleInvolved === "yes" && (
            <VehicleDetailsForm scope="mp-additional" />
          )}

          {add.vehicleInvolved === "no" && (
            <OffenderWithoutVehicleForm scope="mp-additional" />
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSaveAdditional}
            >
              Save Person
            </Button>
          </div>
        </div>
      )}

      {/* ADD MORE BUTTON ALWAYS BELOW */}
      <div className="mt-6">
        <Button
          className="bg-black text-white cursor-pointer"
          onClick={() => setShowAddForm(true)}
        >
          + Add More People
        </Button>
      </div>

      <DynamicOffenderList
        onDelete={handleDeleteOffender}
        data={offenders}
        title="Victim / Offender List"
      />
    </FormSection>
  );
}
