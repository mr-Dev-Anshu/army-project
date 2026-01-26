"use client";

import { DocumentType } from "@/features/certificateAndForm/types";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useDocumentCounts } from "../hook";

interface Props {
  activeType: DocumentType;
  onChange: (type: DocumentType) => void;
  counts: {
    certificate: 12;
    form: number;
    letter: number;
  };
}
export default function DocumentTabs({
  activeType,
  onChange,
  counts,
}: Props) {
  const TabButton = ({
    type,
    label,
    counts,
  }: {
    type: DocumentType;
    label: string;
    counts: number;
  }) => (
    <Button
      variant="ghost"
      onClick={() => onChange(type)}
      className={clsx(
        "flex items-center gap-2 px-0 pb-2 border-b-2 rounded-none duration-200",
        activeType === type
          ? "border-[#188FFA] text-[#188FFA] font-semibold"
          : "border-transparent text-gray-500"
      )}
    >
      {label}
      <span
        className={clsx(
          "text-[11px] px-2 py-[2px] rounded-full",
          activeType === type
            ? "bg-[#188FFA] text-white"
            : "bg-gray-200 text-gray-600"
        )}
      >
        {counts}
      </span>
    </Button>
  );

  return (
    <div className="flex gap-6 mb-4 color-[#188FFA]">
      <TabButton
        type="certificate"
        label="Certificates"
        counts={counts.certificate}
      />

      <TabButton
        type="form"
        label="Forms"
        counts={counts.form}
      />

      <TabButton
        type="letter"
        label="Letters"
        counts={counts.letter}
      />
    </div>
  );
}
