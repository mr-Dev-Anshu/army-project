"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { FormSection } from "../../FormSection";
import { FormTextareaRHF } from "../../FormTextarea";
import { FormInputRHF } from "../../FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { GeneralTrafficOffenceFormValues } from "@/validators/generalTrafficOffence.schema";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function Step2Statement() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<GeneralTrafficOffenceFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "witnesses",
  });

  const witnesses = watch("witnesses");
  const selectedWitness = watch("selectedWitness");

  const hasFilledWitness = witnesses?.some((w) => {
    const r = w.reportingBlock;
    return r.nameReportingMP || r.rank || r.unit || r.armyNumber;
  });

  return (
    <div className="space-y-10">
      {/* ---------------- ON DUTY DETAILS ---------------- */}
      <FormSection title="On-Duty Details">
        <div className="grid grid-cols-3 gap-4">
          <FormInputRHF
            type="date"
            label="Date of Duty"
            {...control.register("onDutyDetails.dateOfDuty")}
            error={errors.onDutyDetails?.dateOfDuty?.message}
          />
          <FormInputRHF
            type="time"
            label="Start Time"
            {...control.register("onDutyDetails.startTime")}
            error={errors.onDutyDetails?.startTime?.message}
          />
          <FormInputRHF
            type="time"
            label="End Time"
            {...control.register("onDutyDetails.endTime")}
            error={errors.onDutyDetails?.endTime?.message}
          />
        </div>

        <div className="grid gap-4 mt-4">
          <Controller
            control={control}
            name="onDutyDetails.dutyLocation"
            render={({ field }) => (
              <SuggestionInput
                placeholder="Duty Location"
                value={field.value}
                onChange={field.onChange}
                fieldType="dutyLocation"
              />
            )}
          />
          {errors.onDutyDetails?.dutyLocation && <p className="text-red-500 text-sm">{errors.onDutyDetails.dutyLocation.message}</p>}

          <Controller
            control={control}
            name="onDutyDetails.dutyType"
            render={({ field }) => (
              <SuggestionInput
                placeholder="Duty Type"
                value={field.value}
                onChange={field.onChange}
                fieldType="dutyType"
              />
            )}
          />
          {errors.onDutyDetails?.dutyType && <p className="text-red-500 text-sm">{errors.onDutyDetails.dutyType.message}</p>}
        </div>
      </FormSection>

      {/* ---------------- REPORTING MP ---------------- */}
      <FormSection title="On-Duty Details of MP Reporting">
        <div className="grid grid-cols-2 gap-4">
          <FormInputRHF
            placeholder="Reporting MP Name"
            {...control.register("onDutyDetailsMPReporting.nameReportingMP")}
            error={errors.onDutyDetailsMPReporting?.nameReportingMP?.message}
          />

          <Controller
            control={control}
            name="onDutyDetailsMPReporting.rank"
            render={({ field }) => (
              <SuggestionInput
                placeholder="Select Rank"
                value={field.value}
                onChange={field.onChange}
                fieldType="rank"
                defaultOptions={["Lieutenant", "Captain", "Major", "Colonel"]}
              />
            )}
          />
          {errors.onDutyDetailsMPReporting?.rank && <p className="text-red-500 text-sm">{errors.onDutyDetailsMPReporting.rank.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Controller
            control={control}
            name="onDutyDetailsMPReporting.unit"
            render={({ field }) => (
              <SuggestionInput
                placeholder="Select Unit"
                value={field.value}
                onChange={field.onChange}
                fieldType="unit"
                defaultOptions={["MP Unit 12", "Unit 2", "Unit 3"]}
              />
            )}
          />
          {errors.onDutyDetailsMPReporting?.unit && <p className="text-red-500 text-sm">{errors.onDutyDetailsMPReporting.unit.message}</p>}

          <FormInputRHF
            placeholder="Army No."
            {...control.register("onDutyDetailsMPReporting.armyNumber")}
            error={errors.onDutyDetailsMPReporting?.armyNumber?.message}
          />
        </div>
      </FormSection>

      {/* ---------------- WITNESSING MP ---------------- */}
      <FormSection title="On-Duty Details of Witnessing MP">
        {fields.map((field, i) => (
          <div key={field.id} className="border p-4 rounded-lg space-y-4 mb-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => remove(i)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            {/* Name */}
            <FormInputRHF
              placeholder="Name of Witnessing MP"
              {...control.register(`witnesses.${i}.reportingBlock.nameReportingMP`)}
            />

            {/* Rank */}
            <Controller
              control={control}
              name={`witnesses.${i}.reportingBlock.rank`}
              render={({ field }) => (
                <SuggestionInput
                  placeholder="Select Rank"
                  value={field.value}
                  onChange={field.onChange}
                  fieldType="rank"
                  defaultOptions={["L/Nk", "Nk", "Hav", "Subedar"]}
                />
              )}
            />

            {/* Unit */}
            <Controller
              control={control}
              name={`witnesses.${i}.reportingBlock.unit`}
              render={({ field }) => (
                <SuggestionInput
                  placeholder="Select Unit"
                  value={field.value}
                  onChange={field.onChange}
                  fieldType="unit"
                  defaultOptions={["11 Engr Regt", "MP 12", "HQ Unit"]}
                />
              )}
            />

            {/* Army Number */}
            <FormInputRHF
              placeholder="Army No."
              {...control.register(`witnesses.${i}.reportingBlock.armyNumber`)}
            />

            {/* Contact */}
            <FormInputRHF
              placeholder="Contact Number"
              {...control.register(`witnesses.${i}.reportingBlock.contactNumber` as any)}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({
            reportingBlock: {
              nameReportingMP: "",
              rank: "",
              unit: "",
              armyNumber: "",
            },
            contactNumber: ""
          })}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Witness
        </Button>
      </FormSection>

      {/* ================= WITNESS SELECTION LIST ================= */}
      {hasFilledWitness && (
        <div className="p-6 rounded-lg">
          <p className="mb-3 font-semibold">
            List of Witnesses, choose one for Signature Proof
          </p>

          <div className="bg-white rounded-lg p-5 space-y-4">
            {witnesses?.map((w, index) => {
              const r = w.reportingBlock;

              if (!r.nameReportingMP && !r.rank && !r.unit && !r.armyNumber)
                return null;

              const isSelected =
                selectedWitness?.armyNumber === r.armyNumber;

              return (
                <label
                  key={index}
                  className="flex gap-4 items-start border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
                >
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() =>
                      setValue("selectedWitness", r)
                    }
                    className="mt-1"
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
                </label>
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
          <FormInputRHF
            label="Time of Offence"
            type="time"
            {...control.register("offenceOccurenceDetails.timeOfOffence")}
            error={errors.offenceOccurenceDetails?.timeOfOffence?.message}
          />

          <Controller
            control={control}
            name="offenceOccurenceDetails.incidentLocation"
            render={({ field }) => (
              <SuggestionInput
                label="Place Of Offence"
                placeholder="Location"
                value={field.value}
                onChange={field.onChange}
                fieldType="incidentLocation"
              />
            )}
          />
          {errors.offenceOccurenceDetails?.incidentLocation && <p className="text-red-500 text-sm">{errors.offenceOccurenceDetails.incidentLocation.message}</p>}
        </div>

        <div className="mt-4">
          <FormTextareaRHF
            label="Full Description of Offence"
            description="Provide a detailed description of the offence."
            {...control.register("offenceOccurenceDetails.description")}
            error={errors.offenceOccurenceDetails?.description?.message}
          />
        </div>
      </FormSection>
    </div>
  );
}
