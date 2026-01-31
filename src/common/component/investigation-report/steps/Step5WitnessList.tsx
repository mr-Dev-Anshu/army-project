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

  const setVehicleStatus = (value: string) => {
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

    if (value === "no") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.individualDetails.tempOffender",
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

  /* ================= SAVE WITNESS ================= */
  const handleSaveMainWitness = () => {
    let temp: any = null;

    if (witnessVehicleStatus === "yes") {
      const vehicleData = mp.witnessTemp?.vehicleData;

      if (!vehicleData || !vehicleData.driverType) {
        toast.error("Please fill witness details!");
        return;
      }

      temp = {
        offenderType: "Witness",
        details: vehicleData,
      };
    }

    if (witnessVehicleStatus === "no") {
      temp = mp.witnessTemp?.tempOffender;
    }

    if (!temp || !temp.details || !Object.keys(temp.details).length) {
      toast.error("Please fill witness details!");
      return;
    }

    const witnessPayload = {
      ...temp.details,
      role: "Witness",
      offenderType: "Witness",
    };

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnesses",
      value: [...witnesses, witnessPayload],
    });

    // reset witness temp
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnessTemp",
      value: {},
    });

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.witnessVehicleStatus",
      value: "",
    });

    toast.success("Witness Added!");
  };

  return (
    <FormSection title="">
      <VehiclePrimaryQuestion
        title="Does this witness have vehicles?"
        vehicleStatus={witnessVehicleStatus}
        setVehicleStatus={setVehicleStatus}
      />

      {witnessVehicleStatus === "yes" && (
        <VehicleDetailsForm
          scope="mp-additional"
          rootPath="formData.mpReport.witnessTemp"
        />
      )}

      {witnessVehicleStatus === "no" && (
        <OffenderWithoutVehicleForm
          scope="mp-additional"
          rootPath="formData.mpReport.witnessTemp"
        />
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
