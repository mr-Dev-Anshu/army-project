
// "use client";

// export default function VehiclePrimaryQuestion({
//   vehicleStatus,
//   setVehicleStatus,
//   onChange
// }: any) {
//   return (
//     <div className="border rounded-lg p-6">
//       <h3 className="font-semibold mb-3">
//         Does this offence involve vehicles?
//       </h3>

//       <div className="flex gap-6">
//         {/* YES OPTION */}
//         <label
//           className={`
//             flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-all
//             ${
//               vehicleStatus === "yes"
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-300"
//             }
//           `}
//         >
//           <input
//             type="radio"
//             checked={vehicleStatus === "yes"}
//             onChange={() => {
//               setVehicleStatus("yes");
//               onChange("yes");
//             }}
//           />
//           Yes, Vehicle Involved
//         </label>

//         {/* NO OPTION */}
//         <label
//           className={`
//             flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-all
//             ${
//               vehicleStatus === "no"
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-300"
//             }
//           `}
//         >
//           <input
//             type="radio"
//             checked={vehicleStatus === "no"}
//             onChange={() => {
//               setVehicleStatus("no");
//               onChange("no");
//             }}
//           />
//           No, Vehicle Not Involved
//         </label>
//       </div>
//     </div>
//   );
// }




"use client";

interface VehiclePrimaryQuestionProps {
  title?: string;            // 🔹 dynamic title
  vehicleStatus: string;
  setVehicleStatus: (v: string) => void;
  onChange: (v: string) => void;
}

export default function VehiclePrimaryQuestion({
  title = "Does this offence involve vehicles?", // 🔹 default
  vehicleStatus,
  setVehicleStatus,
  onChange,
}: VehiclePrimaryQuestionProps) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-3">{title}</h3>

      <div className="flex gap-6">
        {/* YES OPTION */}
        <label
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-all
            ${
              vehicleStatus === "yes"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }
          `}
        >
          <input
            type="radio"
            checked={vehicleStatus === "yes"}
            onChange={() => {
              setVehicleStatus("yes");
              onChange("yes");
            }}
          />
          Yes, Vehicle Involved
        </label>

        {/* NO OPTION */}
        <label
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-all
            ${
              vehicleStatus === "no"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }
          `}
        >
          <input
            type="radio"
            checked={vehicleStatus === "no"}
            onChange={() => {
              setVehicleStatus("no");
              onChange("no");
            }}
          />
          No, Vehicle Not Involved
        </label>
      </div>
    </div>
  );
}

