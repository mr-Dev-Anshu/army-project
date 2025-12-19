"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";

import { useForm } from "@/context/FormContext";

export default function VehicleDetailsForm() {
  const { state, dispatch } = useForm();

  // RIGHT PATH — yahi use karo
  const { category, vehicleType, driverType } =
    state.formData.vehicleDetails;

  return (
    <div className="border h-full   rounded-lg p-6 space-y-8">
      {/* VEHICLE CATEGORY */}
      <div>
        <p className="font-semibold mb-2">Select Vehicle Category</p>

        <RadioGroup
          value={category}
          onValueChange={(v) =>
            dispatch({
              type: "SET_VEHICLE_DETAILS",
              payload: { category: v },
            })
          }
          className="grid grid-cols-2 gap-4"
        >
          <label className="border rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="2w" />
            2-Wheeler
          </label>

          <label className="border rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="4w" />
            4-Wheeler
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
          onValueChange={(v) =>
            dispatch({
              type: "SET_VEHICLE_DETAILS",
              payload: { vehicleType: v },
            })
          }
          className="grid grid-cols-2 gap-4"
        >
          <label className="border rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="civilian" />
            Civilian Vehicle
          </label>

          <label className="border rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer">
            <RadioGroupItem value="dd" />
            DD Vehicle
          </label>
        </RadioGroup>
      </div>

      {/* CIVILIAN VEHICLE */}
      {vehicleType === "civilian" && (
        <div>
          <p className="font-semibold mb-2">
            Fill Vehicle Identification Fields:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-3">
                Civil Vehicle Registration Number
              </Label>
              <Input placeholder="e.g. MP04 AB 1234" />
            </div>

            <div>
              <Label className="mb-3">
                Make & Type{" "}
                <span className="text-gray-500">(Vehicle Name)</span>
              </Label>
              <Input placeholder="e.g. Honda CB (Hornet)" />
            </div>
          </div>
        </div>
      )}

      {/* DD VEHICLE */}
      {vehicleType === "dd" && (
        <div>
          <p className="font-semibold mb-2">
            Fill Vehicle Identification Fields:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-3">DD Vehicle BA Number</Label>
              <Input placeholder="e.g. 12A 345678Z" />
            </div>

            <div>
              <Label className="mb-3">
                Make & Type{" "}
                <span className="text-gray-500">(Vehicle Name)</span>
              </Label>
              <Input placeholder="e.g. ALS W/B" />
            </div>
          </div>
        </div>
      )}

      {/* DRIVER TYPE */}
      <div>
        <p className="font-semibold mb-2">
          Select Who was the Driver/Rider?
        </p>

        <RadioGroup
          value={driverType}
          onValueChange={(v) =>
            dispatch({
              type: "SET_VEHICLE_DETAILS",
              payload: { driverType: v },
            })
          }
          className="grid grid-cols-2 gap-3"
        >
          {[
            "Military Personnel",
            "Civilian",
            "Employee",
            "Servant / Maid",
            "Shop Keeper",
            "Temporary Hired Worker",
          ].map((item) => (
            <label
              key={item}
              className="border rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer"
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
          title={offenderFormsConfig[driverType].title}
          helperText={offenderFormsConfig[driverType].helperText}
          fields={offenderFormsConfig[driverType].fields}
        />
      )}
    </div>
  );
}
