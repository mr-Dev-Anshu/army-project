"use client";

import IndividualVictimSection from "./IndividualVictimSection";
import AccidentDetailsSection from "./AccidentDetailsSection";
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

export default function MTAccidentForm({ onClose }: { onClose?: () => void }) {
  const { state } = useForm();

  const { mutate: create, isPending: isCreating } =
    useCreateMTAccidentReport();
  const { mutate: update, isPending: isUpdating } =
    useUpdateMTAccidentReport();

  const formData = state.formData.mtAccidentReport;
  const isEdit = Boolean(formData?._id);
  const isPending = isCreating || isUpdating;

  const handleSave = () => {
    const cleanedPayload = cleanPayload(
      mapMTAccidentPayload(formData)
    );

    isEdit
      ? update({ id: formData._id, data: cleanedPayload }, { onSuccess: () => onClose?.() })
      : create(cleanedPayload, { onSuccess: () => onClose?.() });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/10">
      <div className="bg-white w-full max-w-3xl h-full shadow-xl flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 ">
          <div>
            <h2 className="text-lg font-semibold">
              {isEdit ? "Edit MT Accident Report" : "Add MT Accident Report"}
            </h2>
            <p className="text-sm text-gray-500">
              Fill details to issue temporary hired worker security pass
            </p>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <IndividualVictimSection />
          {/* <Divider /> */}

          <AccidentDetailsSection />
          {/* <Divider /> */}

          <VehicleDetailsSection />
          {/* <Divider /> */}

          <CasualtyDetailsSection />
          {/* <Divider /> */}

          <FirDetailsSection />
          {/* <Divider /> */}

          <ActionSection />
        </div>

        {/* FOOTER */}
       <div className="flex justify-between items-center px-6 py-4 border-t">
  <Button
    variant="outline"
    onClick={onClose}
    className="border-gray-300 text-gray-700 hover:bg-gray-100"
  >
    Cancel
  </Button>

  <Button
    onClick={handleSave}
    disabled={isPending}
    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
  >
    {isPending
      ? "Saving..."
      : isEdit
      ? "Update Report"
      : "Save & Add Another"}
  </Button>
</div>

      </div>
    </div>
  );
}

/* ===== SINGLE LINE DIVIDER ===== */
function Divider() {
  return <div className="border-t border-gray-200" />;
}
