

"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { cn } from "@/lib/utils";

export default function VehicleDetailsForm({
  scope = "traffic",
}: {
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
}) {
  const { state, dispatch } = useForm();

  const traffic = state.formData.traffic;
  const staticSpeed = state.formData.staticSpeed;
  const mp = state.formData.mpReport;

  /* ================= VISIBILITY FIX ================= */

  // Traffic + MP-main shared visibility
  if (
    scope === "traffic" &&
    traffic.vehicleInvolved !== "yes" &&
    mp.individualDetails?.vehicleInvolved !== "yes"
  ) {
    return null;
  }

  // MP MAIN FORM visibility (❌ pehle yaha additional check ho raha tha)
  if (scope === "mp-main" && mp.individualDetails.vehicleInvolved !== "yes") {
    return null;
  }

  /* ================= STATE SOURCE FIX ================= */

  const vehicleState =
    scope === "traffic"
      ? traffic.vehicleDetails
      : scope === "mp-main"
        ? mp.individualDetails.vehicleData || {}
        : staticSpeed.vehicleDetails;

  const { category = "", vehicleType = "", driverType = "" } = vehicleState;

  const updateVehicle = (data: any) => {
    const updated = {
      ...vehicleState,
      ...data,
    };

    if (scope === "traffic") {
      dispatch({
        type: "SET_PATH",
        path: "formData.traffic.vehicleDetails",
        value: updated,
      });
    }

    else if (scope === "mp-main") {
      dispatch({
        type: "SET_PATH",
        path: "formData.mpReport.individualDetails.vehicleData",
        value: updated,
      });
    }

    else {
      dispatch({
        type: "SET_PATH",
        path: "formData.staticSpeed.vehicleDetails",
        value: updated,
      });
    }
  };

  return (
    <div className="border rounded-lg bg-white p-4 space-y-6 max-h-[75vh] overflow-y-auto">
      {/* VEHICLE CATEGORY */}
      <div>
        <p className="font-semibold mb-2">Select Vehicle Category</p>

        <RadioGroup
          value={category}
          onValueChange={(v) => updateVehicle({ category: v })}
          className="grid sm:grid-cols-2 gap-3"
        >
          <label
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
              category === "2w"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          >
            <RadioGroupItem value="2w" /> 2-Wheeler
          </label>

          <label
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
              category === "4w"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          >
            <RadioGroupItem value="4w" /> 4-Wheeler
          </label>
        </RadioGroup>
      </div>

      {/* VEHICLE TYPE */}
      <div>
        <p className="font-semibold mb-2">
          Which Type Of Vehicle Was Involved?
        </p>

        <RadioGroup
          value={vehicleType}
          onValueChange={(v) => updateVehicle({ vehicleType: v })}
          className="grid sm:grid-cols-2 gap-3"
        >
          <label
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
              vehicleType === "civilian"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          >
            <RadioGroupItem value="civilian" /> Civilian Vehicle
          </label>

          <label
            className={cn(
              "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
              vehicleType === "dd"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            )}
          >
            <RadioGroupItem value="dd" /> DD Vehicle
          </label>
        </RadioGroup>
      </div>

      {/* CIVILIAN VEHICLE */}
      {vehicleType === "civilian" && (
        <CivilianVehicleBlock
          vehicleState={vehicleState}
          updateVehicle={updateVehicle}
        />
      )}

      {/* DD VEHICLE */}
      {vehicleType === "dd" && (
        <DDVehicleBlock
          vehicleState={vehicleState}
          updateVehicle={updateVehicle}
        />
      )}

      {/* DRIVER TYPE */}
      <div>
        <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>

        <RadioGroup
          value={driverType}
          onValueChange={(v) => updateVehicle({ driverType: v })}
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
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
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

      {/* DYNAMIC FORM */}
      {driverType && offenderFormsConfig[driverType] && (
        <OffenderDynamicForm
          scope={scope}
          title={offenderFormsConfig[driverType].title}
          helperText={offenderFormsConfig[driverType].helperText}
          fields={offenderFormsConfig[driverType].fields}
          showCoDriver={true}
        />
      )}
    </div>
  );
}

/* ------------ SUB COMPONENTS ------------- */

function CivilianVehicleBlock({ vehicleState, updateVehicle }: any) {
  return (
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
  );
}

function DDVehicleBlock({ vehicleState, updateVehicle }: any) {
  return (
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
  );
}
