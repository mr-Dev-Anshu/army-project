"use client";

import { useForm } from "@/context/FormContext";
import { FormInput } from "@/common/component/FormInput";

export default function VehicleDetailsSection() {
  const { state, dispatch } = useForm();

  const vehicle = state.formData.mtAccidentReport;

  return (
    <section className="space-y-6">
      {/* ===== SECTION TITLE ===== */}
      <h3 className="text-lg font-semibold text-gray-900">
        Vehicle Details
      </h3>

      {/* ===== VEHICLE NUMBER ===== */}
      <FormInput
        label="Vehicle BA No. / Civil Vehicle Registration No."
        placeholder="eg. UP 16 AP 1234"
        value={vehicle.vehicleNumber}
        onChange={(v) =>
          dispatch({
            type: "SET_PATH",
            path: "formData.mtAccidentReport.vehicleNumber",
            value: v,
          })
        }
      />

      {/* ===== MAKE & MODEL ===== */}
      <FormInput
        label="Make & Take"
        placeholder="Model / Type"
        value={vehicle.makeAndModel}
        onChange={(v) =>
          dispatch({
            type: "SET_PATH",
            path: "formData.mtAccidentReport.makeAndModel",
            value: v,
          })
        }
      />
    </section>
  );
}
