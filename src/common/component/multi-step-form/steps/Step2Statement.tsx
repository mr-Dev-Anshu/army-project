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
import { Label } from "@radix-ui/react-label";

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
    <div className="space-y-10 ">
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

      {/* ---------------- Witnessing MP ---------------- */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {d.witnesses.map((witness, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-4 mb-6">
            {/* ================= Inputs ================= */}
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
        ))}

        {/* ================= LIVE PREVIEW LIST ================= */}
        <div className="mt-6 border-t pt-6">
          <p className="text-gray-500 mb-3">
            List of Witnesses, choose one for Signature Proof
          </p>
          {/* ================= LIVE PREVIEW LIST ================= */}
          {d.witnesses.some(
            (w) =>
              w.reportingBlock.nameReportingMP ||
              w.reportingBlock.rank ||
              w.reportingBlock.unit ||
              w.reportingBlock.armyNumber
          ) && (
            <div className="mt-6 border-t pt-6">
              <p className="text-gray-500 mb-3">
                List of Witnesses, choose one for Signature Proof
              </p>

              {d.witnesses
                .filter(
                  (w) =>
                    w.reportingBlock.nameReportingMP ||
                    w.reportingBlock.rank ||
                    w.reportingBlock.unit ||
                    w.reportingBlock.armyNumber
                )
                .map((w, i) => (
                  <div
                    key={i}
                    className="flex justify-between border rounded-lg p-4 mb-3 text-sm"
                  >
                    <div>
                      <p>
                        <b>Name:</b> {w.reportingBlock.nameReportingMP}
                      </p>
                      <p>
                        <b>Unit:</b> {w.reportingBlock.unit}
                      </p>
                    </div>

                    <div>
                      <p>
                        <b>Rank:</b> {w.reportingBlock.rank}
                      </p>
                      <p>
                        <b>Army no.:</b> {w.reportingBlock.armyNumber}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ADD MORE BUTTON */}
        <button
          className="text-blue-600 text-sm mt-2"
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

      <FormSection title="Offence Occurrence Details">
        <p className="mb-4 md:-mt-4 text-[#818181]">
          Enter the axact date and time when the incident Occured{" "}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 text-md font-semibold">
              Time of Offence
            </Label>
            <Input
              type="time"
              value={d.offenceOccurenceDetails.timeOfOffence || "06:00"}
              onChange={(e) =>
                update("offenceOccurenceDetails", {
                  timeOfOffence: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label className="mb-2 text-md font-semibold">
              Incident Location
            </Label>
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
        </div>

        {/* AUTH SPEED */}
        <div>
          <p className="font-medium mb-2">Auth Speed</p>
          <div className="flex items-center gap-3">
            <Input value="30 KMPH" disabled className="w-[200px]" />
          </div>
          <p className="text-md text-gray-500 mt-2">
            STN Cdr ke adesh k anusar is type k vehicle ki speed as per letter
            No599/2025 k anusar Bhopal Military stn k liye 30 KMPH mukarar kiya
            gaya hai. hai.
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
