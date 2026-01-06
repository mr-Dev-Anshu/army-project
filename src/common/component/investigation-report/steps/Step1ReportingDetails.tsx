
"use client";

import { useState, useRef } from "react";
import { FormSection } from "@/common/component/FormSection";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { uploadFile } from "@/lib/uploadFile";
import { toast } from "react-toastify";

export default function Step1ReportDetails() {
  const { state, dispatch } = useForm();
  const mp = state.formData.mpReport.reportDetails;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const set = (key: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.reportDetails.${key}`,
      value,
    });

  const clearForm = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.reportDetails",
      value: {
        reportNo: "",
        command: "",
        firNo: "",
        firFile: null,
      },
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadFile(file);
      if (res?.url) {
        set("firFile", res.url);
        toast.success("FIR Uploaded Successfully");
      }
    } catch (err: any) {
      console.error("FIR Upload Error:", err);
      toast.error(err.message || "Upload Failed");
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <FormSection title="1. REPORT DETAILS:" onClear={clearForm}>
      <FormInput
        label="Report No : PRO/21 CPU/"
        placeholder="PRO/21CPU/00082/106/25"
        value={mp.reportNo}
        onChange={(v) => set("reportNo", v)}
      />

      <SuggestionInput
        label="Command:"
        placeholder="Select Origin"
        value={mp.command}
        onChange={(v) => set("command", v)}
        fieldType="command"
        defaultOptions={[
          "Central Command",
          "Western Command",
          "Eastern Command",
          "Northern Command",
        ]}
      />

      <div>
        <label className="text-sm font-medium">FIR Number</label>

        <div className="flex gap-2 mt-1 items-center">
          <input
            className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter FIR Number"
            value={mp.firNo}
            onChange={(e) => set("firNo", e.target.value)}
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
          />

          {mp.firFile ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-green-600 border-green-600"
                onClick={() => window.open(mp.firFile, "_blank")}
              >
                View FIR
              </Button>
              <Button
                variant="ghost"
                className="text-red-500"
                onClick={() => set("firFile", null)}
              >
                X
              </Button>
            </div>
          ) : (
            <Button
              className="bg-black text-white flex gap-2 min-w-[140px]"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload size={16} /> Upload FIR
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </FormSection>
  );
}
