
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "../../FormSection";
import { useForm } from "@/context/FormContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SuggestionInput } from "@/common/component/SuggestionInput";

export default function StaticSpeedStep2() {
  const { state, dispatch } = useForm();

  const staticData = state.formData.staticSpeed;

  const witnesses = staticData.witnesses || [];
  const offence = staticData.offenceOccurenceDetails || {};

  // ---------- UNIVERSAL PATH SETTER ----------
  const set = (path: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path,
      value,
    });

  // ---------- OFFENCE UPDATER ----------
  const updateOffence = (key: string, value: any) =>
    set(`formData.staticSpeed.offenceOccurenceDetails.${key}`, value);

  return (
    <div className="space-y-10">
      {/* ================== ON DUTY DETAILS ================== */}
      <FormSection title="On-Duty Details">
        <p className="text-gray-500 mb-3">
          Enter when and where the witness was on duty while reporting the
          offence.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Date of Duty</Label>
            <Input
              type="date"
              value={offence.dateOfDuty || ""}
              onChange={(e) => updateOffence("dateOfDuty", e.target.value)}
            />
          </div>

          <div>
            <Label>Start Time</Label>
            <Input
              type="time"
              value={offence.startTime || ""}
              onChange={(e) => updateOffence("startTime", e.target.value)}
            />
          </div>

          <div>
            <Label>End Time</Label>
            <Input
              type="time"
              value={offence.endTime || ""}
              onChange={(e) => updateOffence("endTime", e.target.value)}
            />
          </div>
        </div>

        <div>
          <SuggestionInput
            label="Duty Location"
            value={offence.dutyLocation || ""}
            onChange={(v) => updateOffence("dutyLocation", v)}
            fieldType="Duty Location"
          />
        </div>

        <div>
          <SuggestionInput
            label="Duty Type"
            value={offence.dutyType || ""}
            onChange={(v) => updateOffence("dutyType", v)}
            fieldType="Duty Type"
          />
        </div>
      </FormSection>

      {/* ================== MP REPORTING ================== */}
      <FormSection title="On-Duty Details of MP Reporting">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Name of Reporting MP"
            value={offence.nameReportingMP || ""}
            onChange={(e) => updateOffence("nameReportingMP", e.target.value)}
          />

          <SuggestionInput
            placeholder="Select rank"
            value={offence.rank || ""}
            onChange={(v) => updateOffence("rank", v)}
            fieldType="Rank"
            defaultOptions={["L/Nk", "Nk", "Hav", "Subedar"]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <SuggestionInput
            placeholder="Select unit"
            value={offence.unit || ""}
            onChange={(v) => updateOffence("unit", v)}
            fieldType="Unit"
            defaultOptions={["11 Engr Regt", "MP 12", "HQ Unit"]}
          />

          <Input
            placeholder="Army Number"
            value={offence.armyNumber || ""}
            onChange={(e) => updateOffence("armyNumber", e.target.value)}
          />
        </div>
      </FormSection>

      {/* ================== WITNESSING MP ================== */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {witnesses.map((w, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-4 mb-6">
            <Input
              placeholder="Name of Witnessing MP"
              value={w.reportingBlock?.nameReportingMP || ""}
              onChange={(e) => {
                const copy = structuredClone(witnesses);
                copy[index].reportingBlock.nameReportingMP = e.target.value;
                set("formData.staticSpeed.witnesses", copy);
              }}
            />

            <SuggestionInput
              placeholder="Select Rank"
              value={w.reportingBlock?.rank || ""}
              onChange={(v) => {
                const copy = structuredClone(witnesses);
                copy[index].reportingBlock.rank = v;
                set("formData.staticSpeed.witnesses", copy);
              }}
              fieldType="Rank"
              defaultOptions={["L/Nk", "Nk", "Hav", "Subedar"]}
            />

            <SuggestionInput
              placeholder="Select Unit"
              value={w.reportingBlock?.unit || ""}
              onChange={(v) => {
                const copy = structuredClone(witnesses);
                copy[index].reportingBlock.unit = v;
                set("formData.staticSpeed.witnesses", copy);
              }}
              fieldType="Unit"
              defaultOptions={["11 Engr Regt", "MP 12", "HQ Unit"]}
            />

            <Input
              placeholder="Army No."
              value={w.reportingBlock?.armyNumber || ""}
              onChange={(e) => {
                const copy = structuredClone(witnesses);
                copy[index].reportingBlock.armyNumber = e.target.value;
                set("formData.staticSpeed.witnesses", copy);
              }}
            />

            <Input
              placeholder="Contact"
              value={w.reportingBlock?.contactNumber || ""}
              onChange={(e) => {
                const copy = structuredClone(witnesses);
                copy[index].reportingBlock.contactNumber = e.target.value;
                set("formData.staticSpeed.witnesses", copy);
              }}
            />
          </div>
        ))}

        <button
          className="text-blue-600 text-sm"
          onClick={() =>
            set("formData.staticSpeed.witnesses", [
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

      {/* ================== OFFENCE DETAILS ================== */}
      <FormSection title="Offence Occurrence Details">
        <Input
          type="time"
          value={offence.timeOfOffence || ""}
          onChange={(e) => {
            const t = e.target.value; // 17:30
            const today = new Date().toISOString().split("T")[0];
            const iso = `${today}T${t}:00.000Z`;

            updateOffence("timeOfOffence", t);
            updateOffence("time", iso);
          }}
        />

        <SuggestionInput
          placeholder="Incident Location"
          value={offence.incidentLocation || ""}
          onChange={(v) => updateOffence("incidentLocation", v)}
          fieldType="Incident Location"
        />

        <Input
          placeholder="Actual Speed"
          value={offence.actualSpeedNoted || ""}
          onChange={(e) => updateOffence("actualSpeedNoted", e.target.value)}
        />

        <Input
          placeholder="Over Speed"
          value={offence.overSpeedCalculated || ""}
          onChange={(e) => updateOffence("overSpeedCalculated", e.target.value)}
        />

        <Textarea
          placeholder="Full Description"
          value={offence.description || ""}
          onChange={(e) => updateOffence("description", e.target.value)}
        />
      </FormSection>
    </div>
  );
}
