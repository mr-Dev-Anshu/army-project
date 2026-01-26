"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Plus,FileBadge } from "lucide-react";

import Breadcrumb from "@/common/component/Breadcrumb";
import DocumentTabs from "@/features/certificateAndForm/components/DocumentTabs";
import DocumentList from "@/features/certificateAndForm/components/DocumentList";
import AddDocumentModal from "@/features/certificateAndForm/components/AddDocumentModel";
import { Button } from "@/components/ui/button";
import { useDocumentCounts } from "@/features/certificateAndForm/hook";
import { DocumentType } from "@/features/certificateAndForm/types";

const VALID_TYPES: DocumentType[] = ["certificate", "form", "letter"];

export default function DocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const counts = useDocumentCounts();
  const [open, setOpen] = useState(false);

  const rawType = params?.type;
  if (!rawType || Array.isArray(rawType)) notFound();

  const type = rawType as DocumentType;
  if (!VALID_TYPES.includes(type)) notFound();

  const displayTitle = type.charAt(0).toUpperCase() + type.slice(1) + "s";
  const buttonLabel = type.charAt(0).toUpperCase() + type.slice(1);

  const breadcrumbItems = [
    {
      label: (
       <span className="flex items-center gap-2">
        {/* Icon wrapper provides height for border */}
        <span className="flex items-center pr-3 mr-2 border-r border-gray-300">
          <FileBadge className="w-4 h-4 text-gray-500" />
        </span>

        <span>Forms & Certificates</span>
      </span>
      ),
      href: `/form-certificate/${type}`,
    },
    {
      label: displayTitle,
    },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50/50 sm:bg-white overflow-hidden">
      {/* 🔝 TOP SECTION */}
      <div className="flex-none pt-4 sm:pt-6 px-4 sm:px-6 bg-white">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap no-scrollbar border-b pb-3">
          <Breadcrumb items={breadcrumbItems} className="text-sm" />
        </div>

        {/* Tabs */}
        <DocumentTabs
          activeType={type}
          onChange={(t) => router.push(`/form-certificate/${t}`)}
          counts={{
            certificate: counts.certificate,
            form: counts.form,
            letter: counts.letter,
          }}
        />
      </div>

      {/* Divider */}

      {/* 🔽 CONTENT SECTION */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Header */}
        <div className="flex-none px-4 sm:px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-gray-500 font-normal text-lg sm:text-base tracking-tight">
            {displayTitle}
          </h1>

          {/* Desktop Button */}
          <Button
            onClick={() => setOpen(true)}
            className="hidden sm:flex bg-[#188FFA]"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New {buttonLabel}
          </Button>
        </div>

        {/* List */}
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 pb-24 sm:pb-6 pt-2
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]"
        >
          <DocumentList type={type} />
        </div>

        {/* 📱 Mobile FAB */}
        <div className="fixed bottom-6 right-4 sm:hidden z-20">
          <Button
            onClick={() => setOpen(true)}
            className="rounded-full w-14 h-14 shadow-lg active:scale-95 transition-transform"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Add Document Modal */}
      <AddDocumentModal
        open={open}
        onClose={() => setOpen(false)}
        type={type}
        mode="create"
      />
    </div>
  );
}
