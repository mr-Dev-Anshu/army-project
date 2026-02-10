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

            {/* ===== BETWEEN OPTIONS & FORM TEXT ===== */}
            <div className="pt-4">
              <p className="text-sm font-bold text-gray-900">Fill Details</p>
              <p className="text-xs mt-1 text-gray-500">
                The form will update based on your selection.
              </p>
            </div>
          </div>
        </div>

        {/* ================= CONDITIONAL FORMS ================= */}

        {/* ================= MILITARY ================= */}

        {data.individualType === "militaryPersonnel" && (
          <div className="space-y-4 grid gap-3 grid-cols-2 pt-4">
            <SuggestionInput
              label="Army No."
              placeholder="Enter Army Number"
              fieldType="armyNo"
              value={data.individualDetails?.armyNo || ""}
              onChange={(v) => onChange("individualDetails.armyNo", v)}
            />

            <SuggestionInput
              label="Rank"
              placeholder="Enter Rank"
              fieldType="rank"
              value={data.individualDetails?.rank || ""}
              onChange={(v) => onChange("individualDetails.rank", v)}
            />

            <SuggestionInput
              label="Unit"
              placeholder="Enter Unit"
              fieldType="unit"
              value={data.individualDetails?.unit || ""}
              onChange={(v) => onChange("individualDetails.unit", v)}
            />

            <SuggestionInput
              label="Name"
              placeholder="Enter Name"
              fieldType="name"
              value={data.individualDetails?.name || ""}
              onChange={(v) => onChange("individualDetails.name", v)}
            />

            <SuggestionInput
              label="FMN"
              placeholder="Enter FMN"
              fieldType="fmn"
              value={data.individualDetails?.fmn || ""}
              onChange={(v) => onChange("individualDetails.fmn", v)}
            />

            <SuggestionInput
              label="Command"
              placeholder="Enter Command"
              fieldType="command"
              value={data.individualDetails?.command || ""}
              onChange={(v) => onChange("individualDetails.command", v)}
            />

            <SuggestionInput
              label="Address"
              placeholder="Enter Address"
              fieldType="address"
              value={data.individualDetails?.address || ""}
              onChange={(v) => onChange("individualDetails.address", v)}
            />

            <SuggestionInput
              label="I Card Number"
              placeholder="Enter ID Card Number"
              fieldType="iCard"
              value={data.individualDetails?.iCard || ""}
              onChange={(v) => onChange("individualDetails.iCard", v)}
            />
          </div>
        )}

        {/* ================= EMPLOYEE ================= */}

        {data.individualType === "employee" && (
          <div className="space-y-4 grid gap-3 grid-cols-2 pt-4">
            <SuggestionInput
              label="Employee ID"
              placeholder="Enter Employee ID"
              fieldType="employeeId"
              value={data.individualDetails?.employeeId || ""}
              onChange={(v) => onChange("individualDetails.employeeId", v)}
            />

            <SuggestionInput
              label="Department"
              placeholder="Enter Department"
              fieldType="department"
              value={data.individualDetails?.department || ""}
              onChange={(v) => onChange("individualDetails.department", v)}
            />

            <SuggestionInput
              label="Place of Work"
              placeholder="Enter Place of Work"
              fieldType="workPlace"
              value={data.individualDetails?.workPlace || ""}
              onChange={(v) => onChange("individualDetails.workPlace", v)}
            />

            <SuggestionInput
              label="Place of Stay"
              placeholder="Enter Place of Stay"
              fieldType="stay"
              value={data.individualDetails?.stay || ""}
              onChange={(v) => onChange("individualDetails.stay", v)}
            />

            <SuggestionInput
              label="Pass No."
              placeholder="Enter Pass Number"
              fieldType="passNumber"
              value={data.individualDetails?.passNumber || ""}
              onChange={(v) => onChange("individualDetails.passNumber", v)}
            />

            <SuggestionInput
              label="Pass Issue Date"
              placeholder="Pick Issue Date"
              fieldType="passIssueDate"
              value={data.individualDetails?.passIssueDate || ""}
              onChange={(v) => onChange("individualDetails.passIssueDate", v)}
            />

            <SuggestionInput
              label="Pass Expire Date"
              placeholder="Pick Expire Date"
              fieldType="passExpireDate"
              value={data.individualDetails?.passExpireDate || ""}
              onChange={(v) => onChange("individualDetails.passExpireDate", v)}
            />

            <SuggestionInput
              label="Address"
              placeholder="Enter Address"
              fieldType="address"
              value={data.individualDetails?.address || ""}
              onChange={(v) => onChange("individualDetails.address", v)}
            />
          </div>
        )}

        {/* ================= CIVILIAN ================= */}

        {data.individualType === "civilian" && (
          <div className="space-y-4 grid gap-3 grid-cols-2 pt-4">
            <SuggestionInput
              label="Name"
              placeholder="Enter Name"
              fieldType="name"
              value={data.individualDetails?.name || ""}
              onChange={(v) => onChange("individualDetails.name", v)}
            />

            <SuggestionInput
              label="Address"
              placeholder="Enter Address"
              fieldType="address"
              value={data.individualDetails?.address || ""}
              onChange={(v) => onChange("individualDetails.address", v)}
            />

            <SuggestionInput
              label="Father / Husband Name"
              placeholder="Enter Name"
              fieldType="fatherName"
              value={data.individualDetails?.fatherName || ""}
              onChange={(v) => onChange("individualDetails.fatherName", v)}
            />

            <SuggestionInput
              label="I Card Number"
              placeholder="Enter ID Card Number"
              fieldType="iCard"
              value={data.individualDetails?.iCard || ""}
              onChange={(v) => onChange("individualDetails.iCard", v)}
            />
          </div>
        )}

        {/* ================= SERVANT / MAID ================= */}

        {data.individualType === "servantMaid" && (
          <div className="space-y-4 grid gap-3 grid-cols-2 pt-4">
            <SuggestionInput
              label="Pass Number"
              placeholder="Enter Pass Number"
              fieldType="passNumber"
              value={data.individualDetails?.passNumber || ""}
              onChange={(v) => onChange("individualDetails.passNumber", v)}
            />

            <SuggestionInput
              label="Father Name"
              placeholder="Enter Father Name"
              fieldType="fatherName"
              value={data.individualDetails?.fatherName || ""}
              onChange={(v) => onChange("individualDetails.fatherName", v)}
            />

            <SuggestionInput
              label="Pass ID"
              placeholder="Enter Pass ID"
              fieldType="passId"
              value={data.individualDetails?.passId || ""}
              onChange={(v) => onChange("individualDetails.passId", v)}
            />

            <SuggestionInput
              label="Name"
              placeholder="Enter Name"
              fieldType="name"
              value={data.individualDetails?.name || ""}
              onChange={(v) => onChange("individualDetails.name", v)}
            />

            <SuggestionInput
              label="Trade"
              placeholder="Enter Trade"
              fieldType="trade"
              value={data.individualDetails?.trade || ""}
              onChange={(v) => onChange("individualDetails.trade", v)}
            />

            <SuggestionInput
              label="Quarter No."
              placeholder="Enter Quarter Number"
              fieldType="quarter"
              value={data.individualDetails?.quarter || ""}
              onChange={(v) => onChange("individualDetails.quarter", v)}
            />

            <SuggestionInput
              label="Officer Rank (C/O)"
              placeholder="Enter Officer Rank"
              fieldType="officerRank"
              value={data.individualDetails?.officerRank || ""}
              onChange={(v) => onChange("individualDetails.officerRank", v)}
            />

            <SuggestionInput
              label="Army Official Name"
              placeholder="Enter Army Official Name"
              fieldType="armyOfficialName"
              value={data.individualDetails?.armyOfficialName || ""}
              onChange={(v) =>
                onChange("individualDetails.armyOfficialName", v)
              }
            />

            <SuggestionInput
              label="Place of QTR."
              placeholder="Enter Place of Quarter"
              fieldType="placeOfQuarter"
              value={data.individualDetails?.placeOfQuarter || ""}
              onChange={(v) => onChange("individualDetails.placeOfQuarter", v)}
            />

            <SuggestionInput
              label="Unit"
              placeholder="Enter Unit"
              fieldType="unit"
              value={data.individualDetails?.unit || ""}
              onChange={(v) => onChange("individualDetails.unit", v)}
            />

            <SuggestionInput
              label="FMN"
              placeholder="Enter FMN"
              fieldType="fmn"
              value={data.individualDetails?.fmn || ""}
              onChange={(v) => onChange("individualDetails.fmn", v)}
            />

            <SuggestionInput
              label="Command"
              placeholder="Enter Command"
              fieldType="command"
              value={data.individualDetails?.command || ""}
              onChange={(v) => onChange("individualDetails.command", v)}
            />

            <SuggestionInput
              label="Address"
              placeholder="Enter Address"
              fieldType="address"
              value={data.individualDetails?.address || ""}
              onChange={(v) => onChange("individualDetails.address", v)}
            />

            <SuggestionInput
              label="I Card Number"
              placeholder="Enter ID Card Number"
              fieldType="iCard"
              value={data.individualDetails?.iCard || ""}
              onChange={(v) => onChange("individualDetails.iCard", v)}
            />
          </div>
        )}

        {/* ================= SHOP KEEPER ================= */}

        {data.individualType === "shopKeeper" && (
          <div className="space-y-4 grid gap-3 grid-cols-2 pt-4">
            <SuggestionInput
              label="Shop Owner Name"
              placeholder="Enter Owner Name"
              fieldType="ownerName"
              value={data.individualDetails?.ownerName || ""}
              onChange={(v) => onChange("individualDetails.ownerName", v)}
            />

            <SuggestionInput
              label="Shop Address"
              placeholder="Enter Shop Address"
              fieldType="address"
              value={data.individualDetails?.address || ""}
              onChange={(v) => onChange("individualDetails.address", v)}
            />

            <SuggestionInput
              label="Shop Name"
              placeholder="Enter Shop Name"
              fieldType="shopName"
              value={data.individualDetails?.shopName || ""}
              onChange={(v) => onChange("individualDetails.shopName", v)}
            />

            <SuggestionInput
              label="Unit"
              placeholder="Enter Unit"
              fieldType="unit"
              value={data.individualDetails?.unit || ""}
              onChange={(v) => onChange("individualDetails.unit", v)}
            />

            <SuggestionInput
              label="Pass No."
              placeholder="Enter Pass Number"
              fieldType="passNumber"
              value={data.individualDetails?.passNumber || ""}
              onChange={(v) => onChange("individualDetails.passNumber", v)}
            />

            <SuggestionInput
              label="Pass Issue Date"
              placeholder="Pick Issue Date"
              fieldType="passIssueDate"
              value={data.individualDetails?.passIssueDate || ""}
              onChange={(v) => onChange("individualDetails.passIssueDate", v)}
            />

            <SuggestionInput
              label="Pass Expire Date"
              placeholder="Pick Expire Date"
              fieldType="passExpireDate"
              value={data.individualDetails?.passExpireDate || ""}
              onChange={(v) => onChange("individualDetails.passExpireDate", v)}
            />
          </div>
        )}

        {/* ================= TEMP WORKER ================= */}

        {data.individualType === "tempHiredWorker" && (
          <div className="space-y-4 grid gap-3 grid-cols-2 pt-4">
            <SuggestionInput
              label="Name"
              placeholder="Enter Name"
              fieldType="name"
              value={data.individualDetails?.name || ""}
              onChange={(v) => onChange("individualDetails.name", v)}
            />

            <SuggestionInput
              label="Place of Stay"
              placeholder="Enter Place of Stay"
              fieldType="stay"
              value={data.individualDetails?.stay || ""}
              onChange={(v) => onChange("individualDetails.stay", v)}
            />

            <SuggestionInput
              label="Place of Work"
              placeholder="Enter Place of Work"
              fieldType="workPlace"
              value={data.individualDetails?.workPlace || ""}
              onChange={(v) => onChange("individualDetails.workPlace", v)}
            />

            <SuggestionInput
              label="Type of Work"
              placeholder="Enter Work Type"
              fieldType="workType"
              value={data.individualDetails?.workType || ""}
              onChange={(v) => onChange("individualDetails.workType", v)}
            />

            <SuggestionInput
              label="Pass No."
              placeholder="Enter Pass Number"
              fieldType="passNumber"
              value={data.individualDetails?.passNumber || ""}
              onChange={(v) => onChange("individualDetails.passNumber", v)}
            />

            <SuggestionInput
              label="Pass Issue Date"
              placeholder="Pick Issue Date"
              fieldType="passIssueDate"
              value={data.individualDetails?.passIssueDate || ""}
              onChange={(v) => onChange("individualDetails.passIssueDate", v)}
            />

            <SuggestionInput
              label="Pass Expire Date"
              placeholder="Pick Expire Date"
              fieldType="passExpireDate"
              value={data.individualDetails?.passExpireDate || ""}
              onChange={(v) => onChange("individualDetails.passExpireDate", v)}
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

                {passengers.map((p: any, index: any) => (
                  <div key={index} className="mt-4 border rounded-md p-3">
                    <p className="text-sm font-medium mb-2">
                      Passenger {index + 1}
                    </p>

                    <IndividualVictimDetails
                      hideHeader={true}
                      hideFooter={true}
                      data={p}
                      onChange={(path, value) => {
                        setPassengers((prev: any) =>
                          prev.map((item: any, i: any) =>
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
                    setPassengers((prev: any) => [
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
