"use client";

import { Input } from "@/components/ui/input";
import { FormSection } from "../../FormSection";
import { useForm } from "@/context/FormContext";
import { Label } from "@radix-ui/react-label";
import { FormTextarea } from "../../FormTextarea";
import { FormInput } from "../../FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Step2Statement() {
  const { state, dispatch } = useForm();
  const d = state.formData.traffic;

  const set = (path: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path,
      value,
    });

  const witnesses =
    Array.isArray(d?.witnesses) && d.witnesses.length > 0
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
      {/* ================== ON DUTY DETAILS ================== */}
      <FormSection title="On-Duty Details">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="mb-2 font-semibold">Date of Duty</Label>
            <Input
              type="date"
              value={d.onDutyDetails?.dateOfDuty}
              onChange={(e) =>
                set("formData.traffic.onDutyDetails.dateOfDuty", e.target.value)
              }
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold">Start Time</Label>
            <Input
              type="time"
              value={d.onDutyDetails?.startTime}
              onChange={(e) =>
                set("formData.traffic.onDutyDetails.startTime", e.target.value)
              }
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold">End Time</Label>
            <Input
              type="time"
              value={d.onDutyDetails?.endTime}
              onChange={(e) =>
                set("formData.traffic.onDutyDetails.endTime", e.target.value)
              }
            />
          </div>
        </div>

        <Label className="mt-3 font-semibold">Duty Location</Label>
        <SuggestionInput
          placeholder="Duty Location"
          value={d.onDutyDetails.dutyLocation}
          onChange={(v) =>
            set("formData.traffic.onDutyDetails.dutyLocation", v)
          }
          fieldType="dutyLocation"
        />

        <Label className="mt-3 font-semibold">Duty Type</Label>
        <SuggestionInput
          placeholder="Duty Type"
          value={d.onDutyDetails.dutyType}
          onChange={(v) => set("formData.traffic.onDutyDetails.dutyType", v)}
          fieldType="dutyType"
        />
      </FormSection>

      {/* ================= MP REPORTING ================= */}
      <FormSection
        title={
          <>
            On-Duty Details of{" "}
            <span className="text-blue-500">MP Reporting</span>
          </>
        }
      >
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

        <div className="grid grid-cols-2 gap-4 mt-4">
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

      {/* ================= WITNESSING MP ================= */}
      <FormSection
        title={
          <>
            On-Duty Details of{" "}
            <span className="text-blue-500">MP Witnessing</span>
          </>
        }
      >
        {witnesses.map((w, i) => (
          <div
            key={i}
            className="border grid grid-cols-2 space-x-4 p-4 rounded-lg space-y-4 mb-6"
          >
            <div>
              <Label className="mb-2 font-semibold">Witnessing MP Name</Label>
              <Input
                placeholder="Name of Witnessing MP"
                value={w.reportingBlock.nameReportingMP}
                onChange={(e) => {
                  const copy = structuredClone(witnesses);
                  copy[i].reportingBlock.nameReportingMP = e.target.value;
                  set("formData.traffic.witnesses", copy);
                }}
              />
            </div>

            <div>
              <Label className="mb-2 font-semibold">Rank</Label>
              <Select
                value={w.reportingBlock.rank}
                onValueChange={(v) => {
                  const copy = structuredClone(witnesses);
                  copy[i].reportingBlock.rank = v;
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
              <Label className="mb-2 font-semibold">Unit</Label>
              <Select
                value={w.reportingBlock.unit}
                onValueChange={(v) => {
                  const copy = structuredClone(witnesses);
                  copy[i].reportingBlock.unit = v;
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
              <Label className="mb-2 font-semibold">Army Number</Label>
              <Input
                placeholder="Army No."
                value={w.reportingBlock.armyNumber}
                onChange={(e) => {
                  const copy = structuredClone(witnesses);
                  copy[i].reportingBlock.armyNumber = e.target.value;
                  set("formData.traffic.witnesses", copy);
                }}
              />
            </div>

            <div>
              <Label className="mb-2 font-semibold">Contact Number</Label>
              <Input
                placeholder="Contact Number"
                value={w.reportingBlock.contactNumber || ""}
                onChange={(e) => {
                  const copy = structuredClone(witnesses);
                  copy[i].reportingBlock.contactNumber = e.target.value;
                  set("formData.traffic.witnesses", copy);
                }}
              />
            </div>
          </div>
        ))}

        <div className="w-full flex justify-end mt-2">
          <button
            className="text-blue-600 text-sm sm:text-base"
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
        </div>
      </FormSection>

      {/* ================== LIVE WITNESS LIST ================== */}
      {hasFilledWitness && (
        <FormSection title="List of On-Duty Details of Witnessing MP - Select One for Signature">
          <div className="text-sm text-gray-500 mb-2">
            List of Witnesses, choose one for Signature Proof
          </div>

          {witnesses
            .filter((w) => {
              const r = w.reportingBlock;
              return r.nameReportingMP || r.rank || r.unit || r.armyNumber;
            })
            .map((w, index) => {
              const data = w.reportingBlock;

              return (
                <label
                  key={index}
                  className="border rounded-md p-4 mb-3 flex gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="selectedWitnessTraffic"
                    checked={d.selectedWitness === index}
                    onChange={() =>
                      set("formData.traffic.selectedWitness", index)
                    }
                  />

                  <div className="w-full grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {data.nameReportingMP || "—"}
                      </p>
                      <p>
                        <span className="font-semibold">Unit:</span>{" "}
                        {data.unit || "—"}
                      </p>
                    </div>

                    <div>
                      <p>
                        <span className="font-semibold">Rank:</span>{" "}
                        {data.rank || "—"}
                      </p>
                      <p>
                        <span className="font-semibold">Army no.:</span>{" "}
                        {data.armyNumber || "—"}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
        </FormSection>
      )}

      {/* ================= OFFENCE OCCURRENCE ================= */}
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

          <SuggestionInput
            label="Place Of Offence"
            placeholder="Location"
            value={d.offenceOccurenceDetails.incidentLocation}
            onChange={(v) =>
              set(
                "formData.traffic.offenceOccurenceDetails.incidentLocation",
                v
              )
            }
            fieldType="incidentLocation"
          />
        </div>

        <div className="mt-4">
          <FormTextarea
            label="Full Description of Offence"
            description="Provide a detailed description of the offence."
            value={d.offenceOccurenceDetails.description2}
            onChange={(v) =>
              set("formData.traffic.offenceOccurenceDetails.description2", v)
            }
          />
        </div>
      </FormSection>
    </div>
  );
}
