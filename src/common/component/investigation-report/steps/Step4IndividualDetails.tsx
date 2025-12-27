
"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";

import VehicleDetailsForm from "@/common/component/VehicleDetailsForm";
import OffenderWithoutVehicleForm from "@/common/component/OffenderWithoutVehicleForm";
import VehiclePrimaryQuestion from "@/common/component/VehiclePrimaryQuestion";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function Step4IndividualDetails() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport.individualDetails;
  const add = state.formData.mpReport.additionalIndividual;

  const offenders = mp.offenderList || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [extraVehicleStatus, setExtraVehicleStatus] = useState("");

  const setVehicleInvolved = (value: any) => {
    const normalized =
      value === "vehicle" || value === "yes"
        ? "yes"
        : value === "noVehicle" || value === "no"
        ? "no"
        : "";

    dispatch({
      type: "SET_MP_SECTION",
      section: "individualDetails",
      payload: { vehicleInvolved: normalized },
    });
  };

  // ========== SAVE MAIN OFFENDER ==========
  const handleSaveMain = () => {
    const data =
      mp.vehicleInvolved === "yes" ? mp.vehicleData : mp.tempOffender;
console.log(data);
    if (!data || Object.keys(data).length === 0) {
      toast.error("Please fill main offender details!");
      return;
    }

    // Add to list
    dispatch({
      type: "SET_MP_SECTION",
      section: "individualDetails",
      payload: {
        offenderList: [...offenders, data],
      },
    });

    // Clear temporary fields so next person starts fresh
    dispatch({
      type: "SET_MP_SECTION",
      section: "individualDetails",
      payload: {
        vehicleData: {},
        tempOffender: null,
      },
    });

    toast.success("Main Person Added!");
  };

  // ========== SAVE ADDITIONAL OFFENDER ==========
  const handleSaveAdditional = () => {
    const data =
      extraVehicleStatus === "yes" ? add.vehicleData : add.tempOffender;

    if (!data || Object.keys(data).length === 0) {
      toast.error("Please fill additional person details!");
      return;
    }

    dispatch({
      type: "SET_MP_SECTION",
      section: "individualDetails",
      payload: {
        offenderList: [...offenders, data],
      },
    });

    // Clear additional temp data
    dispatch({ type: "CLEAR_MP_ADDITIONAL" });

    setExtraVehicleStatus("");
    setShowAddForm(false);

    toast.success("Additional Person Added!");
  };

  return (
    <FormSection title="4. DETAILS OF INDIVIDUAL:">
      <p className="font-semibold">MP must verify personal particulars</p>
      <p className="text-sm text-gray-500">
        (To be read out to the Offender(s) by the MP…)
      </p>

      {/* MAIN PERSON */}
      <VehiclePrimaryQuestion
        title="Does this occurrence involve vehicles?"
        vehicleStatus={mp.vehicleInvolved}
        setVehicleStatus={setVehicleInvolved}
      />

      {mp.vehicleInvolved === "yes" && <VehicleDetailsForm scope="mp-main" />}

      {mp.vehicleInvolved === "no" && <OffenderWithoutVehicleForm scope="mp-main" />}

      {mp.vehicleInvolved && (
        <div className="mt-4 flex justify-end">
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveMain}>
            Save Details
          </Button>
        </div>
      )}

      {/* ADD MORE PEOPLE */}
      <div className="mt-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          + Add More People
        </Button>
      </div>

      {/* ADDITIONAL PERSON FORM */}
      {showAddForm && (
        <div className="mt-6 border rounded-lg p-6 bg-gray-50">
          <VehiclePrimaryQuestion
            title="Does this additional person involve vehicle?"
            vehicleStatus={extraVehicleStatus}
            setVehicleStatus={setExtraVehicleStatus}
          />

          {extraVehicleStatus === "yes" && <VehicleDetailsForm scope="mp-additional" />}

          {extraVehicleStatus === "no" && <OffenderWithoutVehicleForm scope="mp-additional" />}

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveAdditional}>
              Save Person
            </Button>
          </div>
        </div>
      )}

      {/* OFFENDER LIST */}
      {offenders.length > 0 && (
        <div className="mt-8 border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-lg">Victim / Offender List:</p>
            <span className="text-blue-600 font-bold text-lg">
              ({String(offenders.length).padStart(2, "0")})
            </span>
          </div>

          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2 text-left">Sno.</th>
                <th className="p-2 text-left">Army / Name</th>
                <th className="p-2 text-left">ICard</th>
                <th className="p-2 text-left">Unit / FMN</th>
                <th className="p-2 text-left">Remark</th>
              </tr>
            </thead>
            <tbody>
              {offenders.map((p: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">{i + 1}.</td>
                  <td className="p-2">
                    <div><b>Name:</b> {p?.name || "-"}</div>
                    <div><b>Army No:</b> {p?.armyNumber || "-"}</div>
                    <div><b>Rank:</b> {p?.rank || "-"}</div>
                  </td>
                  <td className="p-2">{p?.iCard || p?.icard || "-"}</td>
                  <td className="p-2">
                    <div><b>Unit:</b> {p?.unit || "-"}</div>
                    <div><b>FMN:</b> {p?.fmn || "-"}</div>
                    <div><b>Address:</b> {p?.address || "-"}</div>
                  </td>
                  <td className="p-2 text-center">--</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button variant="default" className="bg-blue-600">
          Save & Next →
        </Button>
      </div>
    </FormSection>
  );
}