
"use client";

import { useState } from "react";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { offenderFormsConfig } from "../Step1Particulars/config/OffenderConfig";
import { useForm } from "@/context/FormContext";

interface Field {
  type: "input" | "select";
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface Props {
  title: string;
  helperText?: string;
  fields: Field[];
  showCoDriver?: boolean;
  depth?: number;
}

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  showCoDriver = true,
  depth = 0,
}: Props) {
  const { state } = useForm();

  const isVehicleInvolved =
    state.formData.vehicleInvolved?.toLowerCase() === "yes";

  const activeOffenderType = isVehicleInvolved
    ? state.formData.vehicleDetails.driverType
    : state.formData.offenderWithoutVehicle.offenderType;

  const [showSecondDriver, setShowSecondDriver] = useState(false);
  const [secondDriverType, setSecondDriverType] = useState("");

  const [isDependent, setIsDependent] = useState(false);
  const [relation, setRelation] = useState("");
  const [whoIsIt, setWhoIsIt] = useState("");

  const offenderTypes = Object.keys(offenderFormsConfig);

  return (
    <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-lg">{title}</p>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* MAIN FORM FIELDS */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f, i) =>
          f.type === "input" ? (
            <FormInput
              key={i}
              label={f.label}
              placeholder={f.placeholder}
            />
          ) : (
            <FormSelect
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              options={f.options || []}
            />
          )
        )}
      </div>

      {/* CIVILIAN DEPENDENT SECTION */}
      {isVehicleInvolved &&
        activeOffenderType?.toLowerCase() === "civilian" && (
          <div className="rounded-xl border border-gray-300 bg-gray-50 p-6 space-y-5 mt-6">
            <label className="flex gap-2 items-start text-sm">
              <Checkbox
                checked={isDependent}
                onCheckedChange={(v) => setIsDependent(Boolean(v))}
              />
              <span>
                Is this person <b>Dependent / Relative</b> of Military Personnel
                or Other Registered?
              </span>
            </label>

            {isDependent && (
              <>
                <FormInput
                  label="Name the relation"
                  placeholder="e.g. Brother-in-law"
                  value={relation}
                  onChange={(val) => setRelation(val)}
                />

                <div>
                  <p className="font-semibold mb-2">Who is it?</p>

                  <RadioGroup
                    value={whoIsIt}
                    onValueChange={setWhoIsIt}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[
                      "Military Personnel",
                      "Servant / Maid",
                      "Shopkeeper & Worker",
                      "Temporary Hired Worker",
                    ].map((item) => (
                      <label
                        key={item}
                        className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer bg-white"
                      >
                        <RadioGroupItem value={item} />
                        {item}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {whoIsIt &&
                  offenderFormsConfig[whoIsIt] &&
                  depth < 1 && (
                    <OffenderDynamicForm
                      title={offenderFormsConfig[whoIsIt].title}
                      helperText={offenderFormsConfig[whoIsIt].helperText}
                      fields={offenderFormsConfig[whoIsIt].fields}
                      showCoDriver={false}
                      depth={depth + 1}
                    />
                  )}
              </>
            )}
          </div>
        )}

      {/* CO DRIVER CHECK */}
      {showCoDriver &&
        activeOffenderType?.toLowerCase() !== "civilian" &&
        depth < 1 && (
          <label className="flex gap-2 items-start text-sm cursor-pointer">
            <Checkbox
              checked={showSecondDriver}
              onCheckedChange={(v: boolean) => {
                setShowSecondDriver(v);
                setSecondDriverType("");
              }}
            />
            <span>
              Was there a <b>Co-Driver / Pillion Rider</b> with the
              driver/rider?
            </span>
          </label>
        )}

      {/* CO DRIVER PANEL */}
      {showSecondDriver &&
        activeOffenderType?.toLowerCase() !== "civilian" &&
        depth < 1 && (
          <div className="rounded-xl border border-gray-300 bg-gray-50 p-6 space-y-5 mt-6">
            <p className="font-semibold">
              Select Who was the Co-Driver / Pillion?
            </p>

            <RadioGroup
              value={secondDriverType}
              onValueChange={setSecondDriverType}
              className="grid grid-cols-2 gap-3"
            >
              {offenderTypes.map((item) => (
                <label
                  key={item}
                  className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer bg-white"
                >
                  <RadioGroupItem value={item} />
                  {item}
                </label>
              ))}
            </RadioGroup>

            {secondDriverType &&
              offenderFormsConfig[secondDriverType] &&
              depth < 1 && (
                <OffenderDynamicForm
                  title={offenderFormsConfig[secondDriverType].title}
                  helperText={
                    offenderFormsConfig[secondDriverType].helperText
                  }
                  fields={offenderFormsConfig[secondDriverType].fields}
                  showCoDriver={false}
                  depth={depth + 1}
                />
              )}
          </div>
        )}
    </div>
  );
}
