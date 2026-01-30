


"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { cn } from "@/lib/utils";

type ScopeType = "traffic" | "static" | "mp-main" | "mp-additional";

interface VehicleDetailsFormProps {
  scope?: ScopeType;
  rootPath?: string;
}

export default function VehicleDetailsForm({
  scope = "traffic",
  rootPath,
}: VehicleDetailsFormProps) {
  const { state, dispatch } = useForm();

  const traffic = state.formData.traffic;
  const staticSpeed = state.formData.staticSpeed;
  const mpMain = state.formData.mpReport.individualDetails;

  // Helper for deep access
  const getValue = (obj: any, path: string) =>
    path.split('.').reduce((o, k) => (o || {})[k], obj);

  const mpAdd = rootPath
    ? getValue(state, rootPath)
    : state.formData.mpReport.additionalIndividual;

  /* ================= GUARD ================= */
  if (scope === "traffic" && traffic.vehicleInvolved !== "yes") return null;
  if (scope === "mp-main" && mpMain.vehicleInvolved !== "yes") return null;
  // Use mpAdd for check if we are using rootPath or default
  if (scope === "mp-additional" && mpAdd?.vehicleInvolved !== "yes") return null;

  /* ================= VEHICLE STATE ================= */
  let vehicleState: any = {};

  if (scope === "traffic") vehicleState = traffic.vehicleDetails;
  else if (scope === "static") vehicleState = staticSpeed.vehicleDetails;
  else if (scope === "mp-main") vehicleState = mpMain.vehicleData;
  else if (scope === "mp-additional") vehicleState = mpAdd?.vehicleData;

  const category = vehicleState?.category || "";
  const vehicleType = vehicleState?.vehicleType || "";
  const driverType = vehicleState?.driverType || "";

  let vehiclePath = "";
  if (rootPath) {
    vehiclePath = `${rootPath}.vehicleData`;
  } else if (scope === "traffic") {
    vehiclePath = "formData.traffic.vehicleDetails";
  } else if (scope === "static") {
    vehiclePath = "formData.staticSpeed.vehicleDetails";
  } else if (scope === "mp-main") {
    vehiclePath = "formData.mpReport.individualDetails.vehicleData";
  } else if (scope === "mp-additional") {
    vehiclePath = "formData.mpReport.additionalIndividual.vehicleData";
  }

  /* ================= UPDATE VEHICLE ================= */
  const updateVehicle = (data: any) => {
    dispatch({
      type: "SET_PATH",
      path: vehiclePath,
      value: { ...(vehicleState || {}), ...data },
    });
  };

  /* ================= VEHICLE TYPE CHANGE ================= */
  const onVehicleTypeChange = (v: string) => {
    updateVehicle({
      vehicleType: v,
      vehicleNumber: "",
      vehicleName: "",
      driverType: "",
    });

    if (scope === "traffic") {
      dispatch({
        type: "SET_PATH",
        path: "formData.traffic.offenderPeople",
        value: [],
      });
    }

    if (scope === "static") {
      dispatch({
        type: "SET_PATH",
        path: "formData.staticSpeed.offenderPeople",
        value: [],
      });
    }
  };

  /* ================= ENSURE MAIN OFFENDER ================= */
  const ensureMainOffender = (type: string) => {
    if (scope !== "traffic" && scope !== "static") return;

    const peoplePath =
      scope === "traffic"
        ? "formData.traffic.offenderPeople"
        : "formData.staticSpeed.offenderPeople";

    dispatch({
      type: "SET_PATH",
      path: peoplePath,
      value: [
        {
          type,
          whoIsIt: "Driver",
          details: {},
        },
      ],
    });
  };

  return (
    <div className="bg-white p-4 space-y-6">
      {/* VEHICLE CATEGORY */}
      <div>
        <p className="font-semibold mb-2">Select Vehicle Category</p>
        <RadioGroup
          value={category}
          onValueChange={(v) => updateVehicle({ category: v })}
          className="grid sm:grid-cols-2 gap-3"
        >
          {["2w", "4w"].map((v) => (
            <label
              key={v}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                category === v
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <RadioGroupItem value={v} />
              {v === "2w" ? "2-Wheeler" : "4-Wheeler"}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* VEHICLE TYPE */}
      <div>
        <p className="font-semibold mb-2">
          Which Type Of Vehicle Was Involved?
        </p>
        <RadioGroup
          value={vehicleType}
          onValueChange={onVehicleTypeChange}
          className="grid sm:grid-cols-2 gap-3"
        >
          {["civilian", "dd"].map((v) => (
            <label
              key={v}
              className={cn(
                "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer",
                vehicleType === v
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              )}
            >
              <RadioGroupItem value={v} />
              {v === "civilian" ? "Civilian Vehicle" : "DD Vehicle"}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* VEHICLE IDENTIFICATION */}
      {vehicleType && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>
              {vehicleType === "civilian"
                ? "Civil Vehicle Registration Number"
                : "DD Vehicle BA Number"}
            </Label>
            <SuggestionInput
              value={vehicleState?.vehicleNumber || ""}
              onChange={(v) => updateVehicle({ vehicleNumber: v })}
              placeholder={
                vehicleType === "civilian"
                  ? "e.g. MP04 AB 1234"
                  : "e.g. 12A 345678Z"
              }
              fieldType={
                vehicleType === "civilian"
                  ? "vehicleNumber"
                  : "ddVehicleNumber"
              }
            />
          </div>

          <div>
            <Label>Make & Type (Vehicle Name)</Label>
            <SuggestionInput
              value={vehicleState?.vehicleName || ""}
              onChange={(v) => updateVehicle({ vehicleName: v })}
              placeholder={
                vehicleType === "civilian"
                  ? "e.g. Honda CB (Hornet)"
                  : "e.g. ALS W/B"
              }
              fieldType="vehicleName"
            />
          </div>
        </div>
      )}

      {/* DRIVER / RIDER */}
      {/* <div>
        <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>
        <RadioGroup
          value={driverType}
          onValueChange={(v) => {
            updateVehicle({ driverType: v });
            ensureMainOffender(v);
          }}
          className="grid sm:grid-cols-2 gap-3"
        >
          {Object.keys(offenderFormsConfig).map((item) => (
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
      </div> */}

      {/* OFFENDER DETAILS */}
      {driverType && (
        <div className="border rounded-xl p-4 mt-4">
          <OffenderDynamicForm
            scope={scope as any}
            title={`${driverType} Details`}
            fields={offenderFormsConfig[driverType].fields}
            path={
              rootPath
                ? `${rootPath}.tempOffender.details`
                : scope === "traffic"
                  ? "formData.traffic.offenderPeople[0].details"
                  : scope === "static"
                    ? "formData.staticSpeed.offenderPeople[0].details"
                    : scope === "mp-main"
                      ? "formData.mpReport.individualDetails.tempOffender.details"
                      : "formData.mpReport.additionalIndividual.tempOffender.details"
            }
            isRoot={true}
          />
        </div>
      )}
    </div>
  );
}

