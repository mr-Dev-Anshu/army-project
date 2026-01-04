
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

export default function Step5WitnessList() {
  const { state, dispatch } = useForm();

  const witnesses = state.formData.mpReport.witnesses || [];
  const witnessVehicleStatus =
    state.formData.mpReport.witnessVehicleStatus || "";

  const [showAddForm, setShowAddForm] = useState(false);

  const setVehicleStatus = (value: YesNo) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnessVehicleStatus",
      value,
    });

    if (value === "yes") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.individualDetails.vehicleData",
        value: {},
      });
    }
  };

  const handleDeleteWitness = (index: number) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnesses",
      value: witnesses.filter((_, i) => i !== index),
    });
  };


const handleSaveMainWitness = () => {
  const temp = state.formData.mpReport.individualDetails.tempOffender;

  if (!temp || Object.keys(temp).length === 0) {
    toast.error("Please fill witness details!");
    return;
  }

  // 🔥 FLATTEN DETAILS
  const flat = temp.details ? { ...temp.details } : { ...temp };

  const witnessPayload = {
    ...flat,
    role: "Witness",
    offenderType: "Witness",
  };

  dispatch({
    type: "SET_PATH",
    path: "formData.mpReport.witnesses",
    value: [...witnesses, witnessPayload],
  });

  dispatch({
    type: "SET_PATH",
    path: "formData.mpReport.individualDetails.tempOffender",
    value: {},
  });

  toast.success("Witness Added!");
};



  return (
    <FormSection title="">
      <VehiclePrimaryQuestion
        title="Does this witness involve a vehicle?"
        vehicleStatus={witnessVehicleStatus}
        setVehicleStatus={setVehicleStatus}
      />

      {witnessVehicleStatus === "yes" && <VehicleDetailsForm scope="mp-main" />}
      {witnessVehicleStatus === "no" && (
        <OffenderWithoutVehicleForm scope="mp-main" />
      )}

      {witnessVehicleStatus && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveMainWitness}>Save Witness</Button>
        </div>
      )}

      <DynamicOffenderList
        onDelete={handleDeleteWitness}
        data={witnesses}
        title="Witness List"
      />
    </FormSection>
  );
}
