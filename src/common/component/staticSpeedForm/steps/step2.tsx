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

  // ---------- UPDATE OFFENCE ----------
  const updateOffence = (value: any) => {
    dispatch({
      type: "SET_STATIC_SPEED_DATA",
      payload: {
        offenceOccurenceDetails: {
          ...offence,
          ...value,
        },
      },
    });
  };

  return (
    <div className="space-y-10">
      {/* ================== ON DUTY DETAILS ================== */}
      <FormSection title="On-Duty Details">
        <p className="text-gray-500 mb-3">
          Enter when and where the witness was on duty while reporting the
          offence.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <Input placeholder="Pick a date" />
          <Input type="time" defaultValue={"06:00"} />
          <Input type="time" defaultValue={"13:30"} />
        </div>

        <Input placeholder="Duty Location" className="mt-4" />
        <Input placeholder="Duty Type" className="mt-2" />
      </FormSection>

      {/* ================== MP REPORTING ================== */}
      <FormSection title="On-Duty Details of MP Reporting">
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Name of Reporting MP" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L/Nk">L/Nk</SelectItem>
              <SelectItem value="Nk">Nk</SelectItem>
              <SelectItem value="Hav">Hav</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="11 Engr Regt">11 Engr Regt</SelectItem>
              <SelectItem value="MP 12">MP 12</SelectItem>
              <SelectItem value="HQ Unit">HQ Unit</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Army Number" />
        </div>
      </FormSection>

      {/* ================== WITNESSING MP ================== */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {witnesses.map((witness, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Name of Witnessing MP"
                value={witness.reportingBlock?.nameReportingMP}
                onChange={(e) =>
                  dispatch({
                    type: "SET_STATIC_WITNESSES",
                    payload: witnesses.map((w, i) =>
                      i === index
                        ? {
                            ...w,
                            reportingBlock: {
                              ...w.reportingBlock,
                              nameReportingMP: e.target.value,
                            },
                          }
                        : w
                    ),
                  })
                }
              />

              <Select
                value={witness.reportingBlock?.rank}
                onValueChange={(v) =>
                  dispatch({
                    type: "SET_STATIC_WITNESSES",
                    payload: witnesses.map((w, i) =>
                      i === index
                        ? {
                            ...w,
                            reportingBlock: { ...w.reportingBlock, rank: v },
                          }
                        : w
                    ),
                  })
                }
              >
                <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4">
              <Select
                value={witness.reportingBlock?.unit}
                onValueChange={(v) =>
                  dispatch({
                    type: "SET_STATIC_WITNESSES",
                    payload: witnesses.map((w, i) =>
                      i === index
                        ? {
                            ...w,
                            reportingBlock: { ...w.reportingBlock, unit: v },
                          }
                        : w
                    ),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11 Engr Regt">11 Engr Regt</SelectItem>
                  <SelectItem value="MP 12">MP 12</SelectItem>
                  <SelectItem value="HQ Unit">HQ Unit</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Army No."
                value={witness.reportingBlock?.armyNumber}
                onChange={(e) =>
                  dispatch({
                    type: "SET_STATIC_WITNESSES",
                    payload: witnesses.map((w, i) =>
                      i === index
                        ? {
                            ...w,
                            reportingBlock: {
                              ...w.reportingBlock,
                              armyNumber: e.target.value,
                            },
                          }
                        : w
                    ),
                  })
                }
              />
              <Input
                placeholder="Contact Number"
                value={witness.reportingBlock?.contactNumber || ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_STATIC_WITNESSES",
                    payload: witnesses.map((w, i) =>
                      i === index
                        ? {
                            ...w,
                            reportingBlock: {
                              ...w.reportingBlock,
                              contactNumber: e.target.value,
                            },
                          }
                        : w
                    ),
                  })
                }
              />
            </div>
          </div>
        ))}

        {/* ADD MORE */}
        <button
          className="text-blue-600 text-sm mt-2"
          onClick={() =>
            dispatch({
              type: "SET_STATIC_WITNESSES",
              payload: [
                ...witnesses,
                {
                  dutyBlock: {},
                  reportingBlock: {
                    nameReportingMP: "",
                    rank: "",
                    unit: "",
                    armyNumber: "",
                    contactNumber:""
                  },
                  offenceBlock: offence,
                },
              ],
            })
          }
        >
          + Add More Witnesses
        </button>

        {/* ================= LIVE LIST ================= */}
        {witnesses.some(
          (w: any) =>
            w.reportingBlock?.nameReportingMP ||
            w.reportingBlock?.rank ||
            w.reportingBlock?.unit ||
            w.reportingBlock?.armyNumber
        ) && (
          <div className="mt-6">
            <p className="text-gray-500 mb-2">
              List of Witnesses, choose one for Signature Proof
            </p>

            {witnesses
              .filter(
                (w: any) =>
                  w.reportingBlock?.nameReportingMP ||
                  w.reportingBlock?.rank ||
                  w.reportingBlock?.unit ||
                  w.reportingBlock?.armyNumber
              )
              .map((w: any, i: any) => (
                <div
                  key={i}
                  className="flex justify-between border rounded-lg p-3 mb-3 text-sm"
                >
                  <div>
                    <p>
                      <b>Name:</b> {w.reportingBlock?.nameReportingMP}
                    </p>
                    <p>
                      <b>Unit:</b> {w.reportingBlock?.unit}
                    </p>
                  </div>

                  <div>
                    <p>
                      <b>Rank:</b> {w.reportingBlock?.rank}
                    </p>
                    <p>
                      <b>Army no.:</b> {w.reportingBlock?.armyNumber}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </FormSection>

      {/* ================== OFFENCE DETAILS ================== */}
      <FormSection title="Offence Occurrence Details">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="time"
            value={offence.timeOfOffence || ""}
            onChange={(e) => {
              const selectedTime = e.target.value; // 17:00
              const today = new Date().toISOString().split("T")[0]; // 2025-01-23
              const isoDateTime = `${today}T${selectedTime}:00.000Z`;

              updateOffence({
                timeOfOffence: selectedTime,
                time: isoDateTime,
              });
            }}
          />

          <div>
            <Label>Incident Location</Label>
            <Input
              placeholder="Incident Location"
              value={offence.incidentLocation || ""}
              onChange={(e) =>
                updateOffence({ incidentLocation: e.target.value })
              }
            />
          </div>
        </div>

        <Input
          placeholder="Actual Speed"
          className="mt-3"
          value={offence.actualSpeed || ""}
          onChange={(e) => updateOffence({ actualSpeed: e.target.value })}
        />

        <Input
          placeholder="Over Speed"
          className="mt-3"
          value={offence.overSpeed || ""}
          onChange={(e) => updateOffence({ overSpeed: e.target.value })}
        />

        <Textarea
          placeholder="Provide detailed description..."
          className="mt-3"
          value={offence.description || ""}
          onChange={(e) => updateOffence({ description: e.target.value })}
        />
      </FormSection>
    </div>
  );
}
