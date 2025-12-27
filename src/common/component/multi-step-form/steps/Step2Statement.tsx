
"use client";

import { Input } from "@/components/ui/input";
import { FormSection } from "../../FormSection";
import { useForm } from "@/context/FormContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { FormTextarea } from "../../FormTextarea";
import { FormInput } from "../../FormInput";

export default function Step2Statement() {
  const { state, dispatch } = useForm();
  const d = state.formData.traffic;

  const set = (path: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path,
      value,
    });

  // ✅ Always keep at least 1 witness UI visible
  const witnesses =
    d.witnesses.length > 0
      ? d.witnesses
      : [
          {
            reportingBlock: {
              nameReportingMP: "",
              rank: "",
              unit: "",
              armyNumber: "",
              contactNumber: "",
            },
          },
        ];

  const hasFilledWitness = witnesses.some((w) => {
    const r = w.reportingBlock;
    return r.nameReportingMP || r.rank || r.unit || r.armyNumber;
  });

  return (
    <div className="space-y-10">

      {/* ---------------- ON DUTY DETAILS ---------------- */}
      <FormSection title="On-Duty Details">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="mb-2 font-semibold">Date of Duty</Label>
            <Input
              type="date"
              value={d.onDutyDetails.dateOfDuty}
              onChange={(e) =>
                set("formData.traffic.onDutyDetails.dateOfDuty", e.target.value)
              }
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold">Start Time</Label>
            <Input
              type="time"
              value={d.onDutyDetails.startTime}
              onChange={(e) =>
                set("formData.traffic.onDutyDetails.startTime", e.target.value)
              }
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold">End Time</Label>
            <Input
              type="time"
              value={d.onDutyDetails.endTime}
              onChange={(e) =>
                set("formData.traffic.onDutyDetails.endTime", e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 font-semibold">Duty Location</Label>
          <Input
            placeholder="Duty Location"
            value={d.onDutyDetails.dutyLocation}
            onChange={(e) =>
              set("formData.traffic.onDutyDetails.dutyLocation", e.target.value)
            }
          />
        </div>

        <div>
          <Label className="mb-2 font-semibold">Duty Type</Label>
          <Input
            placeholder="Duty Type"
            value={d.onDutyDetails.dutyType}
            onChange={(e) =>
              set("formData.traffic.onDutyDetails.dutyType", e.target.value)
            }
          />
        </div>
      </FormSection>

      {/* ---------------- REPORTING MP ---------------- */}
      <FormSection title="On-Duty Details of MP Reporting">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 font-semibold">Reporting MP Name</Label>
            <Input
              placeholder="Reporting MP Name"
              value={d.onDutyDetailsMPReporting.nameReportingMP}
              onChange={(e) =>
                set(
                  "formData.traffic.onDutyDetailsMPReporting.nameReportingMP",
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold">Rank</Label>
            <Select
              value={d.onDutyDetailsMPReporting.rank}
              onValueChange={(v) =>
                set("formData.traffic.onDutyDetailsMPReporting.rank", v)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Rank" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                <SelectItem value="Captain">Captain</SelectItem>
                <SelectItem value="Major">Major</SelectItem>
                <SelectItem value="Colonel">Colonel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 font-semibold">Unit</Label>
            <Select
              value={d.onDutyDetailsMPReporting.unit}
              onValueChange={(v) =>
                set("formData.traffic.onDutyDetailsMPReporting.unit", v)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MP Unit 12">MP Unit 12</SelectItem>
                <SelectItem value="Unit 2">Unit 2</SelectItem>
                <SelectItem value="Unit 3">Unit 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 font-semibold">Army Number</Label>
            <Input
              placeholder="Army No."
              value={d.onDutyDetailsMPReporting.armyNumber}
              onChange={(e) =>
                set(
                  "formData.traffic.onDutyDetailsMPReporting.armyNumber",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </FormSection>

      {/* ================== WITNESSING MP ================== */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {witnesses.map((w, index) => (
          <div key={index} className="border p-5 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Name of Witnessing MP</Label>
                <Input
                  placeholder="Name of Witnessing MP"
                  value={w.reportingBlock?.nameReportingMP || ""}
                  onChange={(e) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.nameReportingMP =
                      e.target.value;
                    set("formData.traffic.witnesses", copy);
                  }}
                />
              </div>

              <div>
                <Label className="mb-2 block">Rank</Label>
                <Select
                  value={w.reportingBlock?.rank || ""}
                  onValueChange={(v) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.rank = v;
                    set("formData.traffic.witnesses", copy);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Rank" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="L/Nk">L/Nk</SelectItem>
                    <SelectItem value="Nk">Nk</SelectItem>
                    <SelectItem value="Hav">Hav</SelectItem>
                    <SelectItem value="Subedar">Subedar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Unit</Label>
                <Select
                  value={w.reportingBlock?.unit || ""}
                  onValueChange={(v) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.unit = v;
                    set("formData.traffic.witnesses", copy);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="11 Engr Regt">11 Engr Regt</SelectItem>
                    <SelectItem value="MP 12">MP 12</SelectItem>
                    <SelectItem value="HQ Unit">HQ Unit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Army Number</Label>
                <Input
                  placeholder="Army No."
                  value={w.reportingBlock?.armyNumber || ""}
                  onChange={(e) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.armyNumber = e.target.value;
                    set("formData.traffic.witnesses", copy);
                  }}
                />
              </div>

              <div>
                <Label className="mb-2 block">Contact Number</Label>
                <Input
                  placeholder="Contact Number"
                  value={w.reportingBlock?.contactNumber || ""}
                  onChange={(e) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.contactNumber = e.target.value;
                    set("formData.traffic.witnesses", copy);
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          className="text-blue-600 text-sm"
          onClick={() =>
            set("formData.traffic.witnesses", [
              ...witnesses,
              {
                reportingBlock: {
                  nameReportingMP: "",
                  rank: "",
                  unit: "",
                  armyNumber: "",
                  contactNumber: "",
                },
              },
            ])
          }
        >
          + Add More Witness
        </button>
      </FormSection>

      {/* ================== OFFENCE OCCURRENCE DETAILS ================== */}
      <FormSection title="Offence Occurrence Details">
        <p className="text-gray-500">
          Enter the exact date and time when the incident occurred.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormInput
            label="Time of Offence"
            type="time"
            value={d.offenceOccurenceDetails.timeOfOffence}
            onChange={(v) =>
              set("formData.traffic.offenceOccurenceDetails.timeOfOffence", v)
            }
          />

          <FormInput
            label="Place Of Offence"
            placeholder="Location"
            value={d.offenceOccurenceDetails.incidentLocation}
            onChange={(v) =>
              set(
                "formData.traffic.offenceOccurenceDetails.incidentLocation",
                v
              )
            }
          />
        </div>

        <div className="mt-4">
          <FormTextarea
            label="Full Description of Offence"
            description="Provide a detailed description of the offence."
            value={d.offenceOccurenceDetails.description}
            onChange={(v) =>
              set("formData.traffic.offenceOccurenceDetails.description", v)
            }
          />
        </div>
      </FormSection>
    </div>
  );
}
