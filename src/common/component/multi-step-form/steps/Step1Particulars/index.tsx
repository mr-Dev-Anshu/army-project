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
    <div className="space-y-6">
      {/* SUB STEP 1 - YES / NO */}
      <VehiclePrimaryQuestion
        vehicleStatus={value}
        setVehicleStatus={onChange}
        onChange={onChange}
      />

      {/* SUB STEP 2 - Show This Only If YES */}
      {value === "yes" && <VehicleDetailsForm />}
      {value === "no" && <OffenderWithoutVehicleForm />}
    </div>
  );
}
