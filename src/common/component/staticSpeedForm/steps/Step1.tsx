
"use client";

import { useEffect } from "react";
import { useForm } from "@/context/FormContext";
import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
import OffenderWithoutVehicleForm from "@/common/component/OffenderWithoutVehicleForm";

export default function StaticSpeedStep1Particulars() {
  const { state, dispatch } = useForm();

  /* 🔥 FORCE vehicleInvolved = "yes" for static speed */
  useEffect(() => {
    if (state.formData.staticSpeed.vehicleInvolved !== "yes") {
      dispatch({
        type: "SET_PATH",
        path: "formData.staticSpeed.vehicleInvolved",
        value: "yes",
      });
    }
  }, [dispatch, state.formData.staticSpeed.vehicleInvolved]);

  return (
    <div
      className="
        w-full h-full
        flex flex-col
        gap-4 sm:gap-5 lg:gap-6
        px-2 sm:px-3 md:px-4 lg:px-6
        pb-4
        overflow-y-auto
      "
    >
      {/* 🔹 VEHICLE DETAILS */}
      <div className="w-full border rounded-lg p-4 bg-white">
        <h1 className="text-xl font-bold mb-4">
          1.1 Fill Vehicle Identification Fields:
        </h1>

        <VehicleDetailsForm scope="static" hideDriverSection={true} />
      </div>

      {/* 🔹 OFFENDER (SINGLE) */}
      <div className="w-full flex border rounded-lg flex-col gap-6">
        <OffenderWithoutVehicleForm scope="static" />
      </div>
    </div>
  );
}
