import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { SuggestionInput } from "@/common/component/SuggestionInput";

interface IndividualVictimDetailsProps {
  data: any;
  onChange: (path: string, value: any) => void;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export const IndividualVictimDetails: React.FC<
  IndividualVictimDetailsProps
> = ({ data, onChange, hideHeader = false, hideFooter = false }) => {
    const [passengers, setPassengers] = useState<any[]>([]);

  return (
    <div>
      <section className="space-y-4 border p-6 rounded-md bg-white shadow-sm">
        {/* ================= HEADER ================= */}
        <div className="space-y-4">
          {!hideHeader && (
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Individual / Victim Details
            </h3>
          )}

          <div>
            {!hideHeader ? (
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select Individual & Fill Details
              </p>
            ) : (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">
                  Fill Details
                </p>
                <p className="text-xs text-gray-500">
                  The form will update based on your selection.
                </p>
              </div>
            )}

            <RadioGroup
              value={data.individualType}
              onValueChange={(v) => onChange("individualType", v)}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { id: "militaryPersonnel", label: "Military Personnel" },
                { id: "civilian", label: "Civilian / Dependent" },
                { id: "employee", label: "Employee" },
                { id: "servantMaid", label: "Servant / Maid" },
                { id: "shopKeeper", label: "Shop Keeper" },
                { id: "tempHiredWorker", label: "Temporary Hired Worker" },
              ].map((type) => (
                <label
                  key={type.id}
                  className={cn(
                    "flex items-center space-x-2 rounded-md border h-10 px-3 cursor-pointer hover:bg-gray-50 transition-colors",
                    data.individualType === type.id
                      ? "border-blue-500 bg-gray-50"
                      : "border-gray-200",
                  )}
                >
                  <RadioGroupItem value={type.id} />
                  <span className="text-xs font-medium">{type.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* ================= CONDITIONAL FORMS ================= */}
        {/* ================= CONDITIONAL FORMS ================= */}

        {/* ============ MILITARY PERSONNEL ============ */}
        {data.individualType === "militaryPersonnel" && (
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <SuggestionInput
                label="Army No."
                fieldType="armyNo"
                placeholder="Enter Army Number"
                value={data.individualDetails?.armyNo || ""}
                onChange={(v) => onChange("individualDetails.armyNo", v)}
              />
              <SuggestionInput
                label="Rank"
                fieldType="rank"
                placeholder="Enter Rank"
                value={data.individualDetails?.rank || ""}
                onChange={(v) => onChange("individualDetails.rank", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SuggestionInput
                label="Unit"
                fieldType="unit"
                placeholder="Enter Unit"
                value={data.individualDetails?.unit || ""}
                onChange={(v) => onChange("individualDetails.unit", v)}
              />
              <SuggestionInput
                label="Name"
                fieldType="name"
                placeholder="Enter Name"
                value={data.individualDetails?.name || ""}
                onChange={(v) => onChange("individualDetails.name", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SuggestionInput
                label="FMN"
                fieldType="fmn"
                placeholder="Enter FMN"
                value={data.individualDetails?.fmn || ""}
                onChange={(v) => onChange("individualDetails.fmn", v)}
              />
              <SuggestionInput
                label="Command"
                fieldType="command"
                placeholder="Enter Command"
                value={data.individualDetails?.command || ""}
                onChange={(v) => onChange("individualDetails.command", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SuggestionInput
                label="Address"
                fieldType="address"
                placeholder="Enter Address"
                value={data.individualDetails?.address || ""}
                onChange={(v) => onChange("individualDetails.address", v)}
              />
              <SuggestionInput
                label="I-Card Number"
                fieldType="iCard"
                placeholder="Enter I Card Number"
                value={data.individualDetails?.iCard || ""}
                onChange={(v) => onChange("individualDetails.iCard", v)}
              />
            </div>
          </div>
        )}

        {/* ============ EMPLOYEE ============ */}
        {data.individualType === "employee" && (
          <div className="space-y-4 pt-4">
            <SuggestionInput
              label="Service Number"
              fieldType="serviceNumber"
              placeholder="Enter Service Number"
              value={data.individualDetails?.serviceNumber || ""}
              onChange={(v) => onChange("individualDetails.serviceNumber", v)}
            />

            <SuggestionInput
              label="Name"
              fieldType="name"
              placeholder="Enter Name"
              value={data.individualDetails?.name || ""}
              onChange={(v) => onChange("individualDetails.name", v)}
            />

            <div className="grid grid-cols-2 gap-4">
              <SuggestionInput
                label="Rank"
                fieldType="rank"
                placeholder="Enter Rank"
                value={data.individualDetails?.rank || ""}
                onChange={(v) => onChange("individualDetails.rank", v)}
              />
              <SuggestionInput
                label="Unit"
                fieldType="unit"
                placeholder="Enter Unit"
                value={data.individualDetails?.unit || ""}
                onChange={(v) => onChange("individualDetails.unit", v)}
              />
            </div>
          </div>
        )}

        {/* ============ SERVANT / MAID ============ */}
        {data.individualType === "servantMaid" && (
          <div className="space-y-4 pt-4">
            <SuggestionInput
              label="Pass Number"
              fieldType="passNumber"
              placeholder="Enter Pass Number"
              value={data.individualDetails?.passNumber || ""}
              onChange={(v) => onChange("individualDetails.passNumber", v)}
            />

            <SuggestionInput
              label="Father Name"
              fieldType="fatherName"
              placeholder="Enter Father Name"
              value={data.individualDetails?.fatherName || ""}
              onChange={(v) => onChange("individualDetails.fatherName", v)}
            />

            <SuggestionInput
              label="Name"
              fieldType="name"
              placeholder="Enter Name"
              value={data.individualDetails?.name || ""}
              onChange={(v) => onChange("individualDetails.name", v)}
            />

            <SuggestionInput
              label="Trade"
              fieldType="trade"
              placeholder="Enter Trade"
              value={data.individualDetails?.trade || ""}
              onChange={(v) => onChange("individualDetails.trade", v)}
            />

            <SuggestionInput
              label="Quarter No."
              fieldType="quarter"
              placeholder="Enter Quarter Number"
              value={data.individualDetails?.quarter || ""}
              onChange={(v) => onChange("individualDetails.quarter", v)}
            />
          </div>
        )}

        {/* ============ SHOP KEEPER ============ */}
        {data.individualType === "shopKeeper" && (
          <div className="space-y-4 pt-4">
            <SuggestionInput
              label="Shop Owner Name"
              fieldType="ownerName"
              placeholder="Enter Owner Name"
              value={data.individualDetails?.ownerName || ""}
              onChange={(v) => onChange("individualDetails.ownerName", v)}
            />

            <SuggestionInput
              label="Shop Name"
              fieldType="shopName"
              placeholder="Enter Shop Name"
              value={data.individualDetails?.shopName || ""}
              onChange={(v) => onChange("individualDetails.shopName", v)}
            />

            <SuggestionInput
              label="Shop Address"
              fieldType="address"
              placeholder="Enter Address"
              value={data.individualDetails?.address || ""}
              onChange={(v) => onChange("individualDetails.address", v)}
            />

            <SuggestionInput
              label="Pass Number"
              fieldType="passNumber"
              placeholder="Enter Pass Number"
              value={data.individualDetails?.passNumber || ""}
              onChange={(v) => onChange("individualDetails.passNumber", v)}
            />
          </div>
        )}

        {/* ============ TEMP WORKER ============ */}
        {data.individualType === "tempHiredWorker" && (
          <div className="space-y-4 pt-4">
            <SuggestionInput
              label="Name"
              fieldType="name"
              placeholder="Enter Name"
              value={data.individualDetails?.name || ""}
              onChange={(v) => onChange("individualDetails.name", v)}
            />

            <SuggestionInput
              label="Place Of Stay"
              fieldType="stay"
              placeholder="Enter Place Of Stay"
              value={data.individualDetails?.stay || ""}
              onChange={(v) => onChange("individualDetails.stay", v)}
            />

            <SuggestionInput
              label="Place Of Work"
              fieldType="workPlace"
              placeholder="Enter Place Of Work"
              value={data.individualDetails?.workPlace || ""}
              onChange={(v) => onChange("individualDetails.workPlace", v)}
            />

            <SuggestionInput
              label="Type Of Work"
              fieldType="workType"
              placeholder="Enter Work Type"
              value={data.individualDetails?.workType || ""}
              onChange={(v) => onChange("individualDetails.workType", v)}
            />

            <SuggestionInput
              label="Pass Number"
              fieldType="passNumber"
              placeholder="Enter Pass Number"
              value={data.individualDetails?.passNumber || ""}
              onChange={(v) => onChange("individualDetails.passNumber", v)}
            />
          </div>
        )}

        {/* ============ CIVILIAN ============ */}
        {data.individualType === "civilian" && (
          <div className="space-y-4 pt-4">
            <SuggestionInput
              label="Name"
              fieldType="name"
              placeholder="Enter Name"
              value={data.individualDetails?.name || ""}
              onChange={(v) => onChange("individualDetails.name", v)}
            />

            <SuggestionInput
              label="Aadhar Number"
              fieldType="aadhar"
              placeholder="Enter Aadhar Number"
              value={data.individualDetails?.aadhar || ""}
              onChange={(v) => onChange("individualDetails.aadhar", v)}
            />

            <SuggestionInput
              label="Father / Husband Name"
              fieldType="fatherName"
              placeholder="Enter Name"
              value={data.individualDetails?.fatherName || ""}
              onChange={(v) => onChange("individualDetails.fatherName", v)}
            />

            <SuggestionInput
              label="Address"
              fieldType="address"
              placeholder="Enter Address"
              value={data.individualDetails?.address || ""}
              onChange={(v) => onChange("individualDetails.address", v)}
            />
          </div>
        )}

        {/* ================= VEHICLE SECTION ================= */}
        {!hideFooter && (
          <div className="relative border-t rounded-lg p-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  checked={data.isVehicleInvolved || false}
                  onCheckedChange={(v) => onChange("isVehicleInvolved", v)}
                />
                <span className="text-sm font-medium">
                  Is Vehicle Involved?
                </span>
              </div>
              <h3 className="text-sm ml-6 mt-1 font-medium text-gray-500">
                Yes or No
              </h3>
            </div>

            {data.isVehicleInvolved && (
              <div className="space-y-4">
                <RadioGroup
                  value={data.vehicleType || ""}
                  onValueChange={(v) => onChange("vehicleType", v)}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { id: "civil", label: "Civil Vehicle" },
                    { id: "dd", label: "DD Vehicle" },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className={cn(
                        "flex items-center space-x-2 rounded-md border h-10 px-3 cursor-pointer",
                        data.vehicleType === type.id
                          ? "border-blue-500 bg-gray-50"
                          : "border-gray-200",
                      )}
                    >
                      <RadioGroupItem value={type.id} />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </RadioGroup>

                <div>
                  <Label>Registration No.</Label>
                  <Input
                    value={data.vehicleRegistration || ""}
                    onChange={(e) =>
                      onChange("vehicleRegistration", e.target.value)
                    }
                  />
                </div>

                {/* CO DRIVER */}
                <div>
                  <Checkbox
                    checked={data.coDriverAvailable || false}
                    onCheckedChange={(v) => onChange("coDriverAvailable", v)}
                  />
                  <span className="ml-2">Co-driver Available?</span>
                </div>

                {/* CO DRIVER FORM */}
                {data.coDriverAvailable && (
                  <div className="mt-4 rounded-md">
                    <IndividualVictimDetails
                      hideHeader={true}
                      hideFooter={true}
                      data={
                        data.coDriver || {
                          individualType: "",
                          individualDetails: {},
                        }
                      }
                      onChange={(path, value) =>
                        onChange(`coDriver.${path}`, value)
                      }
                    />
                  </div>
                )}

                {passengers.map((p:any, index:any) => (
                  <div key={index} className="mt-4 border rounded-md p-3">
                    <p className="text-sm font-medium mb-2">
                      Passenger {index + 1}
                    </p>

                    <IndividualVictimDetails
                      hideHeader={true}
                      hideFooter={true}
                      data={p}
                      onChange={(path, value) => {
                        setPassengers((prev:any) =>
                          prev.map((item:any, i:any) =>
                            i === index
                              ? {
                                  ...item,
                                  [path.split(".")[0]]: path.includes(".")
                                    ? {
                                        ...item[path.split(".")[0]],
                                        [path.split(".")[1]]: value,
                                      }
                                    : value,
                                }
                              : item,
                          ),
                        );
                      }}
                    />
                  </div>
                ))}

                {/* ➕ ADD MORE PASSENGERS (ALWAYS VISIBLE) */}
                <div
                  className="text-right text-blue-600 text-sm cursor-pointer mt-2"
                  onClick={() => {
                    setPassengers((prev:any) => [
                      ...prev,
                      {
                        individualType: "",
                        individualDetails: {},
                      },
                    ]);
                  }}
                >
                  + Add More Passengers
                </div>
              </div>
            )}
          </div>
        )}
      </section>

     
    </div>
  );
};