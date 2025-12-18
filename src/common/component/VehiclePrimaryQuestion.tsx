"use client";

export default function VehiclePrimaryQuestion({
  vehicleStatus,
  setVehicleStatus,
  onChange
}: any) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-3">
        Does this offence involve vehicles?
      </h3>

      <div className="flex gap-6">
        <label className="flex gap-2">
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

        <label className="flex gap-2">
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
