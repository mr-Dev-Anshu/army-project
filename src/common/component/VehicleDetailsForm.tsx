"use client";

import { useReducer } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";

// ⭐ IMPORT CONFIG

const initialState = {
  category: "",
  vehicleType: "",
  driverType: "",
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, category: action.payload };

    case "SET_VEHICLE_TYPE":
      return { ...state, vehicleType: action.payload };

    case "SET_DRIVER_TYPE":
      return { ...state, driverType: action.payload };

    case "RESET_DRIVER":
      return { ...state, driverType: "" };

    default:
      return state;
  }
}

export default function VehicleDetailsForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="border rounded-lg p-6 space-y-8">

      {/* VEHICLE CATEGORY */}
      <div>
        <p className="font-semibold mb-2">Select Vehicle Category</p>

        <RadioGroup
          value={state.category}
          onValueChange={(v) =>
            dispatch({ type: "SET_CATEGORY", payload: v })
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
          value={state.vehicleType}
          onValueChange={(v) =>
            dispatch({ type: "SET_VEHICLE_TYPE", payload: v })
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

      {/* VEHICLE DETAILS */}
      <div>
        <p className="font-semibold mb-2">
          Fill Vehicle Identification Fields:
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>DD Vehicle BA Number</Label>
            <Input placeholder="e.g. 12A 345678Z" />
          </div>

          <div>
            <Label>
              Make & Type{" "}
              <span className="text-gray-500">(Vehicle Name)</span>
            </Label>
            <Input placeholder="e.g. ALS W/B" />
          </div>
        </div>
      </div>

      {/* DRIVER TYPE */}
      <div>
        <p className="font-semibold mb-2">
          Select Who was the Driver/Rider?
        </p>

        <RadioGroup
          value={state.driverType}
          onValueChange={(v) =>
            dispatch({ type: "SET_DRIVER_TYPE", payload: v })
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

      {/* ⭐ DYNAMIC FORM */}
      {state.driverType && offenderFormsConfig[state.driverType] && (
        <OffenderDynamicForm
          title={offenderFormsConfig[state.driverType].title}
          helperText={offenderFormsConfig[state.driverType].helperText}
          fields={offenderFormsConfig[state.driverType].fields}
        />
      )}
    </div>
  );
}
