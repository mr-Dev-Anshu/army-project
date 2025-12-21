"use client";

import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";

export default function StaticSpeedStep1Particulars() {
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
        <h1 className="text-xl font-bold mb-4"> 1.1 Fill Vehicle Identification Fields:</h1>
          <VehicleDetailsForm />
        </div>
      </div>
    </div>
  );
}
