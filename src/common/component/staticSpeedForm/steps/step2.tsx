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
          <Label>Duty Location</Label>
          <Input
            value={offence.dutyLocation || ""}
            onChange={(e) => updateOffence("dutyLocation", e.target.value)}
          />
        </div>

        <div>
          <Label>Duty Type</Label>
          <Input
            value={offence.dutyType || ""}
            onChange={(e) => updateOffence("dutyType", e.target.value)}
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

          <Select
            value={offence.rank || ""}
            onValueChange={(v) => updateOffence("rank", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select rank" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="L/Nk">L/Nk</SelectItem>
              <SelectItem value="Nk">Nk</SelectItem>
              <SelectItem value="Hav">Hav</SelectItem>
              <SelectItem value="Subedar">Subedar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select
            value={offence.unit || ""}
            onValueChange={(v) => updateOffence("unit", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="11 Engr Regt">11 Engr Regt</SelectItem>
              <SelectItem value="MP 12">MP 12</SelectItem>
              <SelectItem value="HQ Unit">HQ Unit</SelectItem>
            </SelectContent>
          </Select>

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
          <div key={index} className="border p-5 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-6">
              {/* NAME */}
              <div>
                <Label className="mb-2 block">Name of Witnessing MP</Label>
                <Input
                  placeholder="Name of Witnessing MP"
                  value={w.reportingBlock?.nameReportingMP || ""}
                  onChange={(e) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.nameReportingMP = e.target.value;
                    set("formData.staticSpeed.witnesses", copy);
                  }}
                />
              </div>

              {/* RANK */}
              <div>
                <Label className="mb-2 block">Rank</Label>
                <Select
                  value={w.reportingBlock?.rank || ""}
                  onValueChange={(v) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.rank = v;
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

              {/* UNIT */}
              <div>
                <Label className="mb-2 block">Unit</Label>
                <Select
                  value={w.reportingBlock?.unit || ""}
                  onValueChange={(v) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.unit = v;
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

              {/* ARMY NUMBER */}
              <div>
                <Label className="mb-2 block">Army Number</Label>
                <Input
                  placeholder="Army No."
                  value={w.reportingBlock?.armyNumber || ""}
                  onChange={(e) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.armyNumber = e.target.value;
                    set("formData.staticSpeed.witnesses", copy);
                  }}
                />
              </div>

              {/* CONTACT */}
              <div>
                <Label className="mb-2 block">Contact Number</Label>
                <Input
                  placeholder="Contact Number"
                  value={w.reportingBlock?.contactNumber || ""}
                  onChange={(e) => {
                    const copy = structuredClone(witnesses);
                    copy[index].reportingBlock.contactNumber = e.target.value;
                    set("formData.staticSpeed.witnesses", copy);
                  }}
                />
              </div>
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

      {/* ================== OFFENCE DETAILS ================== */}
      <FormSection title="Offence Occurrence Details">
        <div className="grid grid-cols-2 space-x-4">
          <div className="mb-4">
            <Label className="mb-3">Time of Offence</Label>
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
          </div>

          <div>
            <Label className="mb-3">Incident Location</Label>
            <Input
              placeholder="Incident Location"
              value={offence.incidentLocation || ""}
              onChange={(e) =>
                updateOffence("incidentLocation", e.target.value)
              }
            />
          </div>

          <div>
            <Label className="mb-3">Speed Details</Label>
            <Input
              placeholder="Actual Speed"
              value={offence.actualSpeed || ""}
              onChange={(e) => updateOffence("actualSpeed", e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-3">Over Speed</Label>
            <Input
              placeholder="Over Speed"
              value={offence.overSpeed || ""}
              onChange={(e) => updateOffence("overSpeed", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="mb-3">Description of Offence</Label>
          <Textarea
            placeholder="Full Description"
            value={offence.description || ""}
            onChange={(e) => updateOffence("description", e.target.value)}
          />
        </div>
      </FormSection>
    </div>
  );
}
