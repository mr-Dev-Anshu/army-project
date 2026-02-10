"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import {
  useCreateContactInfoArmyPersonnelRegister,
  useUpdateContactInfoArmyPersonnelRegister,
} from "../hooks";

interface ContactInfoArmyPersonnelFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const ContactInfoArmyPersonnelForm = ({
  initialData,
  onSuccess,
  onCancel,
}: ContactInfoArmyPersonnelFormProps) => {
  const createMutation = useCreateContactInfoArmyPersonnelRegister();
  const updateMutation = useUpdateContactInfoArmyPersonnelRegister();

  const [formData, setFormData] = useState({
    rank: "",
    name: "",
    mobileNumber: "",
    appointment: "",
    unit: "",
    postedAt: "",
    officeLandlineNumber: "",
    residencyNo: "",
    remark: "",
  });
  const [people, setPeople] = useState<any[]>([
    {
      individualType: "militaryPersonnel",
      individualDetails: {
        rank: "",
        name: "",
        mobileNumber: "",
        appointment: "",
        unit: "",
        postedAt: "",
        officeLandlineNumber: "",
        residencyNo: "",
      },
      remark: "",
    },
  ]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        rank: initialData.details?.rank || "",
        name: initialData.details?.name || "",
        mobileNumber: initialData.details?.mobileNumber || "",
        appointment: initialData.details?.appointment || "",
        unit: initialData.details?.unit || "",
        postedAt: initialData.details?.postedAt || "",
        officeLandlineNumber: initialData.details?.officeLandlineNumber || "",
        residencyNo: initialData.details?.residencyNo || "",
        remark: initialData.remark || "",
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const firstPerson = people[0];

    if (!firstPerson.individualDetails.name) {
      toast.error("Name is required");
      return;
    }

    if (!firstPerson.individualDetails.mobileNumber) {
      toast.error("Mobile Number is required");
      return;
    }

    const payload = {
      type: "contact_info_army",
      people: people.map((p) => ({
        individualType: p.individualType,
        individualDetails: {
          rank: p.individualDetails.rank,
          name: p.individualDetails.name,
          mobileNumber: p.individualDetails.mobileNumber,
          appointment: p.individualDetails.appointment,
          unit: p.individualDetails.unit,
          postedAt: p.individualDetails.postedAt,
          officeLandlineNumber: p.individualDetails.officeLandlineNumber,
          residencyNo: p.individualDetails.residencyNo,
        },
        remark: p.remark || "",
        ...(p.vehicle && {
          vehicle: {
            isVehicleInvolved: true,
            vehicleType: p.vehicle.vehicleType,
            vehicleRegistration: p.vehicle.vehicleRegistration,
            coDriver: p.vehicle.coDriver || null,
            passengers: p.vehicle.passengers || [],
          },
        }),
      })),
    };

    try {
      if (initialData?._id) {
        await updateMutation.mutateAsync({
          id: initialData._id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save entry");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl bg-white font-inter">
      {/* Header - Not needed if used in Sheet, but keeping structure clean */}
      {/* <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">...</div> */}

      <div className="p-6 space-y-8">
        {/* Personal & Service Details */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">
            Personal & Service Details
          </h3>

          <div className="space-y-1.5">
            <Label
              htmlFor="rank"
              className="text-sm font-medium text-neutral-700"
            >
              Rank
            </Label>
            <SuggestionInput
              id="rank"
              fieldType="rank"
              placeholder="Lt Col, Maj, Sub Maj, Hav (MP)"
              value={formData.rank}
              onChange={(val) => handleChange("rank", val)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-neutral-700"
              >
                Name of Individual
              </Label>
              <SuggestionInput
                id="name"
                fieldType="name"
                placeholder="e.g. Roger"
                value={formData.name}
                onChange={(val) => handleChange("name", val)}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="mobileNumber"
                className="text-sm font-medium text-neutral-700"
              >
                Mobile Number
              </Label>
              <SuggestionInput
                id="mobileNumber"
                fieldType="mobileNumber"
                placeholder="+91"
                value={formData.mobileNumber}
                onChange={(val) => handleChange("mobileNumber", val)}
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.333 2.83301C14.3453 2.83301 15.1657 3.65379 15.166 4.66602V15.333C15.166 16.3455 14.3455 17.166 13.333 17.166H6.66602C5.65379 17.1657 4.83301 16.3453 4.83301 15.333V4.66602C4.83336 3.65401 5.65401 2.83336 6.66602 2.83301H13.333ZM6.66602 3.83301C6.20629 3.83336 5.83336 4.20629 5.83301 4.66602V15.333C5.83301 15.793 6.20608 16.1657 6.66602 16.166H13.333C13.7932 16.166 14.166 15.7932 14.166 15.333V4.66602C14.1657 4.20608 13.793 3.83301 13.333 3.83301H6.66602ZM10.0068 13.5C10.2829 13.5001 10.5068 13.7239 10.5068 14C10.5068 14.2761 10.2829 14.4999 10.0068 14.5H10C9.72386 14.5 9.5 14.2761 9.5 14C9.5 13.7239 9.72386 13.5 10 13.5H10.0068ZM2.00977 2.00977H2V2H2.00977V2.00977Z"
                      fill="#737373"
                    />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="appointment"
              className="text-sm font-medium text-neutral-700"
            >
              Appointment
            </Label>
            <SuggestionInput
              id="appointment"
              fieldType="appointment"
              placeholder="Deputy Provost Marshal, Regimental JCO, MP Duty In-charge"
              value={formData.appointment}
              onChange={(val) => handleChange("appointment", val)}
            />
          </div>
        </section>

        {/* Unit & Posting Details */}
        <section className="space-y-4 pt-4 border-t border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900">
            Unit & Posting Details
          </h3>

          <div className="space-y-1.5">
            <Label
              htmlFor="unit"
              className="text-sm font-medium text-neutral-700"
            >
              Unit
            </Label>
            <SuggestionInput
              id="unit"
              fieldType="unit"
              placeholder="e.g. HQ 21 Corps, 36 RAPID Div"
              value={formData.unit}
              onChange={(val) => handleChange("unit", val)}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="postedAt"
              className="text-sm font-medium text-neutral-700"
            >
              Posted At (Location)
            </Label>
            <SuggestionInput
              id="postedAt"
              fieldType="unitLocation"
              placeholder="e.g. Bhopal (Corps HQ), Jhansi"
              value={formData.postedAt}
              onChange={(val) => handleChange("postedAt", val)}
            />
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-4 pt-4 border-t border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="officeLandlineNumber"
                className="text-sm font-medium text-neutral-700"
              >
                Office Landline Number
              </Label>
              <SuggestionInput
                id="officeLandlineNumber"
                fieldType="landlineNumber"
                placeholder="STD code allowed"
                value={formData.officeLandlineNumber}
                onChange={(val) => handleChange("officeLandlineNumber", val)}
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.333 2.83301C14.3453 2.83301 15.1657 3.65379 15.166 4.66602V15.333C15.166 16.3455 14.3455 17.166 13.333 17.166H6.66602C5.65379 17.1657 4.83301 16.3453 4.83301 15.333V4.66602C4.83336 3.65401 5.65401 2.83336 6.66602 2.83301H13.333ZM6.66602 3.83301C6.20629 3.83336 5.83336 4.20629 5.83301 4.66602V15.333C5.83301 15.793 6.20608 16.1657 6.66602 16.166H13.333C13.7932 16.166 14.166 15.7932 14.166 15.333V4.66602C14.1657 4.20608 13.793 3.83301 13.333 3.83301H6.66602ZM10.0068 13.5C10.2829 13.5001 10.5068 13.7239 10.5068 14C10.5068 14.2761 10.2829 14.4999 10.0068 14.5H10C9.72386 14.5 9.5 14.2761 9.5 14C9.5 13.7239 9.72386 13.5 10 13.5H10.0068ZM2.00977 2.00977H2V2H2.00977V2.00977Z"
                      fill="#737373"
                    />
                  </svg>
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="residencyNo"
                className="text-sm font-medium text-neutral-700"
              >
                Residency No.
              </Label>
              <SuggestionInput
                id="residencyNo"
                fieldType="landlineNumber"
                placeholder="STD code allowed"
                value={formData.residencyNo}
                onChange={(val) => handleChange("residencyNo", val)}
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.333 2.83301C14.3453 2.83301 15.1657 3.65379 15.166 4.66602V15.333C15.166 16.3455 14.3455 17.166 13.333 17.166H6.66602C5.65379 17.1657 4.83301 16.3453 4.83301 15.333V4.66602C4.83336 3.65401 5.65401 2.83336 6.66602 2.83301H13.333ZM6.66602 3.83301C6.20629 3.83336 5.83336 4.20629 5.83301 4.66602V15.333C5.83301 15.793 6.20608 16.1657 6.66602 16.166H13.333C13.7932 16.166 14.166 15.7932 14.166 15.333V4.66602C14.1657 4.20608 13.793 3.83301 13.333 3.83301H6.66602ZM10.0068 13.5C10.2829 13.5001 10.5068 13.7239 10.5068 14C10.5068 14.2761 10.2829 14.4999 10.0068 14.5H10C9.72386 14.5 9.5 14.2761 9.5 14C9.5 13.7239 9.72386 13.5 10 13.5H10.0068ZM2.00977 2.00977H2V2H2.00977V2.00977Z"
                      fill="#737373"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </section>

        {/* Add Remark */}
        <section className="space-y-4 pt-4 border-t border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900">Add Remark</h3>
          <div className="space-y-1.5">
            <Textarea
              id="remark"
              placeholder="Enter remark"
              className="resize-none min-h-[80px]"
              value={formData.remark}
              onChange={(e) => handleChange("remark", e.target.value)}
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <FormFooter
        onCancel={onCancel}
        onSave={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        saveLabel={initialData?._id ? "Update Entry" : "Save and Another"}
      />
    </div>
  );
};

export default ContactInfoArmyPersonnelForm;
