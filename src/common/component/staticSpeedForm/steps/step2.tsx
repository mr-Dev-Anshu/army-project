"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "../../FormSection";
import { useForm } from "@/context/FormContext";
import { Label } from "@/components/ui/label";
import { SuggestionInput } from "@/common/component/SuggestionInput";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function StaticSpeedStep2() {
  const { state, dispatch } = useForm();

  const staticData = state.formData.staticSpeed;

  const duty = staticData.dutyBlock || {};
  const report = staticData.reportingBlock || {};
  const offence = staticData.offenceBlock || {};

  // ALWAYS SHOW AT LEAST 1 WITNESS
  const witnesses =
    staticData.witnesses?.length > 0
      ? staticData.witnesses
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

  const set = (path: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path,
      value,
    });

  const updateDuty = (k: string, v: any) =>
    set(`formData.staticSpeed.dutyBlock.${k}`, v);
  const updateReport = (k: string, v: any) =>
    set(`formData.staticSpeed.reportingBlock.${k}`, v);
  const updateOffence = (k: string, v: any) =>
    set(`formData.staticSpeed.offenceBlock.${k}`, v);

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
            <Label className="mb-2 font-semibold">Date of Duty</Label>
            <Input
              type="date"
              value={duty.dateOfDuty || ""}
              onChange={(e) => updateDuty("dateOfDuty", e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold">Start Time</Label>
            <Input
              type="time"
              value={duty.startTime || ""}
              onChange={(e) => updateDuty("startTime", e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold">End Time</Label>
            <Input
              type="time"
              value={duty.endTime || ""}
              onChange={(e) => updateDuty("endTime", e.target.value)}
            />
          </div>
        </div>

        <Label className="mt-3 font-semibold">Duty Location</Label>
        <SuggestionInput
          placeholder="Duty Location"
          value={duty.dutyLocation || ""}
          onChange={(v) => updateDuty("dutyLocation", v)}
          fieldType="dutyLocation"
        />

        <Label className="mt-3 font-semibold">Duty Type</Label>
        <SuggestionInput
          placeholder="Duty Type"
          value={duty.dutyType || ""}
          onChange={(v) => updateDuty("dutyType", v)}
          fieldType="dutyType"
        />
      </FormSection>

      {/* ================== MP REPORTING ================== */}
      <FormSection title="On-Duty Details of MP Reporting">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 font-semibold">Reporting MP Name</Label>
            <Input
              placeholder="Reporting MP Name"
              value={report.nameReportingMP || ""}
              onChange={(e) => updateReport("nameReportingMP", e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold">Rank</Label>
            <Select
              value={report.rank || ""}
              onValueChange={(v) => updateReport("rank", v)}
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
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label className="mb-2 font-semibold">Unit</Label>
            <Select
              value={report.unit || ""}
              onValueChange={(v) => updateReport("unit", v)}
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
              placeholder="Army Number"
              value={report.armyNumber || ""}
              onChange={(e) => updateReport("armyNumber", e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      {/* ================== WITNESSING MP ================== */}
      <FormSection title="On-Duty Details of Witnessing MP">
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
                  set("formData.staticSpeed.witnesses", copy);
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
                  set("formData.staticSpeed.witnesses", copy);
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
                  set("formData.staticSpeed.witnesses", copy);
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
                  set("formData.staticSpeed.witnesses", copy);
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
                  set("formData.staticSpeed.witnesses", copy);
                }}
              />
            </div>
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

      {/* ================== LIVE WITNESS LIST ================== */}
      <FormSection title="List of On-Duty Details of Witnessing MP - Select One for Signature">
        <div className="text-sm text-gray-500 mb-2">
          List of Witnesses, choose one for Signature Proof
        </div>

        <div>
          {witnesses
            .filter(
              (w) =>
                w.reportingBlock?.nameReportingMP ||
                w.reportingBlock?.rank ||
                w.reportingBlock?.unit ||
                w.reportingBlock?.armyNumber
            )
            .map((w, index) => {
              const data = w.reportingBlock;

              return (
                <label
                  key={index}
                  className="border rounded-md p-4 flex gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="selectedWitness"
                    checked={staticData.selectedWitness === index}
                    onChange={() =>
                      set("formData.staticSpeed.selectedWitness", index)
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
        </div>
      </FormSection>

      {/* ================== OFFENCE DETAILS ================== */}
      <FormSection title="Offence Occurrence Details">
        <div className="grid grid-cols-2 space-x-4">
          <div>
            <div>
              <Label className="mb-4 font-semibold">Time of Offence</Label>
              <Input
                type="time"
                value={offence.timeOfOffence || ""}
                onChange={(e) => {
                  const t = e.target.value;
                  const today = new Date().toISOString().split("T")[0];
                  const iso = `${today}T${t}:00.000Z`;

                  updateOffence("timeOfOffence", t);
                  updateOffence("time", iso);
                }}
              />
            </div>
          </div>
          <div>
            <Label className="mb-2 font-semibold mt-2">Incident Location</Label>
            <SuggestionInput
              placeholder="Incident Location"
              value={offence.incidentLocation || ""}
              onChange={(v) => updateOffence("incidentLocation", v)}
              fieldType="incidentLocation"
            />
          </div>
          <div>
            <Label className="mb-2 font-semibold mt-2">Actual Speed</Label>
            <Input
              placeholder="Actual Speed"
              value={offence.actualSpeed || offence.actualSpeedNoted || ""}
              onChange={(e) => {
                updateOffence("actualSpeed", e.target.value);
                updateOffence("actualSpeedNoted", e.target.value);
              }}
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold mt-2">Over Speed</Label>
            <Input
              placeholder="Over Speed"
              value={offence.overSpeed || offence.overSpeedCalculated || ""}
              onChange={(e) => {
                updateOffence("overSpeed", e.target.value);
                updateOffence("overSpeedCalculated", e.target.value);
              }}
            />
          </div>
        </div>

        <Label className="mb-2 font-semibold mt-2">
          Description of Offence
        </Label>
        <Textarea
          placeholder="Full Description"
          value={offence.description2 || ""}
          onChange={(e) => updateOffence("description2", e.target.value)}
        />
      </FormSection>
    </div>
  );
}
