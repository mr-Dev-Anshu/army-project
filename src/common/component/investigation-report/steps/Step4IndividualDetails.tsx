


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

  /* ========= MAIN PERSON VEHICLE STATUS ========= */
  const setVehicleInvolved = (value: "yes" | "no" | "") => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.vehicleInvolved",
      value,
    });
  };

  /* ========= DELETE OFFENDER ========= */
  const handleDeleteOffender = (index: number) => {
    const updated = offenders.filter((_, i) => i !== index);

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.offenderList",
      value: updated,
    });
  };

 const handleSaveMain = () => {
  const person = mp.tempOffender || {};

  if (!Object.keys(person).length) {
    toast.error("Please fill main offender details!");
    return;
  }

  dispatch({
    type: "SET_PATH",
    path: "formData.mpReport.individualDetails.offenderList",
    value: [...offenders, person],
  });

  // clear after save
  dispatch({
    type: "SET_PATH",
    path: "formData.mpReport.individualDetails.tempOffender",
    value: {},
  });

  toast.success("Main Person Added!");
};


 const handleSaveAdditional = () => {
  const person = add.tempOffender || {};

  if (!Object.keys(person).length) {
    toast.error("Please fill additional person details!");
    return;
  }

  dispatch({
    type: "SET_PATH",
    path: "formData.mpReport.individualDetails.offenderList",
    value: [...offenders, person],
  });

  dispatch({
    type: "SET_PATH",
    path: "formData.mpReport.additionalIndividual",
    value: {
      vehicleInvolved: "",
      vehicleData: {},
      driverType: "",
      tempOffender: null,
    },
  });

  setShowAddForm(false);
  toast.success("Additional Person Added!");
};

  return (
    <FormSection title="4. DETAILS OF INDIVIDUAL:">
      <p className="font-semibold">MP must verify personal particulars</p>
      <p className="text-sm text-gray-500">
        (To be read out to the Offender(s) by the MP…)
      </p>

      {/* MAIN PERSON */}
      <VehiclePrimaryQuestion
        title="Does this occurrence involve vehicles?"
        vehicleStatus={mp.vehicleInvolved as any}
        setVehicleStatus={setVehicleInvolved}
      />

      {mp.vehicleInvolved === "yes" && (
        <VehicleDetailsForm scope="mp-additional" />
      )}

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

      {/* ADD MORE PEOPLE */}
      <div className="mt-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          + Add More People
        </Button>
      </div>

      {/* ADDITIONAL PERSON FORM */}
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
            <VehicleDetailsForm scope="mp-main" />
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

      <DynamicOffenderList
        onDelete={handleDeleteOffender}
        data={offenders}
        title="Victim / Offender List"
      />
    </FormSection>
  );
}
