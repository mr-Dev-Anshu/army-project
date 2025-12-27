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
import { Label } from "@radix-ui/react-label";

export default function Step2Statement() {
  const { state, dispatch } = useForm();

  // 🔥 ALWAYS USE TRAFFIC FORM
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

  return (
    <div className="space-y-10">
      {/* ---------------- 1️⃣ ON DUTY DETAILS ---------------- */}
      <FormSection title="On-Duty Details">
        <div className="grid grid-cols-3 gap-4">
          <Input
            type="date"
            value={d.onDutyDetails.dateOfDuty}
            onChange={(e) =>
              update("onDutyDetails", { dateOfDuty: e.target.value })
            }
          />

          <Input
            type="time"
            value={d.onDutyDetails.startTime}
            onChange={(e) =>
              update("onDutyDetails", { startTime: e.target.value })
            }
          />

          <Input
            type="time"
            value={d.onDutyDetails.endTime}
            onChange={(e) =>
              update("onDutyDetails", { endTime: e.target.value })
            }
          />
        </div>

        <Input
          placeholder="Duty Location"
          value={d.onDutyDetails.dutyLocation}
          onChange={(e) =>
            update("onDutyDetails", { dutyLocation: e.target.value })
          }
        />

        <Input
          placeholder="Duty Type"
          value={d.onDutyDetails.dutyType}
          onChange={(e) =>
            update("onDutyDetails", { dutyType: e.target.value })
          }
        />
      </FormSection>

      {/* ---------------- 2️⃣ REPORTING MP ---------------- */}
      <FormSection title="On-Duty Details of MP Reporting">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Reporting MP Name"
            value={d.onDutyDetailsMPReporting.nameReportingMP}
            onChange={(e) =>
              update("onDutyDetailsMPReporting", {
                nameReportingMP: e.target.value,
              })
            }
          />

          <Select
            value={d.onDutyDetailsMPReporting.rank}
            onValueChange={(v) =>
              update("onDutyDetailsMPReporting", { rank: v })
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

        <div className="grid grid-cols-2 gap-4">
          <Select
            value={d.onDutyDetailsMPReporting.unit}
            onValueChange={(v) =>
              update("onDutyDetailsMPReporting", { unit: v })
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
      </FormSection>

      {/* ---------------- Witnessing MP ---------------- */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {d.witnesses.map((witness, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-4 mb-6">
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
      </FormSection>
    </div>
  );
}
