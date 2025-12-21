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

export default function StaticSpeedStep2() {
  const { state, dispatch } = useForm();
  const d = state.formData;

  const update = (key: any, value: any) => {
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        ...state.formData,
        [key]: {
          ...state.formData[key],
          ...value,
        },
      },
    });
  };

  return (
    <div className="space-y-10">
      {/* ---------------- Witnessing MP ---------------- */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {d.witnesses.map((witness, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
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
                <SelectTrigger>
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
          </div>
        ))}

        <button
          className="text-blue-600 text-sm"
          onClick={() =>
            dispatch({
              type: "SET_WITNESSES",
              payload: [
                ...d.witnesses,
                {
                  dutyBlock: d.onDutyDetails,
                  reportingBlock: {
                    nameReportingMP: "",
                    rank: "",
                    unit: "",
                    armyNumber: "",
                  },
                  offenceBlock: d.offenceOccurenceDetails,
                },
              ],
            })
          }
        >
          + Add More Witnesses
        </button>
      </FormSection>

      {/* ---------------- Offence Occurrence Details ---------------- */}
      <FormSection title="Offence Occurrence Details">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="time"
            value={d.offenceOccurenceDetails.timeOfOffence}
            onChange={(e) =>
              update("offenceOccurenceDetails", {
                timeOfOffence: e.target.value,
              })
            }
          />

          <Input
            placeholder="Incident Location"
            value={d.offenceOccurenceDetails.incidentLocation}
            onChange={(e) =>
              update("offenceOccurenceDetails", {
                incidentLocation: e.target.value,
              })
            }
          />
        </div>

        {/* AUTH SPEED */}
        <div>
          <p className="font-medium mb-2">Auth Speed</p>
          <div className="flex items-center gap-3">
            <Input value="30 KMPH" disabled className="w-[200px]" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            STN Cdr ke ades according yeh vehicle type ke liye 30 KMPH fixed
            hai.
          </p>
        </div>

        <Input
          placeholder="00"
          value={d.offenceOccurenceDetails.actualSpeed}
          onChange={(e) =>
            update("offenceOccurenceDetails", {
              actualSpeed: e.target.value,
            })
          }
        />

        <Input
          placeholder="00"
          value={d.offenceOccurenceDetails.overSpeed}
          onChange={(e) =>
            update("offenceOccurenceDetails", {
              overSpeed: e.target.value,
            })
          }
        />

        {/* DESCRIPTION */}
        <Textarea
          placeholder="Provide detailed description..."
          value={d.offenceOccurenceDetails.description}
          onChange={(e) =>
            update("offenceOccurenceDetails", {
              description: e.target.value,
            })
          }
        />
      </FormSection>
    </div>
  );
}
