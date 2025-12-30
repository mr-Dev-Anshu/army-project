
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
import { SuggestionInput } from "@/common/component/SuggestionInput";

export default function Step2Statement() {
  const { state, dispatch } = useForm();
  const d = state.formData.traffic;

  const set = (path: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path,
      value,
    });

  const hasFilledWitness = d.witnesses.some((w) => {
    const r = w.reportingBlock;
    return r.nameReportingMP || r.rank || r.unit || r.armyNumber;
  });

  return (
    <div className="space-y-10">
      {/* ---------------- ON DUTY DETAILS ---------------- */}
      <FormSection title="On-Duty Details">
        <div className="grid grid-cols-3 gap-4">
          <Input
            type="date"
            value={d.onDutyDetails.dateOfDuty}
            onChange={(e) =>
              set("formData.traffic.onDutyDetails.dateOfDuty", e.target.value)
            }
          />

          <Input
            type="time"
            value={d.onDutyDetails.startTime}
            onChange={(e) =>
              set("formData.traffic.onDutyDetails.startTime", e.target.value)
            }
          />

          <Input
            type="time"
            value={d.onDutyDetails.endTime}
            onChange={(e) =>
              set("formData.traffic.onDutyDetails.endTime", e.target.value)
            }
          />
        </div>

        <SuggestionInput
          placeholder="Duty Location"
          value={d.onDutyDetails.dutyLocation}
          onChange={(v) =>
            set(
              "formData.traffic.onDutyDetails.dutyLocation",
              v
            )
          }
          fieldType="dutyLocation"
        />

        <SuggestionInput
          placeholder="Duty Type"
          value={d.onDutyDetails.dutyType}
          onChange={(v) =>
            set("formData.traffic.onDutyDetails.dutyType", v)
          }
          fieldType="dutyType"
        />
      </FormSection>

      {/* ---------------- REPORTING MP ---------------- */}
      <FormSection title="On-Duty Details of MP Reporting">
        <div className="grid grid-cols-2 gap-4">
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

          <SuggestionInput
            placeholder="Select Rank"
            value={d.onDutyDetailsMPReporting.rank}
            onChange={(v) =>
              set("formData.traffic.onDutyDetailsMPReporting.rank", v)
            }
            fieldType="rank"
            defaultOptions={["Lieutenant", "Captain", "Major", "Colonel"]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SuggestionInput
            placeholder="Select Unit"
            value={d.onDutyDetailsMPReporting.unit}
            onChange={(v) =>
              set("formData.traffic.onDutyDetailsMPReporting.unit", v)
            }
            fieldType="unit"
            defaultOptions={["MP Unit 12", "Unit 2", "Unit 3"]}
          />

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
      </FormSection>

      {/* ---------------- WITNESSING MP ---------------- */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {d.witnesses.map((w, i) => (
          <div key={i} className="border p-4 rounded-lg space-y-4 mb-6">

            {/* Name */}
            <Input
              placeholder="Name of Witnessing MP"
              value={w.reportingBlock.nameReportingMP}
              onChange={(e) => {
                const clone = structuredClone(d.witnesses);
                clone[i].reportingBlock.nameReportingMP = e.target.value;
                set("formData.traffic.witnesses", clone);
              }}
            />

            {/* Rank */}
            <SuggestionInput
              placeholder="Select Rank"
              value={w.reportingBlock.rank}
              onChange={(v) => {
                const clone = structuredClone(d.witnesses);
                clone[i].reportingBlock.rank = v;
                set("formData.traffic.witnesses", clone);
              }}
              fieldType="rank"
              defaultOptions={["L/Nk", "Nk", "Hav", "Subedar"]}
            />

            {/* ✅ REQUIRED FIELD — UNIT */}
            <SuggestionInput
              placeholder="Select Unit"
              value={w.reportingBlock.unit}
              onChange={(v) => {
                const clone = structuredClone(d.witnesses);
                clone[i].reportingBlock.unit = v;
                set("formData.traffic.witnesses", clone);
              }}
              fieldType="unit"
              defaultOptions={["11 Engr Regt", "MP 12", "HQ Unit"]}
            />

            {/* Army Number */}
            <Input
              placeholder="Army No."
              value={w.reportingBlock.armyNumber}
              onChange={(e) => {
                const clone = structuredClone(d.witnesses);
                clone[i].reportingBlock.armyNumber = e.target.value;
                set("formData.traffic.witnesses", clone);
              }}
            />

            {/* Contact */}
            <Input
              placeholder="Contact Number"
              value={w.reportingBlock.contactNumber || ""}
              onChange={(e) => {
                const clone = structuredClone(d.witnesses);
                clone[i].reportingBlock.contactNumber = e.target.value;
                set("formData.traffic.witnesses", clone);
              }}
            />
          </div>
        ))}
      </FormSection>


      {/* ================= WITNESS SELECTION LIST ================= */}
      {hasFilledWitness && (
        <div className="p-6 rounded-lg">
          <p className="mb-3 font-semibold">
            List of Witnesses, choose one for Signature Proof
          </p>

          <div className="bg-white rounded-lg p-5 space-y-4">
            {d.witnesses.map((w, index) => {
              const r = w.reportingBlock;

              if (!r.nameReportingMP && !r.rank && !r.unit && !r.armyNumber)
                return null;

              const isSelected =
                d.selectedWitness?.armyNumber === r.armyNumber;

              return (
                <div
                  key={index}
                  className="flex gap-4 items-start border rounded-lg p-4"
                >
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() =>
                      set("formData.traffic.selectedWitness", r)
                    }
                  />

                  <div className="w-full flex justify-between">
                    <div>
                      <p>
                        <b>Name:</b> {r.nameReportingMP}
                      </p>
                      <p>
                        <b>Unit:</b> {r.unit}
                      </p>
                    </div>

                    <div>
                      <p>
                        <b>Rank:</b> {r.rank}
                      </p>
                      <p>
                        <b>Army no.:</b> {r.armyNumber}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              set(
                "formData.traffic.offenceOccurenceDetails.timeOfOffence",
                v
              )
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
            value={d.offenceOccurenceDetails.description}
            onChange={(v) =>
              set(
                "formData.traffic.offenceOccurenceDetails.description",
                v
              )
            }
          />
        </div>
      </FormSection>
    </div>
  );
}
