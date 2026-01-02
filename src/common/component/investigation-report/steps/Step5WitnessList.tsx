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

  const mp = state.formData.mpReport;

  const witnesses = mp.witnesses || [];
  const witnessVehicleStatus: YesNo = mp.witnessVehicleStatus || "";

  const add = mp.additionalIndividual;

  const [showAddForm, setShowAddForm] = useState(false);
  const [extraVehicleStatus, setExtraVehicleStatus] = useState<YesNo>("");

  /* ========= VEHICLE YES/NO ========= */
  const setVehicleStatus = (value: YesNo) =>
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

  const handleSaveMainWitness = () => {
    const person = mp.individualDetails?.tempOffender || {};

    if (!Object.keys(person).length) {
      toast.error("Please fill witness details!");
      return;
    }

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnesses",
      value: [...witnesses, { ...person, type: "witness" }],
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.individualDetails.tempOffender",
      value: {}, // ⭐ ye reset hoga
    });

    toast.success("Witness Added!");
  };

  const handleSaveAdditionalWitness = () => {
    const person = mp.additionalIndividual?.tempOffender || {};

    if (!Object.keys(person).length) {
      toast.error("Please fill additional witness details!");
      return;
    }

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnesses",
      value: [...witnesses, { ...person, type: "witness" }],
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.additionalIndividual",
      value: {
        vehicleInvolved: "",
        vehicleData: {},
        driverType: "",
        tempOffender: {}, // ⭐ null nahi, empty object rakho
      },
    });

    setExtraVehicleStatus("");
    setShowAddForm(false);

    toast.success("Additional Witness Added!");
  };

  return (
    <FormSection title="">
      {/* MAIN WITNESS */}
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
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSaveMainWitness}
          >
            Save Witness
          </Button>
        </div>
      )}

      {/* ADDITIONAL FORM */}
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

      {/* ADD MORE */}
      <div className="mt-6 flex w-full justify-start">
        <Button
          className="bg-black text-white cursor-pointer px-4 py-2 text-sm sm:text-base"
          onClick={() => setShowAddForm(true)}
        >
          + Add More Witness
        </Button>
      </div>

      {/* LIST */}
      <DynamicOffenderList
        onDelete={handleDeleteWitness}
        data={witnesses}
        title="Witness List"
      />
    </FormSection>
  );
}
