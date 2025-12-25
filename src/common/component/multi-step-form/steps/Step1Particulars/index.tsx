


"use client";

import OffenderWithoutVehicleForm from "@/common/component/OffenderWithoutVehicleForm";
import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
import VehiclePrimaryQuestion from "@/common/component/VehiclePrimaryQuestion";

export default function Step1Particulars({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="
        w-full h-full
        flex flex-col

        /* Responsive spacing */
        gap-4 sm:gap-5 lg:gap-6
        px-2 sm:px-3 md:px-4 lg:px-6
        pb-4

        /* Safe scroll */
        overflow-y-auto
      "
    >
      {/* ---------- SUB STEP 1 ---------- */}
      <div
        className="
          w-full 
          max-w-full
        "
      >
        <VehiclePrimaryQuestion
          vehicleStatus={value}
          setVehicleStatus={onChange}
          onChange={onChange}
        />
      </div>

      {/* ---------- SUB STEP 2 ---------- */}
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
        {value === "yes" && (
          <div className="w-full">
            <VehicleDetailsForm scope="traffic" />
          </div>
        )}

        {value === "no" && (
          <div className="w-full">
            <OffenderWithoutVehicleForm />
          </div>
        )}
      </div>
    </div>
  );
}
