import { useState } from "react";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";




type OffenderKey = keyof typeof offenderFormsConfig & string;

interface OffenderWithoutVehicleFormProps {
  offenderType?: OffenderKey;   
  scope?: "traffic" | "static" | "mp-main" | "mp-additional";
}

export default function OffenderWithoutVehicleForm({
  offenderType: externalType = "",
  scope = "traffic",
}: OffenderWithoutVehicleFormProps) {
  const offenderConfig = offenderFormsConfig;

 const [offenderType, setOffenderType] = useState<OffenderKey | "">(
  externalType as OffenderKey
);


  const { dispatch } = useForm();

  if (!offenderConfig) return null;

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <p className="font-semibold">Who was the Offender ?</p>

      <RadioGroup
        value={offenderType ?? ""}
        onValueChange={(value: OffenderKey) => {
          setOffenderType(value);

          dispatch({
            type: "SET_PATH",
            path: "formData.traffic.offenderWithoutVehicle.offenderType",
            value,
          });

          dispatch({
            type: "SET_PATH",
            path: "formData.traffic.vehicleInvolved",
            value: "no",
          });

          dispatch({
            type: "SET_PATH",
            path: "formData.traffic.vehicleDetails",
            value: {
              category: "",
              vehicleType: "",
              driverType: "",
            },
          });
        }}
        className="grid grid-cols-2 gap-3"
      >
        {Object.keys(offenderConfig).map((item) => (
          <label
            key={item}
            className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
          >
            <RadioGroupItem value={item} />
            {item}
          </label>
        ))}
      </RadioGroup>

      {offenderType && offenderConfig[offenderType] && (
        <OffenderDynamicForm
          scope="traffic"
          title={offenderConfig[offenderType].title}
          helperText={offenderConfig[offenderType].helperText}
          fields={offenderConfig[offenderType].fields.slice(1)}
          showCoDriver={false}
        />
      )}
    </div>
  );
}
