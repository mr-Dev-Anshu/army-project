"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useMTAccidentReport } from "../hooks/useMTAccidentReport";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";

import { toast } from "react-toastify";
import { createMTAccidentReportSchema } from "@/validators/mtAccidentReportValidation";
import Joi from "joi";
import { IndividualVictimDetails } from "@/components/IndividualVictimDetails";

const INITIAL_DATA = {
  individualDetails: {
    individualType: "militaryPersonnel",
    individualDetails: {} as any,
  },
  accidentDetails: {
    accidentDate: "",
    accidentTime: "",
    placeOfAccident: "",
    accidentType: "normal",
    causeOfAccident: "",
  },
  vehicleDetails: {
    vehicleNumber: "",
    vehicleModel: "",
  },
  casualtyDetails: {
    injuredCivil: "",
    injuredMilitary: "",
    diedCivil: "",
    diedMilitary: "",
  },
  firMactDetails: {
    firMactNumber: "",
    firDate: "",
    firPoliceStation: "",
  },
  authentication: {
    initialsMPCPNCO: "",
    initialsQMSJCO: "",
    initials2IC: "",
  },
  actionStatus: "pending",
  actionStatusRemark: "",
  damageToVehicle: "",
};

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const MTAccidentReportForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  initialData,
}) => {
  const [formData, setFormData] = useState(INITIAL_DATA);
  const { createReport, updateReport, isCreating, isUpdating } =
    useMTAccidentReport();
  const isPending = isCreating || isUpdating;
  const [individualForms, setIndividualForms] = useState([0]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...INITIAL_DATA,
        ...initialData,
        individualDetails: {
          ...INITIAL_DATA.individualDetails,
          ...(initialData.individualDetails || {}),
          individualDetails:
            initialData.individualDetails?.individualDetails || {},
        },
        accidentDetails: {
          ...INITIAL_DATA.accidentDetails,
          ...(initialData.accidentDetails || {}),
        },
        vehicleDetails: {
          ...INITIAL_DATA.vehicleDetails,
          ...(initialData.vehicleDetails || {}),
        },
        casualtyDetails: {
          ...INITIAL_DATA.casualtyDetails,
          ...(initialData.casualtyDetails || {}),
        },
        firMactDetails: {
          ...INITIAL_DATA.firMactDetails,
          ...(initialData.firMactDetails || {}),
        },
        authentication: {
          ...INITIAL_DATA.authentication,
          ...(initialData.authentication || {}),
        },
        damageToVehicle: initialData.damageToVehicle || "",
      });
    }
  }, [initialData]);

  const handleChange = (path: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate form data against schema
      const { error, value } = createMTAccidentReportSchema.validate(formData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        console.error("Validation error:", error);

        const fieldLabels: Record<string, string> = {
          "casualtyDetails.injuredCivil": "Injured (Civil)",
          "casualtyDetails.injuredMilitary": "Injured (Military)",
          "casualtyDetails.diedCivil": "Died (Civil)",
          "casualtyDetails.diedMilitary": "Died (Military)",
          "accidentDetails.accidentDate": "Accident Date",
          damageToVehicle: "Damage to Vehicle",
          actionStatusRemark: "Action Remark",
        };

        const errorMessage = error.details
          .map((d) => {
            const fieldPath = d.path.join(".");
            const label = fieldLabels[fieldPath] || fieldPath; // Fallback to path if no label
            // Replace the quoted path (e.g. "casualtyDetails.injuredCivil") with the friendly label
            return d.message.replace(/"[^"]*"/, label);
          })
          .join(", ");

        toast.error(errorMessage);
        return;
      }

      // Use validated value
      if (initialData) {
        await updateReport({ id: initialData._id, data: value });
      } else {
        await createReport(value);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save report", error);
      // Error toast is already handled in the hook
    }
  };

  const iv = formData.individualDetails;

  return (
    <div className="flex flex-col h-full bg-white font-[Arial]">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {individualForms.map((_, index) => (
          <div key={index} className="mb-6">
            <IndividualVictimDetails
              data={iv}
              onChange={(path, value) =>
                handleChange(`individualDetails.${path}`, value)
              }
            />
          </div>
        ))}
      <div className="w-full flex justify-end">
          <button
          type="button"
          className="bg-black text-white px-4 py-2 rounded-lg"
          onClick={() => setIndividualForms((p) => [...p, 0])}
        >
          + Add More Individuals
        </button>
      </div>

        {/* Accident Details */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Accident Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date of Accident</Label>
              <Input
                type="date"
                value={
                  formData.accidentDetails.accidentDate
                    ? new Date(formData.accidentDetails.accidentDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  e.target.value &&
                  handleChange(
                    "accidentDetails.accidentDate",
                    new Date(e.target.value).toISOString(),
                  )
                }
                className={cn(
                  formData.accidentDetails.accidentDate && "border-blue-500",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Time of Accident (24hr format)</Label>
              <Input
                type="time"
                value={formData.accidentDetails.accidentTime}
                onChange={(e) =>
                  handleChange("accidentDetails.accidentTime", e.target.value)
                }
                className={cn(
                  formData.accidentDetails.accidentTime && "border-blue-500",
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <SuggestionInput
              label="Place of Accident"
              fieldType="address"
              placeholder="Enter Address"
              value={formData.accidentDetails.placeOfAccident}
              onChange={(v) =>
                handleChange("accidentDetails.placeOfAccident", v)
              }
            />
          </div>

          <div className="space-y-3">
            <Label>Type of Accident</Label>
            <RadioGroup
              value={formData.accidentDetails.accidentType}
              onValueChange={(v) =>
                handleChange("accidentDetails.accidentType", v)
              }
              className="flex flex-wrap gap-3"
            >
              {[
                { id: "normal", label: "Normal" },
                { id: "serious", label: "Serious" },
                { id: "fatal", label: "Fatal" },
                { id: "verySerious", label: "Very Serious" },
              ].map((type) => (
                <label
                  key={type.id}
                  className={cn(
                    "flex items-center space-x-2 rounded-full border px-4 py-2 cursor-pointer transition-all hover:bg-gray-50",
                    formData.accidentDetails.accidentType === type.id
                      ? "border-blue-500 bg-gray-50 font-medium"
                      : "border-gray-200 text-gray-700",
                  )}
                >
                  <RadioGroupItem value={type.id} id={`acc-${type.id}`} />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Probable Cause of Accident</Label>
            <Input
              value={formData.accidentDetails.causeOfAccident}
              onChange={(e) =>
                handleChange("accidentDetails.causeOfAccident", e.target.value)
              }
              placeholder="Briefly explain cause"
              className={cn(
                formData.accidentDetails.causeOfAccident && "border-blue-500",
              )}
            />
          </div>
        </section>

        {/* Vehicle Details */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Vehicle Details
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <SuggestionInput
                label="Vehicle BA No. / Civil Vehicle Registration No."
                fieldType="vehicleNumber"
                placeholder="eg. UP 16 AP 1234"
                value={formData.vehicleDetails.vehicleNumber}
                onChange={(v) =>
                  handleChange("vehicleDetails.vehicleNumber", v)
                }
              />
            </div>
            <div className="space-y-1">
              <SuggestionInput
                label="Make & Take"
                fieldType="vehicleType"
                placeholder="Model / Type"
                value={formData.vehicleDetails.vehicleModel}
                onChange={(v) => handleChange("vehicleDetails.vehicleModel", v)}
              />
            </div>
          </div>
        </section>

        {/* Casualty Details */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Casualty Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Injured (Civil)</Label>
              <Input
                type="number"
                min="0"
                value={formData.casualtyDetails.injuredCivil}
                onChange={(e) =>
                  handleChange(
                    "casualtyDetails.injuredCivil",
                    e.target.value ? Number(e.target.value) : 0,
                  )
                }
                placeholder="Value"
                className={cn(
                  formData.casualtyDetails.injuredCivil && "border-blue-500",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Injured (Mil)</Label>
              <Input
                type="number"
                min="0"
                value={formData.casualtyDetails.injuredMilitary}
                onChange={(e) =>
                  handleChange(
                    "casualtyDetails.injuredMilitary",
                    e.target.value ? Number(e.target.value) : 0,
                  )
                }
                placeholder="Value"
                className={cn(
                  formData.casualtyDetails.injuredMilitary && "border-blue-500",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Died (Civil)</Label>
              <Input
                type="number"
                min="0"
                value={formData.casualtyDetails.diedCivil}
                onChange={(e) =>
                  handleChange(
                    "casualtyDetails.diedCivil",
                    e.target.value ? Number(e.target.value) : 0,
                  )
                }
                placeholder="Value"
                className={cn(
                  formData.casualtyDetails.diedCivil && "border-blue-500",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Died (Mil)</Label>
              <Input
                type="number"
                min="0"
                value={formData.casualtyDetails.diedMilitary}
                onChange={(e) =>
                  handleChange(
                    "casualtyDetails.diedMilitary",
                    e.target.value ? Number(e.target.value) : 0,
                  )
                }
                placeholder="Value"
                className={cn(
                  formData.casualtyDetails.diedMilitary && "border-blue-500",
                )}
              />
            </div>
          </div>
        </section>

        {/* Damage to Vehicle */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Damage to Vehicle
          </h3>
          <div className="space-y-2">
            <Label>Describe Vehicle Condition</Label>
            <textarea
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                formData.damageToVehicle && "border-blue-500",
              )}
              placeholder="Describe the damage. Describe Vehicle Condition by enter Tyres Condition, Brakes Condition, Steering Condition, Light Condition, Wiper Condition"
              value={formData.damageToVehicle}
              onChange={(e) => handleChange("damageToVehicle", e.target.value)}
            />
          </div>
        </section>

        {/* FIR / MACT Details */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            FIR / MACT Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>FIR / MACT No.</Label>
              <Input
                value={formData.firMactDetails.firMactNumber}
                onChange={(e) =>
                  handleChange("firMactDetails.firMactNumber", e.target.value)
                }
                placeholder="Value"
                className={cn(
                  formData.firMactDetails.firMactNumber && "border-blue-500",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>FIR Date</Label>
              <Input
                type="date"
                value={
                  formData.firMactDetails.firDate
                    ? new Date(formData.firMactDetails.firDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  e.target.value &&
                  handleChange(
                    "firMactDetails.firDate",
                    new Date(e.target.value).toISOString(),
                  )
                }
                className={cn(
                  formData.firMactDetails.firDate && "border-blue-500",
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <SuggestionInput
              label="FIR Police Station"
              fieldType="policeStation"
              placeholder="Enter Station Name"
              value={formData.firMactDetails.firPoliceStation}
              onChange={(v) =>
                handleChange("firMactDetails.firPoliceStation", v)
              }
            />
          </div>
        </section>

        <AuthenticationSection
          data={formData.authentication || INITIAL_DATA.authentication}
          onChange={(field, value) =>
            handleChange(`authentication.${field}`, value)
          }
        />

        {/* Action */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Action</h3>
          <div className="space-y-3">
            <Label>Action Status</Label>
            <RadioGroup
              value={formData.actionStatus}
              onValueChange={(v) => handleChange("actionStatus", v)}
              className="grid grid-cols-2 gap-4"
            >
              <label
                className={cn(
                  "flex items-center space-x-2 rounded-md border h-10 px-3 cursor-pointer hover:bg-gray-50 transition-colors",
                  formData.actionStatus === "pending"
                    ? "border-blue-500 bg-gray-50"
                    : "border-gray-200",
                )}
              >
                <RadioGroupItem value="pending" id="action-pending" />
                <span className="text-xs font-medium">Action Pending</span>
              </label>

              <label
                className={cn(
                  "flex items-center space-x-2 rounded-md border h-10 px-3 cursor-pointer hover:bg-gray-50 transition-colors",
                  formData.actionStatus === "taken"
                    ? "border-blue-500 bg-gray-50"
                    : "border-gray-200",
                )}
              >
                <RadioGroupItem value="taken" id="action-taken" />
                <span className="text-xs font-medium">Action Taken</span>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <Label>Add Remark</Label>
            <textarea
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                formData.actionStatusRemark && "border-blue-500",
              )}
              placeholder="Enter remark"
              value={formData.actionStatusRemark}
              onChange={(e) =>
                handleChange("actionStatusRemark", e.target.value)
              }
            />
          </div>
        </section>
      </div>

      <FormFooter
        onCancel={onCancel}
        onSave={handleSubmit}
        isLoading={isPending}
        saveLabel={initialData ? "Update & Save" : "Save & Add Another"}
      />
    </div>
  );
};

export default MTAccidentReportForm;
