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

  // Hide if traffic and vehicle not involved
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

  /* ================= UPDATE ================= */
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

  /* ================= LOCAL ================= */
  const [hasCoDriver, setHasCoDriver] = useState("");
  const [coDriverType, setCoDriverType] = useState("");
  const [civilianRelative, setCivilianRelative] = useState("");

  /* ================= PATHS ================= */
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
    <div className="border rounded-lg bg-white p-4 space-y-6">
      {/* ================= CATEGORY ================= */}
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
              category === "2w"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          >
            <RadioGroupItem value="2w" /> 2-Wheeler
          </label>

          <label
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
              category === "4w"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          >
            <RadioGroupItem value="4w" /> 4-Wheeler
          </label>
        </RadioGroup>
      </div>

      {/* ================= VEHICLE TYPE ================= */}
      <div>
        <p className="font-semibold mb-2">Which Type Of Vehicle Was Involved?</p>

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

      {/* ================= CIVILIAN ================= */}
      {vehicleType === "civilian" && (
        <div>
          <p className="font-semibold mb-2">Fill Vehicle Identification</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Number */}
            <div>
              <Label className="mb-3">Civil Vehicle Registration Number</Label>

              <div
                className={cn(
                  "border rounded-lg",
                  vehicleState.vehicleNumber
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                )}
              >
                <SuggestionInput
                  placeholder="e.g. MP04 AB 1234"
                  value={vehicleState.vehicleNumber || ""}
                  onChange={(v) => updateVehicle({ vehicleNumber: v })}
                  fieldType="vehicleNumber"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <Label className="mb-3">
                Make & Type <span className="text-gray-500">(Vehicle Name)</span>
              </Label>

              <div
                className={cn(
                  "border rounded-lg",
                  vehicleState.vehicleName
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                )}
              >
                <SuggestionInput
                  placeholder="e.g. Honda CB Hornet"
                  value={vehicleState.vehicleName || ""}
                  onChange={(v) => updateVehicle({ vehicleName: v })}
                  fieldType="vehicleName"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DD VEHICLE ================= */}
      {vehicleType === "dd" && (
        <div>
          <p className="font-semibold mb-2">Fill Vehicle Identification</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* BA Number */}
            <div>
              <Label className="mb-3">DD Vehicle BA Number</Label>

              <div
                className={cn(
                  "border rounded-lg",
                  vehicleState.vehicleNumber
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                )}
              >
                <SuggestionInput
                  placeholder="e.g. 12A 345678Z"
                  value={vehicleState.vehicleNumber || ""}
                  onChange={(v) => updateVehicle({ vehicleNumber: v })}
                  fieldType="vehicleNumber"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <Label className="mb-3">
                Make & Type <span className="text-gray-500">(Vehicle Name)</span>
              </Label>

              <div
                className={cn(
                  "border rounded-lg",
                  vehicleState.vehicleName
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                )}
              >
                <SuggestionInput
                  placeholder="e.g. ALS W/B"
                  value={vehicleState.vehicleName || ""}
                  onChange={(v) => updateVehicle({ vehicleName: v })}
                  fieldType="vehicleName"
                />
              </div>
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

      {/* ================= NON CIV ================= */}
      {driverType && driverType !== "Civilian" && (
        <>
          <OffenderDynamicForm
            scope={scope}
            title={offenderFormsConfig[driverType].title}
            fields={offenderFormsConfig[driverType].fields}
            showCoDriver={false}
            path={driverPath}
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
                  path={coDriverPath}
                />
              )}
            </>
          )}
        </>
      )}

      {/* ================= CIVILIAN ================= */}
      {driverType === "Civilian" && (
        <>
          <OffenderDynamicForm
            scope={scope}
            title="Civilian Details"
            fields={offenderFormsConfig["Civilian"].fields}
            showCoDriver={false}
            path={driverPath}
          />

          <p className="font-semibold mt-4 flex items-center gap-3">
            <Checkbox
              checked={civilianRelative === "yes"}
              onCheckedChange={(checked) =>
                setCivilianRelative(checked ? "yes" : "")
              }
              className="w-5 h-5"
            />
            Civilian has Military Relative?
          </p>

          {civilianRelative === "yes" && (
            <>
              <p className="font-semibold mt-3">
                Enter Relation of Military Person
              </p>

              <SuggestionInput
                placeholder="e.g. Father / Husband / Brother"
                value={coDriverType}
                onChange={setCoDriverType}
                fieldType="relation"
              />

              <p className="font-semibold mt-4">
                Select Military Person Type
              </p>

              <RadioGroup
                onValueChange={setHasCoDriver}
                value={hasCoDriver}
                className="grid sm:grid-cols-2 gap-3"
              >
                {[
                  "Military Person",
                  "Employee",
                  "Servant/Maid",
                  "Shop Keeper",
                  "Temporary Hired Worker",
                ].map((item) => (
                  <label
                    key={item}
                    className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
                  >
                    <RadioGroupItem value={item} />
                    {item}
                  </label>
                ))}
              </RadioGroup>

              {hasCoDriver && (
                <OffenderDynamicForm
                  scope={scope}
                  title={`${hasCoDriver} Details`}
                  helperText={coDriverType ? `Relation: ${coDriverType}` : ""}
                  fields={offenderFormsConfig[hasCoDriver].fields}
                  showCoDriver={false}
                  path={coDriverPath}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
