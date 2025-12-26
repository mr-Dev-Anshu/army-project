"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";

import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
import OffenderWithoutVehicleForm from "@/common/component/OffenderWithoutVehicleForm";
import VehiclePrimaryQuestion from "@/common/component/VehiclePrimaryQuestion";

export default function Step5WitnessList() {
  const { state, dispatch } = useForm();

  const witnessData = state.formData.mpReport.witnesses || [];
  const witnessVehicleStatus = state.formData.mpReport.witnessVehicleStatus || "";

  /* ========== SET VEHICLE STATUS ========== */
  const setVehicleStatus = (value: "yes" | "no" | "") => {
    dispatch({
      type: "SET_MP_DATA",
      payload: {
        witnessVehicleStatus: value,
      },
    });
  };

  /* ========== CLEAR FORM ========== */
  const clearForm = () => {
    dispatch({
      type: "SET_MP_DATA",
      payload: {
        witnessVehicleStatus: "",
        witnesses: [],
      },
    });
  };

  return (
    <FormSection title="5. WITNESS LIST:" onClear={clearForm}>
      
      {/* ======= VEHICLE QUESTION ======= */}
      <VehiclePrimaryQuestion
        title="Does this witness have vehicles?"
        vehicleStatus={witnessVehicleStatus}
        setVehicleStatus={setVehicleStatus}
        onChange={setVehicleStatus}
      />

      {/* ======= CONDITIONAL UI ======= */}
      {witnessVehicleStatus === "yes" && (
        <VehicleDetailsForm scope="traffic" />
      )}

      {witnessVehicleStatus === "no" && (
        <OffenderWithoutVehicleForm />
      )}

      {/* ======= LIVE WITNESS TABLE ======= */}
      {witnessData.length > 0 && (
        <div className="mt-6 border rounded-lg p-4">
          <div className="flex justify-between">
            <p className="font-semibold">Witness List:</p>

            <span className="text-blue-600 font-semibold">
              ({String(witnessData.length).padStart(2, "0")})
            </span>
          </div>

          <table className="w-full mt-3 text-sm">
            <thead>
              <tr className="border-b">
                <th>Sno.</th>
                <th>Army No., Rank & Name</th>
                <th>Identity Card</th>
                <th>Unit/Tele No.</th>
                <th>Remark</th>
              </tr>
            </thead>

            <tbody>
              {witnessData.map((w: any, i: number) => (
                <tr key={i} className="border-b">
                  <td>{i + 1}.</td>

                  <td>
                    <p><b>Witness Name:</b> {w?.name}</p>
                    <p><b>Army no.:</b> {w?.armyNumber}</p>
                    <p><b>Rank:</b> {w?.rank}</p>
                  </td>

                  <td>{w?.iCard}</td>

                  <td>
                    <p><b>Unit:</b> {w?.unit}</p>
                    <p><b>FMN:</b> {w?.fmn}</p>
                    <p><b>Address:</b> {w?.address}</p>
                  </td>

                  <td>--</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </FormSection>
  );
}
