"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";

export default function VehicleDetailsForm({
  scope = "traffic",
}: {
  scope?: "traffic" | "static";
}) {
  const { state, dispatch } = useForm();

  const traffic = state.formData.traffic;
  const staticSpeed = state.formData.staticSpeed;

  if (
    scope === "traffic" &&
    traffic.vehicleInvolved !== "yes" &&
    state.formData.mpReport.individualDetails?.vehicleInvolved !== "yes" &&
    state.formData.mpReport.witnessVehicleStatus !== "yes"
  ) {
    return null;
  }

  const vehicleState =
    scope === "traffic" ? traffic.vehicleDetails : staticSpeed.vehicleDetails;

  const { category, vehicleType, driverType } = vehicleState;

  const updateVehicle = (data: any) => {
    if (scope === "traffic") {
      dispatch({
        type: "SET_VEHICLE_DETAILS",
        payload: data,
      });
    } else {
      dispatch({
        type: "SET_STATIC_SPEED_DATA",
        payload: {
          vehicleDetails: {
            ...staticSpeed.vehicleDetails,
            ...data,
          },
        },
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

      {/* CIVILIAN VEHICLE DETAILS */}
      {vehicleType === "civilian" && (
        <CivilianVehicleBlock
          vehicleState={vehicleState}
          updateVehicle={updateVehicle}
        />
      )}

      {/* DD VEHICLE DETAILS */}
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

      {/* DYNAMIC OFFENDER FORM */}
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

/* ------------ SMALL SUB COMPONENTS ------------- */

function CivilianVehicleBlock({ vehicleState, updateVehicle }: any) {
  return (
    <div>
      <p className="font-semibold mb-2">Fill Vehicle Identification</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-3">Civil Vehicle Registration Number</Label>
          <Input
            placeholder="e.g. MP04 AB 1234"
            value={vehicleState.vehicleNumber || ""}
            onChange={(e) => updateVehicle({ vehicleNumber: e.target.value })}
          />
        </div>

        <div>
          <Label className="mb-3">
            Make & Type <span className="text-gray-500">(Vehicle Name)</span>
          </Label>
          <Input
            placeholder="e.g. Honda CB Hornet"
            value={vehicleState.vehicleName || ""}
            onChange={(e) => updateVehicle({ vehicleName: e.target.value })}
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
          <Input
            placeholder="e.g. 12A 345678Z"
            value={vehicleState.vehicleNumber || ""}
            onChange={(e) => updateVehicle({ vehicleNumber: e.target.value })}
          />
        </div>

        <div>
          <Label className="mb-3">
            Make & Type <span className="text-gray-500">(Vehicle Name)</span>
          </Label>
          <Input
            placeholder="e.g. ALS W/B"
            value={vehicleState.vehicleName || ""}
            onChange={(e) => updateVehicle({ vehicleName: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
