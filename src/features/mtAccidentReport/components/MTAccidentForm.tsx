"use client";

import IndividualVictimSection from "./IndividualVictimSection";
import AccidentDetailsSection from "./AccidentDetailsSection";
import DriverRiderSection from "./DriverRiderSection";
import VehicleDetailsSection from "./VehicleDetailsSection";
import CasualtyDetailsSection from "./CasualtyDetailsSection";
import FirDetailsSection from "./FirDetailsSection";
import ActionSection from "./ActionSection";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useForm } from "@/context/FormContext";
import {
  useCreateMTAccidentReport,
  useUpdateMTAccidentReport,
} from "../hooks/useMTAccidentReport";



import {
  mapMTAccidentPayload,
  cleanPayload,
} from "../utils/mapMTAccidentPayload";

export default function MTAccidentForm({
  onClose,
}: {
  onClose?: () => void;
}) {
  const { state } = useForm();

  const { mutate: create, isPending: isCreating } =
    useCreateMTAccidentReport();
  const { mutate: update, isPending: isUpdating } =
    useUpdateMTAccidentReport();

  const formData = state.formData.mtAccidentReport;
  const isEdit = Boolean(formData?._id);
  const isPending = isCreating || isUpdating;

  const handleSave = () => {
    const mappedPayload = mapMTAccidentPayload(formData);
    const cleanedPayload = cleanPayload(mappedPayload);

    console.log("sending payload:", cleanedPayload);

    if (isEdit) {
      update(
        {
          id: formData._id,
          data: cleanedPayload,
        },
        {
          onSuccess: () => {
            console.log(" Update successful");
            onClose?.();
          },
          onError: (error: any) => {
            console.error(
              " Update failed:",
              error?.response?.data || error
            );
          },
        }
      );
    } else {
      create(cleanedPayload, {
        onSuccess: () => {
          console.log(" Create successful");
          onClose?.();
        },
        onError: (error: any) => {
          console.error(" Create failed:", {
            status: error?.response?.status,
            data: error?.response?.data,
            message: error?.message,
            fullError: error,
          });
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-start overflow-y-auto z-50">
      <div className="bg-white w-full max-w-3xl my-10 rounded-xl shadow-lg">
       {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              {isEdit
                ? "Edit MT Accident Report"
                : "Add MT Accident Report"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit
                ? "Update accident report details"
                : "Fill details to create accident report"}
            </p>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* bodyyy */}
        <div className="px-6 py-6 space-y-6">
          <Section>
            <IndividualVictimSection />
          </Section>

          <Section>
            <AccidentDetailsSection />
          </Section>

          <Section>
            <DriverRiderSection 
              title="Select Who was the Driver / Rider?"
              scope="mt-accident"
              showCoDriver
            />
          </Section>

          <Section>
            <VehicleDetailsSection />
          </Section>

          <Section>
            <CasualtyDetailsSection />
          </Section>

          <Section>
            <FirDetailsSection />
          </Section>

          <Section>
            <ActionSection />
          </Section>
        </div>

        {/* footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={isPending}>
            {isPending
              ? "Saving..."
              : isEdit
              ? "Update Report"
              : "Save Accident Report"}
          </Button>
        </div>
      </div>
    </div>
  );
}
//section area
function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      {children}
    </div>
  );
}
