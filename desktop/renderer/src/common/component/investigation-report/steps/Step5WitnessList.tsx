
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

export default function Step5WitnessList() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport;
  const witnesses = mp.witnesses || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [extraVehicleStatus, setExtraVehicleStatus] = useState("");

  const witnessVehicleStatus = mp.witnessVehicleStatus || "";

  /* ========= VEHICLE STATUS ========= */
  const setVehicleStatus = (value: string) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnessVehicleStatus",
      value,
    });

  /* ========= DELETE ========= */
  const handleDeleteWitness = (index: number) => {
    const updated = witnesses.filter((_, i) => i !== index);

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnesses",
      value: updated,
    });
  };

  /* ========= SAVE MAIN ========= */
  const handleSaveMainWitness = () => {
    const vehicle = mp.individualDetails?.vehicleData || {};
    const person = mp.individualDetails?.tempOffender || {};

    const finalData = { ...vehicle, ...person, type: "witness" };

    if (!Object.keys(finalData).length) {
      toast.error("Please fill witness details!");
      return;
    }

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnesses",
      value: [...witnesses, finalData],
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.tempOffender",
      value: null,
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.vehicleData",
      value: {},
    });

    toast.success("Witness Added!");
  };

  /* ========= SAVE ADDITIONAL ========= */
  const handleSaveAdditionalWitness = () => {
    const vehicle = mp.additionalIndividual?.vehicleData || {};
    const person = mp.additionalIndividual?.tempOffender || {};

    const finalData = { ...vehicle, ...person, type: "witness" };

    if (!Object.keys(finalData).length) {
      toast.error("Please fill additional witness details!");
      return;
    }

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnesses",
      value: [...witnesses, finalData],
    });

    dispatch({ type: "CLEAR_MP_ADDITIONAL" });

    setExtraVehicleStatus("");
    setShowAddForm(false);

    toast.success("Additional Witness Added!");
  };

  /* ========= CLEAR ========= */
  const clearForm = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport",
      value: {
        ...mp,
        witnessVehicleStatus: "",
        witnesses: [],
      },
    });

  return (
    <FormSection title="5. WITNESS LIST:" onClear={clearForm}>
      <VehiclePrimaryQuestion
        title="Does this witness have vehicles?"
        vehicleStatus={witnessVehicleStatus}
        setVehicleStatus={setVehicleStatus}
        onChange={setVehicleStatus}
      />

      {witnessVehicleStatus === "yes" && (
        <VehicleDetailsForm scope="mp-main" />
      )}
      {witnessVehicleStatus === "no" && (
        <OffenderWithoutVehicleForm scope="mp-main" />
      )}

      {witnessVehicleStatus && (
        <div className="mt-4 flex justify-end">
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSaveMainWitness}
          >
            Save Witness
          </Button>
        </div>
      )}

      <div className="mt-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          + Add More Witness
        </Button>
      </div>

      {showAddForm && (
        <div className="mt-6 border rounded-lg p-6 bg-gray-50">
          <VehiclePrimaryQuestion
            title="Does this additional witness involve vehicle?"
            vehicleStatus={extraVehicleStatus}
            setVehicleStatus={setExtraVehicleStatus}
          />

          {extraVehicleStatus === "yes" && (
            <VehicleDetailsForm scope="mp-additional" />
          )}
          {extraVehicleStatus === "no" && (
            <OffenderWithoutVehicleForm scope="mp-additional" />
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleSaveAdditionalWitness}
            >
              Save Witness
            </Button>
          </div>
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
