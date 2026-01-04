"use client";

import { useForm } from "@/context/FormContext";
import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
import VehiclePrimaryQuestion from "@/common/component/VehiclePrimaryQuestion";

export default function StaticSpeedStep1Particulars() {
  const { state, dispatch } = useForm();

  const vehicleStatus = state.formData.staticSpeed.vehicleInvolved;

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
      {/* 🔹 PRIMARY QUESTION (MISSING PART) */}
      <VehiclePrimaryQuestion
        title="Does this offence involve a vehicle?"
        vehicleStatus={vehicleStatus}
        setVehicleStatus={(v) =>
          dispatch({
            type: "SET_PATH",
            path: "formData.staticSpeed.vehicleInvolved",
            value: v,
          })
        }
      />

      {/* 🔹 VEHICLE DETAILS */}
      {vehicleStatus === "yes" && (
        <div
          className="
            w-full
            min-h-[200px]
            sm:min-h-[230px]
            md:min-h-[260px]
            lg:min-h-[300px]
            flex
          "
        >
          <div className="w-full">
            <h1 className="text-xl font-bold mb-4">
              1.1 Fill Vehicle Identification Fields:
            </h1>

            <VehicleDetailsForm scope="static" />
          </div>
        </div>
      )}
    </div>
  );
}
