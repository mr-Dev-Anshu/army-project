
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

export default function VehicleDetailsForm({ scope = "traffic" }) {
  const { state, dispatch } = useForm();

  const traffic = state.formData.traffic;
  const staticSpeed = state.formData.staticSpeed;

  // TRAFFIC — only show if vehicle involved
  if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;

  /* ================= VEHICLE STATE PICKER ================= */
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

  /* ================= UPDATE VEHICLE GLOBAL ================= */
  const updateVehicle = (data: any) => {
    const updated = { ...vehicleState, ...data };

    if (scope === "traffic") {
      dispatch({
        type: "SET_PATH",
        path: "formData.traffic.vehicleDetails",
        value: updated,
      });
    }

    if (scope === "static") {
      dispatch({
        type: "SET_PATH",
        path: "formData.staticSpeed.vehicleDetails",
        value: updated,
      });
    }

    if (scope === "mp-main") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.individualDetails.vehicleData",
        value: updated,
      });
    }

    if (scope === "mp-additional") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.additionalIndividual.vehicleData",
        value: updated,
      });
    }
  };

  /* ================= LOCAL STATES ================= */
  const [hasCoDriver, setHasCoDriver] = useState("");
  const [coDriverType, setCoDriverType] = useState("");
  const [civilianRelative, setCivilianRelative] = useState("");

  return (
    <div className="border rounded-lg bg-white p-4 space-y-6">
      {/* ================= VEHICLE CATEGORY ================= */}
      <div>
        <p className="font-semibold mb-2">Select Vehicle Category</p>

        <RadioGroup
          value={category}
          onValueChange={(v) => updateVehicle({ category: v })}
          className="grid sm:grid-cols-2 gap-3"
        >
          <label
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
              category === "2w" ? "border-blue-500 bg-blue-50" : "border-gray-300"
            )}
          >
            <RadioGroupItem value="2w" /> 2-Wheeler
          </label>

          <label
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
              category === "4w" ? "border-blue-500 bg-blue-50" : "border-gray-300"
            )}
          >
            <RadioGroupItem value="4w" /> 4-Wheeler
          </label>
        </RadioGroup>
      </div>

      {/* ================= VEHICLE TYPE ================= */}
      <div>
        <p className="font-semibold mb-2">
          Which Type Of Vehicle Was Involved?
        </p>

        <RadioGroup
          value={vehicleType}
          onValueChange={(v) =>
            updateVehicle({
              vehicleType: v,
              vehicleNumber: "",
              vehicleName: "",
            })
          }
          className="grid sm:grid-cols-2 gap-3"
        >
          <label
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
              vehicleType === "civilian"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          >
            <RadioGroupItem value="civilian" /> Civilian Vehicle
          </label>

          <label
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
              vehicleType === "dd"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          >
            <RadioGroupItem value="dd" /> DD Vehicle
          </label>
        </RadioGroup>
      </div>

      {/* ================= CIVILIAN VEHICLE FORM ================= */}
      {vehicleType === "civilian" && (
        <div>
          <p className="font-semibold mb-2">Fill Vehicle Identification</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-3">Civil Vehicle Registration Number</Label>
              <SuggestionInput
                placeholder="e.g. MP04 AB 1234"
                value={vehicleState.vehicleNumber || ""}
                onChange={(v) => updateVehicle({ vehicleNumber: v })}
                fieldType="vehicleNumber"
              />
            </div>

            <div>
              <Label className="mb-3">
                Make & Type <span className="text-gray-500">(Vehicle Name)</span>
              </Label>
              <SuggestionInput
                placeholder="e.g. Honda CB Hornet"
                value={vehicleState.vehicleName || ""}
                onChange={(v) => updateVehicle({ vehicleName: v })}
                fieldType="vehicleName"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= DD VEHICLE FORM ================= */}
      {vehicleType === "dd" && (
        <div>
          <p className="font-semibold mb-2">Fill Vehicle Identification</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="mb-3">DD Vehicle BA Number</Label>
              <SuggestionInput
                placeholder="e.g. 12A 345678Z"
                value={vehicleState.vehicleNumber || ""}
                onChange={(v) => updateVehicle({ vehicleNumber: v })}
                fieldType="vehicleNumber"
              />
            </div>

            <div>
              <Label className="mb-3">
                Make & Type <span className="text-gray-500">(Vehicle Name)</span>
              </Label>
              <SuggestionInput
                placeholder="e.g. ALS W/B"
                value={vehicleState.vehicleName || ""}
                onChange={(v) => updateVehicle({ vehicleName: v })}
                fieldType="vehicleName"
              />
            </div>
          </div>
        </div>
      )}

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

      {/* ================= NON CIVILIAN FLOW ================= */}
      {driverType && driverType !== "Civilian" && (
        <>
          <OffenderDynamicForm
            scope={scope}
            title={offenderFormsConfig[driverType].title}
            fields={offenderFormsConfig[driverType].fields}
            showCoDriver={false}
          />

          <p className="font-semibold flex items-center gap-3">
            <Checkbox
              checked={hasCoDriver === "yes"}
              onCheckedChange={(checked) =>
                setHasCoDriver(checked ? "yes" : "no")
              }
              className="w-5 h-5"
            />
            Any Co-Driver / Pillion?
          </p>

          {hasCoDriver === "yes" && (
            <>
              <p className="font-semibold">Who was Co-Driver / Pillion?</p>

              <RadioGroup
                value={coDriverType}
                onValueChange={setCoDriverType}
                className="grid sm:grid-cols-2 gap-3"
              >
                {Object.keys(offenderFormsConfig).map((i) => (
                  <label
                    key={i}
                    className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
                  >
                    <RadioGroupItem value={i} />
                    {i}
                  </label>
                ))}
              </RadioGroup>

              {coDriverType && (
                <OffenderDynamicForm
                  scope={scope}
                  title={offenderFormsConfig[coDriverType].title}
                  helperText="Co-Driver Details"
                  fields={offenderFormsConfig[coDriverType].fields}
                  showCoDriver={false}
                />
              )}
            </>
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
            showCoDriver={false}
          />

          <p className="font-semibold mt-4">
            Does Civilian have any Military Relative?
          </p>

          <RadioGroup
            value={civilianRelative}
            onValueChange={setCivilianRelative}
            className="flex gap-6"
          >
            <label className="flex gap-2">
              <RadioGroupItem value="yes" /> Yes
            </label>
            <label className="flex gap-2">
              <RadioGroupItem value="no" /> No
            </label>
          </RadioGroup>

          {civilianRelative === "yes" && (
            <OffenderDynamicForm
              scope={scope}
              title="Military Relative Details"
              fields={offenderFormsConfig["Military Person"].fields}
              showCoDriver={false}
            />
          )}
        </>
      )}
    </div>
  );
}
