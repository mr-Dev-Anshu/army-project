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

  const update = (
    key:
      | "onDutyDetails"
      | "onDutyDetailsMPReporting"
      | "offenceOccurenceDetails",
    value: any
  ) => {
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        traffic: {
          ...state.formData.traffic,
          [key]: {
            ...state.formData.traffic[key],
            ...value,
          },
        },
      },
    });
  };

  // ---------------- CHECK IF ANY WITNESS IS FILLED ----------------
  const hasFilledWitness = d.witnesses.some((w) => {
    const r = w.reportingBlock;
    return r.nameReportingMP || r.rank || r.unit || r.armyNumber;
  });

  return (
    <div className="space-y-10">
      {/* ---------------- 1️ ON DUTY DETAILS ---------------- */}
      <FormSection title="On-Duty Details">
        <p className="text-gray-500">
          Enter when and where the witness was on duty while reporting the
          offence.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="mb-2 text-base ">Date of Duty</Label>
            <Input
              type="date"
              value={d.onDutyDetails.dateOfDuty}
              onChange={(e) =>
                update("onDutyDetails", { dateOfDuty: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-2 text-base ">Start Time</Label>
            <Input
              type="time"
              value={d.onDutyDetails.startTime}
              onChange={(e) =>
                update("onDutyDetails", { startTime: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-2 text-base ">End Time</Label>
            <Input
              type="time"
              value={d.onDutyDetails.endTime}
              onChange={(e) =>
                update("onDutyDetails", { endTime: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <Label className="mb-1 text-base ">Duty Location</Label>
          <Input
            placeholder="Duty Location"
            value={d.onDutyDetails.dutyLocation}
            onChange={(e) =>
              update("onDutyDetails", { dutyLocation: e.target.value })
            }
          />
        </div>

        <div>
          <Label className="mb-1 text-base ">Duty Type</Label>
          <Input
            placeholder="Duty Type"
            value={d.onDutyDetails.dutyType}
            onChange={(e) =>
              update("onDutyDetails", { dutyType: e.target.value })
            }
          />
        </div>
      </FormSection>

      {/* ---------------- 2️ REPORTING MP ---------------- */}
      <FormSection title="On-Duty Details of MP Reporting">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 text-base ">Reporting MP Name</Label>
            <Input
              placeholder="Reporting MP Name"
              value={d.onDutyDetailsMPReporting.nameReportingMP}
              onChange={(e) =>
                update("onDutyDetailsMPReporting", {
                  nameReportingMP: e.target.value,
                })
              }
            />
          </div>

          <Select
            value={d.onDutyDetailsMPReporting.rank}
            onValueChange={(v) =>
              update("onDutyDetailsMPReporting", { rank: v })
            }
          >
            <div>
              <Label className="mb-2 text-base ">Rank</Label>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Rank" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                <SelectItem value="Captain">Captain</SelectItem>
                <SelectItem value="Major">Major</SelectItem>
                <SelectItem value="Colonel">Colonel</SelectItem>
              </SelectContent>
            </div>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            value={d.onDutyDetailsMPReporting.unit}
            onValueChange={(v) =>
              update("onDutyDetailsMPReporting", { unit: v })
            }
          >
            <div>
              <Label className="mb-2 text-base ">Unit</Label>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MP Unit 12">MP Unit 12</SelectItem>
                <SelectItem value="Unit 2">Unit 2</SelectItem>
                <SelectItem value="Unit 3">Unit 3</SelectItem>
              </SelectContent>
            </div>
          </Select>

          <div>
            <Label className="mb-2 text-base ">Army No.</Label>
            <Input
              placeholder="Army No."
              value={d.onDutyDetailsMPReporting.armyNumber}
              onChange={(e) =>
                update("onDutyDetailsMPReporting", {
                  armyNumber: e.target.value,
                })
              }
            />
          </div>
        </div>
      </FormSection>

      {/* ---------------- Witnessing MP ---------------- */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {d.witnesses.map((witness, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-4 mb-6">
            {/* Name + Rank */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 text-base">Name of Witnessing MP</Label>
                <Input
                  placeholder="Name of Witnessing MP"
                  value={witness.reportingBlock.nameReportingMP}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_WITNESSES",
                      payload: d.witnesses.map((w, i) =>
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
              </div>

              <Select
                value={witness.reportingBlock.rank}
                onValueChange={(v) =>
                  dispatch({
                    type: "SET_WITNESSES",
                    payload: d.witnesses.map((w, i) =>
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
                <div>
                  <Label className="mb-2 text-base">Rank</Label>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Rank" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="L/Nk">L/Nk</SelectItem>
                    <SelectItem value="Nk">Nk</SelectItem>
                    <SelectItem value="Hav">Hav</SelectItem>
                    <SelectItem value="Subedar">Subedar</SelectItem>
                  </SelectContent>
                </div>
              </Select>
            </div>

            {/* Unit - Army - Contact */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={witness.reportingBlock.unit}
                onValueChange={(v) =>
                  dispatch({
                    type: "SET_WITNESSES",
                    payload: d.witnesses.map((w, i) =>
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
                <div>
                  <Label className="mb-2 text-base">Unit</Label>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="11 Engr Regt">11 Engr Regt</SelectItem>
                    <SelectItem value="MP 12">MP 12</SelectItem>
                    <SelectItem value="HQ Unit">HQ Unit</SelectItem>
                  </SelectContent>
                </div>
              </Select>

              <div>
                <Label className="mb-2 text-base">Army No.</Label>
                <Input
                  placeholder="Army No."
                  value={witness.reportingBlock.armyNumber}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_WITNESSES",
                      payload: d.witnesses.map((w, i) =>
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
              </div>

              <div>
                <Label className="mb-2 text-base">Contact Number</Label>
                <Input
                  placeholder="Contact Number"
                  value={witness.reportingBlock?.contactNumber || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_WITNESSES",
                      payload: d.witnesses.map((w, i) =>
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
          </div>
        ))}

        {/* ADD MORE */}
        <button
          onClick={() =>
            dispatch({
              type: "SET_WITNESSES",
              payload: [
                ...d.witnesses,
                {
                  reportingBlock: {
                    nameReportingMP: "",
                    rank: "",
                    unit: "",
                    armyNumber: "",
                    contactNumber: "",
                  },
                },
              ],
            })
          }
          className="text-blue-600 flex gap-2 text-sm"
        >
          + Add More Witnesses
        </button>
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

              const isSelected = d.selectedWitness?.armyNumber === r.armyNumber;

              return (
                <div
                  key={index}
                  className="flex gap-4 items-start border rounded-lg p-4"
                >
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() =>
                      dispatch({
                        type: "SET_SELECTED_WITNESS",
                        payload: r,
                      })
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
          {/* Time of Offence */}
          <FormInput
            label="Time of Offence"
            type="time"
            value={d.offenceOccurenceDetails.timeOfOffence}
            onChange={(v) =>
              update("offenceOccurenceDetails", { timeOfOffence: v })
            }
          />

          {/* Place of Offence */}
          <FormInput
            label="Place Of Offence"
            placeholder="Location"
            value={d.offenceOccurenceDetails.incidentLocation}
            onChange={(v) =>
              update("offenceOccurenceDetails", { incidentLocation: v })
            }
          />
        </div>

        {/* Description */}
        <div className="mt-4">
          <FormTextarea
            label="Full Description of Offence"
            description="Provide a detailed description of the offence, including what happened and how it occurred."
            value={d.offenceOccurenceDetails.description}
            onChange={(v) =>
              update("offenceOccurenceDetails", { description: v })
            }
          />
        </div>
      </FormSection>
    </div>
  );
}
