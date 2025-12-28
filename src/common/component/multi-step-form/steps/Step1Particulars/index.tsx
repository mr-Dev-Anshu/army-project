
"use client";

import OffenderWithoutVehicleForm from "@/common/component/OffenderWithoutVehicleForm";
import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
import VehiclePrimaryQuestion from "@/common/component/VehiclePrimaryQuestion";
import { useForm } from "@/context/FormContext";

type YesNo = "yes" | "no" | "";

export default function Step1Particulars() {
  const { state, dispatch } = useForm();

  const value: YesNo = state.formData.traffic.vehicleInvolved || "";

  const setVehicle = (v: YesNo) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.traffic.vehicleInvolved",
      value: v,
    });

  return (
    <div className="w-full h-full flex flex-col gap-6 px-4 pb-4 overflow-y-auto">

      <VehiclePrimaryQuestion
        vehicleStatus={value}
        setVehicleStatus={setVehicle}
      />

      {value === "yes" && <VehicleDetailsForm scope="traffic" />}

      {value === "no" && <OffenderWithoutVehicleForm />}

    </div>
  );
}
