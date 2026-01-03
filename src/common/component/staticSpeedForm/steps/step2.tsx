
"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "../../FormSection";
import { useForm } from "@/context/FormContext";
import { Label } from "@/components/ui/label";
import { SuggestionInput } from "@/common/component/SuggestionInput";

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
        <p className="text-gray-500 -mt-8 mb-3">
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

        <Label className="mt-4 mb-2 font-semibold">Duty Location</Label>
        <SuggestionInput
          placeholder="Duty Location"
          value={duty.dutyLocation || ""}
          onChange={(v) => updateDuty("dutyLocation", v)}
          fieldType="dutyLocation"
        />

        <Label className="mt-3 mb-2 font-semibold">Duty Type</Label>
        <SuggestionInput
          placeholder="Duty Type"
          value={duty.dutyType || ""}
          onChange={(v) => updateDuty("dutyType", v)}
          fieldType="dutyType"
        />
      </FormSection>

      {/* ================== MP REPORTING ================== */}
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
              value={report.nameReportingMP || ""}
              onChange={(e) => updateReport("nameReportingMP", e.target.value)}
            />
          </div>

          {/* ⭐ Rank converted to Suggestion Input ⭐ */}
          <div>
            <Label className="mb-2 font-semibold">Rank</Label>
            <SuggestionInput
              placeholder="Enter Rank"
              value={report.rank || ""}
              onChange={(v) => updateReport("rank", v)}
              fieldType="rank"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* ⭐ Unit converted to Suggestion Input ⭐ */}
          <div>
            <Label className="mb-2 font-semibold">Unit</Label>
            <SuggestionInput
              placeholder="Enter Unit"
              value={report.unit || ""}
              onChange={(v) => updateReport("unit", v)}
              fieldType="unit"
            />
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
            className=" grid grid-cols-2 space-x-4 p-4 rounded-lg space-y-4 mb-6"
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

            {/* ⭐ Rank Suggestion ⭐ */}
            <div>
              <Label className="mb-2 font-semibold">Rank</Label>
              <SuggestionInput
                placeholder="Enter Rank"
                value={w.reportingBlock.rank}
                onChange={(v) => {
                  const copy = structuredClone(witnesses);
                  copy[i].reportingBlock.rank = v;
                  set("formData.staticSpeed.witnesses", copy);
                }}
                fieldType="rank"
              />
            </div>

            {/* ⭐ Unit Suggestion ⭐ */}
            <div>
              <Label className="mb-2 font-semibold">Unit</Label>
              <SuggestionInput
                placeholder="Enter Unit"
                value={w.reportingBlock.unit}
                onChange={(v) => {
                  const copy = structuredClone(witnesses);
                  copy[i].reportingBlock.unit = v;
                  set("formData.staticSpeed.witnesses", copy);
                }}
                fieldType="unit"
              />
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

        <div className="w-full flex justify-end mt-2">
          <button
            className="text-blue-600 text-sm sm:text-base"
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
        </div>
      </FormSection>

      {/* ================== LIVE WITNESS LIST ================== */}
      {witnesses.some(
        (w) =>
          w.reportingBlock?.nameReportingMP ||
          w.reportingBlock?.rank ||
          w.reportingBlock?.unit ||
          w.reportingBlock?.armyNumber
      ) && (
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
      )}

      {/* ================== OFFENCE DETAILS ================== */}
      <FormSection title="Offence Occurrence Details">
        <p className="text-gray-500 mb-3">
          Enter the exact date and time when the incident occurred.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* TIME OF OFFENCE */}
          <div>
            <Label className="mb-2 font-semibold">Time of Offence</Label>
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

          {/* INCIDENT LOCATION */}
          <div>
            <Label className="mb-2 font-semibold">Incident Location</Label>
            <SuggestionInput
              placeholder="Location"
              value={offence.incidentLocation || ""}
              onChange={(v) => updateOffence("incidentLocation", v)}
              fieldType="incidentLocation"
            />
          </div>
        </div>

        {/* AUTH SPEED */}
        <div className="mt-4">
          <Label className="mb-2 font-semibold">Auth Speed</Label>

          <SuggestionInput
            placeholder="Select / Enter Auth Speed"
            value={offence.authSpeed || "30 KMPH"}
            onChange={(v) => updateOffence("authSpeed", v)}
            fieldType="authSpeed"
          />

          <p className="text-xs text-gray-500 mt-1">
            STN Cdr ke adesh ke anusar...
          </p>
        </div>

        {/* SPEED BOXES */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label className="mb-2 font-semibold">Actual Speed Noted</Label>
            <Input
              placeholder="00"
              value={offence.actualSpeedNoted || ""}
              onChange={(e) =>
                updateOffence("actualSpeedNoted", e.target.value)
              }
            />
          </div>

          <div>
            <Label className="mb-2 font-semibold">Over Speed Calculated</Label>
            <Input
              placeholder="00"
              value={offence.overSpeedCalculated || ""}
              onChange={(e) =>
                updateOffence("overSpeedCalculated", e.target.value)
              }
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <Label className="mb-2 font-semibold mt-4">
          Full Description of Offence
        </Label>
        <Textarea
          placeholder="Provide detailed description of the offence , including what happened and how it occured."
          value={offence.description || ""}
          onChange={(e) => updateOffence("description", e.target.value)}
        />
      </FormSection>
    </div>
  );
}