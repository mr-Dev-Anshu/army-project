"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onFileSelect: (file: File) => void;
}

export default function FileDropZone({ onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        hidden
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />

      <Button
        className="bg-black text-white hover:bg-black rounded-full"
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        Select File
      </Button>

      <p className="text-sm font-medium text-gray-700">
        Upload an Image, Word or PDF
      </p>

      <p className="text-xs text-gray-400">or drop a file</p>
    </div>
  );
}