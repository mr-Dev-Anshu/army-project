

"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type ScopeType = "traffic" | "static" | "mp-main" | "mp-additional";

interface VehicleDetailsFormProps {
  scope?: ScopeType;
}

export default function VehicleDetailsForm({
  scope = "traffic",
}: VehicleDetailsFormProps) {
  const { state, dispatch } = useForm();

  const traffic = state.formData.traffic;
  const staticSpeed = state.formData.staticSpeed;

  const [offenders, setOffenders] = useState<
    { id: number; type: string | null }[]
  >([]);

  if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;

  const vehicleState =
    scope === "traffic"
      ? traffic.vehicleDetails
      : scope === "static"
      ? staticSpeed.vehicleDetails
      : scope === "mp-main"
      ? state.formData.mpReport.individualDetails.vehicleData || {}
      : scope === "mp-additional"
      ? state.formData.mpReport.additionalIndividual.vehicleData || {}
      : {};

  const { category = "", vehicleType = "", driverType = "" } = vehicleState;

  const updateVehicle = (data: any) => {
    const updated = { ...vehicleState, ...data };

    dispatch({
      type: "SET_PATH",
      path:
        scope === "traffic"
          ? "formData.traffic.vehicleDetails"
          : scope === "static"
          ? "formData.staticSpeed.vehicleDetails"
          : scope === "mp-main"
          ? "formData.mpReport.individualDetails.vehicleData"
          : "formData.mpReport.additionalIndividual.vehicleData",
      value: updated,
    });
  };

  const [hasCoDriver, setHasCoDriver] = useState("");
  const [coDriverType, setCoDriverType] = useState("");
  const [civilianRelative, setCivilianRelative] = useState("");

  const driverPath =
    scope === "traffic"
      ? "formData.traffic.vehicleDetails.driver"
      : scope === "static"
      ? "formData.staticSpeed.vehicleDetails.driver"
      : scope === "mp-main"
      ? "formData.mpReport.individualDetails.tempOffender"
      : "formData.mpReport.additionalIndividual.tempOffender";

  const coDriverPath =
    scope === "traffic"
      ? "formData.traffic.vehicleDetails.coDriver"
      : scope === "static"
      ? "formData.staticSpeed.vehicleDetails.coDriver"
      : scope === "mp-main"
      ? "formData.mpReport.individualDetails.tempOffender"
      : "formData.mpReport.additionalIndividual.tempOffender";

  return (
    <div className=" bg-white p-4 space-y-6">
      {/* ================= DRIVER TYPE ================= */}
      <div>
        <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>

        <RadioGroup
          value={driverType}
          onValueChange={(v) => {
            updateVehicle({ driverType: v });
            setHasCoDriver("");
            setCoDriverType("");
            setCivilianRelative("");

            setOffenders([{ id: Date.now(), type: v }]);
          }}
          className="grid sm:grid-cols-2 gap-3"
        >
          {[
            "Military Person",
            "Civilian",
            "Employee",
            "Servant/Maid",
            "Shop Keeper",
            "Temporary Hired Worker",
          ].map((item) => (
            <label
              key={item}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                driverType === item
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <RadioGroupItem value={item} />
              {item}
            </label>
          ))}
        </RadioGroup>
      </div>

      {driverType && driverType !== "Civilian" && (
        <>
          {offenders.map((o, index) => (
            <div key={o.id} className="border rounded-xl p-4 mt-4">
              {/* FIRST PERSON → DIRECT FORM WITH CO-DRIVER */}
              {index === 0 ? (
                <OffenderDynamicForm
                  scope={scope}
                  title={`${o.type} Details`}
                  fields={offenderFormsConfig[o.type!].fields}
                  path={`${driverPath}[${index}]`}
                  showCoDriver={true} // ⭐️ ONLY FIRST PERSON
                />
              ) : (
                <>
                  <p className="font-semibold mb-2">
                    Select Who was Person #{index + 1}
                  </p>

                  <RadioGroup
                    className="grid sm:grid-cols-2 gap-3"
                    value={o.type ?? ""}
                    onValueChange={(val) =>
                      setOffenders((prev) =>
                        prev.map((x) =>
                          x.id === o.id ? { ...x, type: val } : x
                        )
                      )
                    }
                  >
                    {Object.keys(offenderFormsConfig).map((i) => (
                      <label
                        key={i}
                        className={cn(
                          "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                          o.type === i
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        )}
                      >
                        <RadioGroupItem value={i} />
                        {i}
                      </label>
                    ))}
                  </RadioGroup>

                  {o.type && (
                    <div className="mt-4">
                      <OffenderDynamicForm
                        scope={scope}
                        title={`${o.type} Details`}
                        fields={offenderFormsConfig[o.type].fields}
                        path={`${driverPath}[${index}]`}
                        showCoDriver={false} // ⭐️ REST PEOPLE — NO CODRIVER
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {(scope === "traffic" || scope === "static") && (
            <div className="flex justify-end -mt-6">
              <button
                className="mt-4 px-4 py-2 bg-black text-white rounded-md"
                onClick={() =>
                  setOffenders((prev) => [
                    ...prev,
                    { id: Date.now(), type: null },
                  ])
                }
              >
                + Add More Person
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= CIVILIAN FLOW ================= */}
      {driverType === "Civilian" && (
        <>
          <OffenderDynamicForm
            scope={scope}
            title="Civilian Details"
            fields={offenderFormsConfig["Civilian"].fields}
            path={driverPath}
            showCoDriver={true} // ⭐️ CIVILIAN DRIVER ALSO GET Co-Driver Option
          />
        </>
      )}
    </div>
  );
}
