import { Button } from "@/components/ui/button";
import {
  
    Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState, useRef } from "react";

interface AttachCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (file: File, type: "certificate" | "letter") => void;
}

export const AttachCertificateModal = ({
  open,
  onOpenChange,
  onSave,
}: AttachCertificateModalProps) => {
  const [type, setType] = useState<"certificate" | "letter">("certificate");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    if (file) {
      onSave(file, type);
      onOpenChange(false);
      setFile(null); // Reset after save
      setType("certificate");
    }
  };

  // Reset state when opening (optional, but good for UX if typically one-off)
//   React.useEffect(() => {
//     if (open) {
//         setFile(null);
//         setType("certificate");
//     }
//   }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] bg-white text-black border-none shadow-2xl p-0 overflow-hidden rounded-xl">
  {/* Header */}
  <DialogHeader className="px-6 py-4 border-b border-gray-200">
    <div className="flex items-center justify-between">
      <DialogTitle className="text-lg font-semibold text-black">
        Attach Certificates / Letters
      </DialogTitle>
    </div>
  </DialogHeader>

  {/* Body */}
  <div className="px-6 py-5 space-y-5">
    {/* Attachment Type */}
    <div className="space-y-2">
      <Label className="text-sm font-light text-black">
        Select Attachment Type
      </Label>

      <RadioGroup
        value={type}
        onValueChange={(val) => setType(val as "certificate" | "letter")}
        className="flex gap-4"
      >
        <div
          onClick={() => setType("certificate")}
          className={`flex items-center gap-3 w-1/2 px-4 py-[6px] border rounded-[14px] cursor-pointer transition ${
            type === "certificate"
              ? "border-black"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <RadioGroupItem value="certificate" id="r1" />
          <Label htmlFor="r1" className="text-[18px] font-light cursor-pointer">
            Certificate
          </Label>
        </div>

        <div
          onClick={() => setType("letter")}
          className={`flex items-center gap-3 w-1/2 px-4 py-2 border rounded-[14px] cursor-pointer transition ${
            type === "letter"
              ? "border-black"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <RadioGroupItem value="letter" id="r2" />
          <Label htmlFor="r2" className="text-[18px]  font-light cursor-pointer">
            Letter
          </Label>
        </div>
      </RadioGroup>
    </div>

    {/* Dropzone */}
    <div
      className="border-2 border-dashed border-gray-300 rounded-xl h-[300px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,image/*"
      />

      {file ? (
        <div className="text-center">
          <p className="font-semibold text-base text-black">{file.name}</p>
          <p className="text-sm text-gray-500 mt-1">Click to change</p>
        </div>
      ) : (
        <>
          <Button className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-2 h-auto text-sm font-medium pointer-events-none">
            Select File
          </Button>

          <div className="text-center">
            <p className="font-semibold text-lg text-black">
              Upload a Word or PDF
            </p>
            <p className="text-sm text-gray-500">or drop a file</p>
          </div>
        </>
      )}
    </div>
  </div>

  {/* Footer */}
  <DialogFooter className="px-6 py-4 flex justify-between items-center border-t border-gray-200">
    <Button
      variant="outline"
      className="px-5 py-2 h-9 border border-gray-300 text-black hover:bg-gray-100 rounded-md text-sm"
      onClick={() => onOpenChange(false)}
    >
      Cancel
    </Button>

    <Button
      className="px-6 py-2 h-9 bg-[#007AFF] text-white hover:bg-[#0066CC] rounded-md text-sm"
      onClick={handleSave}
      disabled={!file}
    >
      Save
    </Button>
  </DialogFooter>
</DialogContent>

    </Dialog>
  );
};
