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
//     <div
//       className="
//         w-full h-full
//         flex flex-col
//         gap-4 sm:gap-5 lg:gap-6
//         px-2 sm:px-3 md:px-4 lg:px-6
//         pb-4
//         overflow-y-auto
//       "
//     >
//       {/* ✅ QUESTION ONLY */}
//       <div className="w-full max-w-full">
//         <VehiclePrimaryQuestion
//           vehicleStatus={value}
//           setVehicleStatus={onChange}
//           onChange={onChange}
//         />
//       </div>

//       {/* ================= AFTER SELECTION ================= */}

//       {/* ✅ IF VEHICLE INVOLVED */}
//       {value === "yes" && (
//         <>
//           {/* Vehicle Details */}
//           <div className="w-full">
//             <h1 className="text-xl font-bold mb-4">
//               1.1 Fill Vehicle Identification Fields:
//             </h1>
//             <VehicleDetailsForm scope="traffic" />
//           </div>

//           {/* Driver / Rider */}
//           <div className="w-full flex flex-col gap-6">
//             <OffenderWithoutVehicleForm scope="traffic" />
//           </div>
//         </>
//       )}

//       {/* ✅ IF NO VEHICLE */}
//       {value === "no" && (
//         <div className="w-full flex flex-col gap-6">
//           <OffenderWithoutVehicleForm scope="traffic" />
//         </div>
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

      {/* QUESTION */}
      <VehiclePrimaryQuestion
        vehicleStatus={value}
        setVehicleStatus={onChange}
        onChange={onChange}
      />

      {/* ✅ VEHICLE FLOW */}
      {value === "yes" && (
        <VehicleDetailsForm scope="traffic" />
      )}

      {/* ✅ NO VEHICLE FLOW */}
      {value === "no" && (
        <OffenderWithoutVehicleForm scope="traffic" />
      )}

    </div>
  );
}
