
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

  const offenders =
    state.formData.mpReport.individualDetails.offenderList || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [extraVehicleStatus, setExtraVehicleStatus] = useState("");

  /* ========= VEHICLE STATUS ========= */
  const setVehicleInvolved = (value: any) => {
    const normalized =
      value === "vehicle" || value === "yes"
        ? "yes"
        : value === "noVehicle" || value === "no"
        ? "no"
        : "";

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.vehicleInvolved",
      value: normalized,
    });

    if (value === "yes") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.individualDetails.vehicleData",
        value: {},
      });
    }
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
  const temp = state.formData.mpReport.individualDetails.tempOffender;

  if (!temp || Object.keys(temp).length === 0) {
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



  const handleSaveAdditional = () => {
    const temp = state.formData.mpReport.additionalIndividual.tempOffender;

    if (!temp || !temp.details || !Object.keys(temp.details).length) {
      toast.error("Please fill additional person details!");
      return;
    }

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.offenderList",
      value: [...offenders, temp],
    });

    dispatch({
      type: "CLEAR_MP_ADDITIONAL",
    });

    setExtraVehicleStatus("");
    setShowAddForm(false);

    toast.success("Additional Person Added!");
  };

  const mp = state.formData.mpReport.individualDetails;
  const add = state.formData.mpReport.additionalIndividual;

  return (
    <FormSection title="">
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

      {showAddForm && (
        <div className="mt-6 border rounded-lg p-6 bg-gray-50">
          <VehiclePrimaryQuestion
            title="Does this additional person involve vehicle?"
            vehicleStatus={extraVehicleStatus}
            setVehicleStatus={setExtraVehicleStatus}
          />

          {extraVehicleStatus === "yes" && (
            <VehicleDetailsForm scope="mp-additional" />
          )}
          {add.vehicleInvolved === "no" && (
            <OffenderWithoutVehicleForm scope="mp-additional" />
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdditional}>Save Person</Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Button onClick={() => setShowAddForm(true)}>+ Add More People</Button>
      </div>

      <DynamicOffenderList
        onDelete={handleDeleteOffender}
        data={offenders}
        title="Victim / Offender List"
      />
    </FormSection>
  );
}
