

// "use client";

// import OffenderWithoutVehicleForm from "@/common/component/OffenderWithoutVehicleForm";
// import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
// import VehiclePrimaryQuestion from "@/common/component/VehiclePrimaryQuestion";

// export default function Step1Particulars({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div className="w-full h-full flex flex-col gap-6 px-4 pb-4 overflow-y-auto">

//       {/* QUESTION */}
//       <VehiclePrimaryQuestion
//         vehicleStatus={value}
//         setVehicleStatus={onChange}
//         onChange={onChange}
//       />

//       {/* ✅ VEHICLE FLOW */}
//       {value === "yes" && (
//         <VehicleDetailsForm scope="traffic" />
//       )}

//       {/* ✅ NO VEHICLE FLOW */}
//       {value === "no" && (
//         <OffenderWithoutVehicleForm scope="traffic" />
//       )}

//     </div>
//   );
// }



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
    <div className="w-full h-full flex flex-col gap-6 px-4 pb-4 overflow-y-auto">

      {/* ================= VEHICLE + QUESTION CARD ================= */}
      <div className="border rounded-xl p-4 space-y-6 bg-white">

        <VehiclePrimaryQuestion
          vehicleStatus={value}
          setVehicleStatus={onChange}
          onChange={onChange}
        />

        {value === "yes" && (
          <VehicleDetailsForm scope="traffic" hideDriverSection />
        )}

      </div>

      {/* ================= OFFENDER CARD ================= */}
      {value === "yes" && (
        <div className="border rounded-xl p-4 bg-white">
          <OffenderWithoutVehicleForm scope="traffic" />
        </div>
      )}

      {/* ================= NO VEHICLE FLOW ================= */}
      {value === "no" && (
        <div className="border rounded-xl p-4 bg-white">
          <OffenderWithoutVehicleForm scope="traffic" />
        </div>
      )}

    </div>
  );
}
