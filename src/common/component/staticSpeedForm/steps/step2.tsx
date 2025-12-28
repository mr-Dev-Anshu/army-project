


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
  const duty = staticData.dutyBlock || {};
  const report = staticData.reportingBlock || {};
  const offence = staticData.offenceBlock || {};

  const set = (path: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path,
      value,
    });

  const updateDuty = (key: string, value: any) =>
    set(`formData.staticSpeed.dutyBlock.${key}`, value);

  const updateReport = (key: string, value: any) =>
    set(`formData.staticSpeed.reportingBlock.${key}`, value);

  const updateOffence = (key: string, value: any) =>
    set(`formData.staticSpeed.offenceBlock.${key}`, value);

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
              value={duty.dateOfDuty || ""}
              onChange={(e) => updateDuty("dateOfDuty", e.target.value)}
            />
          </div>

          <div>
            <Label>Start Time</Label>
            <Input
              type="time"
              value={duty.startTime || ""}
              onChange={(e) => updateDuty("startTime", e.target.value)}
            />
          </div>

          <div>
            <Label>End Time</Label>
            <Input
              type="time"
              value={duty.endTime || ""}
              onChange={(e) => updateDuty("endTime", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Duty Location</Label>
          <Input
            value={duty.dutyLocation || ""}
            onChange={(e) => updateDuty("dutyLocation", e.target.value)}
          />
        </div>

        <div>
          <Label>Duty Type</Label>
          <Input
            value={duty.dutyType || ""}
            onChange={(e) => updateDuty("dutyType", e.target.value)}
          />
        </div>
      </FormSection>

      {/* ================== MP REPORTING ================== */}
      <FormSection title="On-Duty Details of MP Reporting">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Name of Reporting MP"
            value={report.nameReportingMP || ""}
            onChange={(e) =>
              updateReport("nameReportingMP", e.target.value)
            }
          />

          <Select
            value={report.rank || ""}
            onValueChange={(v) => updateReport("rank", v)}
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
            value={report.unit || ""}
            onValueChange={(v) => updateReport("unit", v)}
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
            value={report.armyNumber || ""}
            onChange={(e) => updateReport("armyNumber", e.target.value)}
          />
        </div>
      </FormSection>

      {/* ================== WITNESSING MP ================== */}
      {/* your same witnesses code stays as it is (already correct) */}

      {/* ================== OFFENCE DETAILS ================== */}
      <FormSection title="Offence Occurrence Details">
        <div className="grid grid-cols-2 space-x-4">
          <div className="mb-4">
            <Label className="mb-3">Time of Offence</Label>
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
