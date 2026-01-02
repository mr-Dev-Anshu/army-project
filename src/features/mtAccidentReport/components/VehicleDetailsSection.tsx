"use client";

import { useForm } from "@/context/FormContext";
import { FormInput } from "@/common/component/FormInput";
import DriverRiderSection from "./DriverRiderSection";

export default function VehicleDetailsSection() {
  const { state, dispatch } = useForm();

  const vehicle = state.formData.mtAccidentReport;

  return (
    <section className="space-y-4">
      <h3 className="font-semibold">Vehicle Details</h3>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Vehicle Number"
          value={vehicle.vehicleNumber}
          onChange={(v) =>
            dispatch({
              type: "SET_PATH",
              path: "formData.mtAccidentReport.vehicleNumber",
              value: v,
            })
          }
        />

        <FormInput
          label="Make & Model"
          value={vehicle.makeAndModel}
          onChange={(v) =>
            dispatch({
              type: "SET_PATH",
              path: "formData.mtAccidentReport.makeAndModel",
              value: v,
            })
          }
        />
      </div>

     
  
    </section>
  );
}
