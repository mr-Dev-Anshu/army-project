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
import { FormDataState } from "@/common/types/form.types";

export default function Step2Statement() {
  const { state, dispatch } = useForm();

  const d = state.formData;

  type FormKeys =
    | "onDutyDetails"
    | "onDutyDetailsMPReporting"
    | "offenceOccurenceDetails";

  const update = <K extends FormKeys>(
    key: K,
    value: Partial<FormDataState[K]>
  ) => {
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

      {/* ---------------- 2️ REPORTING MP ---------------- */}
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

          {/*  RANK FIXED */}
          <Select
            value={d.onDutyDetailsMPReporting.rank}
            onValueChange={(v) =>
              update("onDutyDetailsMPReporting", { rank: v })
            }
          >
            <SelectTrigger>
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
          {/*  UNIT FIXED */}
          <Select
            value={d.onDutyDetailsMPReporting.unit}
            onValueChange={(v) =>
              update("onDutyDetailsMPReporting", { unit: v })
            }
          >
            <SelectTrigger>
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

      {/* ---------------- 3️⃣ WITNESSING MP ---------------- */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {d.witnesses.map((witness, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-4 mb-6">
            <h3 className="font-semibold">Witness {index + 1}</h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Witness MP Name"
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
                  <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                  <SelectItem value="Captain">Captain</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Colonel">Colonel</SelectItem>
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
                  <SelectItem value="MP Unit 12">MP Unit 12</SelectItem>
                  <SelectItem value="Unit 2">Unit 2</SelectItem>
                  <SelectItem value="Unit 3">Unit 3</SelectItem>
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

        {/* ➕ Add Witness */}
        <button
          className="px-4 py-2 bg-primary text-white rounded"
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
          + Add More Witness
        </button>
      </FormSection>

      {/* ---------------- 3️ OFFENCE OCCURRENCE ---------------- */}
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

        <Textarea
          placeholder="Description"
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
