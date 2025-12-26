"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";

import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
import OffenderWithoutVehicleForm from "@/common/component/OffenderWithoutVehicleForm";
import VehiclePrimaryQuestion from "@/common/component/VehiclePrimaryQuestion";

export default function Step4IndividualDetails() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport.individualDetails;
  const offenders = mp.offenderList || [];

  const setVehicleInvolved = (value: any) => {
    const normalized =
      value === "vehicle" || value === "yes" ? "yes" :
      value === "noVehicle" || value === "no" ? "no" :
      "";

    dispatch({
      type: "SET_MP_SECTION",
      section: "individualDetails",
      payload: { vehicleInvolved: normalized },
    });
  };

  const clearForm = () => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "individualDetails",
      payload: {
        vehicleInvolved: "",
        vehicle: {
          category: "",
          vehicleType: "",
          driverType: "",
          vehicleName: "",
        },
        driverType: "",
        offenderList: [],
      },
    });
  };

  return (
    <FormSection title="4. DETAILS OF INDIVIDUAL:" onClear={clearForm}>
      <p className="font-semibold">MP must verify personal particulars</p>
      <p className="text-sm text-gray-500">
        (To be read out to the Offender(s) by the MP…)
      </p>

      {/* SAME LIKE PARTICULARS */}
      <VehiclePrimaryQuestion
      title="Does this occurance involve vehicles ?"
        vehicleStatus={mp.vehicleInvolved}
        setVehicleStatus={setVehicleInvolved}
        onChange={setVehicleInvolved}
      />

      {/* CONDITIONAL UI */}
      {mp.vehicleInvolved === "yes" && (
        <VehicleDetailsForm scope="traffic" />
      )}

      {mp.vehicleInvolved === "no" && (
        <OffenderWithoutVehicleForm />
      )}

      {/* LIVE LIST */}
      {offenders.length > 0 && (
        <div className="mt-6 border rounded-lg p-4">
          <div className="flex justify-between">
            <p className="font-semibold">Victim / Offender List:</p>
            <span className="text-blue-600 font-semibold">
              ({String(offenders.length).padStart(2, "0")})
            </span>
          </div>

          <table className="w-full mt-3 text-sm">
            <thead>
              <tr className="border-b">
                <th>Sno.</th>
                <th>Army / Name</th>
                <th>ICard</th>
                <th>Unit / FMN</th>
                <th>Remark</th>
              </tr>
            </thead>

            <tbody>
              {offenders.map((p: any, i: number) => (
                <tr key={i} className="border-b">
                  <td>{i + 1}.</td>
                  <td>
                    <p><b>Name:</b> {p?.name}</p>
                    <p><b>Army No:</b> {p?.armyNumber}</p>
                    <p><b>Rank:</b> {p?.rank}</p>
                  </td>

                  <td>{p?.iCard}</td>

                  <td>
                    <p><b>Unit:</b> {p?.unit}</p>
                    <p><b>FMN:</b> {p?.fmn}</p>
                    <p><b>Address:</b> {p?.address}</p>
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
