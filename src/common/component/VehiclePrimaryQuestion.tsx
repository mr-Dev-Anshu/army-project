

"use client";

type YesNo = "yes" | "no" | "";

interface VehiclePrimaryQuestionProps {
  title?: string;
  vehicleStatus: YesNo;
  setVehicleStatus?: (value: YesNo) => void;
  onChange?: (value: YesNo) => void;
}

export default function VehiclePrimaryQuestion({
  title,
  vehicleStatus,
  setVehicleStatus,
  onChange,
}: VehiclePrimaryQuestionProps) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold text-xl mb-3">{title}</h3>

      <div className="flex gap-6">
        {/* YES */}
        <label
          className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-all
            ${vehicleStatus === "yes"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"}
          `}
        >
          <input
            type="radio"
            name="vehicle"
            checked={vehicleStatus === "yes"}
            onChange={() => {
              setVehicleStatus?.("yes");
              onChange?.("yes");
            }}
          />
          Yes, Vehicle Involved
        </label>

        {/* NO */}
        <label
          className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition-all
            ${vehicleStatus === "no"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"}
          `}
        >
          <input
            type="radio"
            name="vehicle"
            checked={vehicleStatus === "no"}
            onChange={() => {
              setVehicleStatus?.("no");
              onChange?.("no");
            }}
          />
          No, Vehicle Not Involved
        </label>
      </div>
    </div>
  );
}
