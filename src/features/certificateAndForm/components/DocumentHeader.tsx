"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Printer,
  MoreVertical,
  Pencil,
  Upload,
  Trash2,
  FileBadge,
} from "lucide-react";
import { useState } from "react";
import { DocumentItem } from "../types";
import { useDeleteDocument } from "../hook";
import AddDocumentModal from "@/features/certificateAndForm/components/AddDocumentModel";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import Breadcrumb from "@/common/component/Breadcrumb";

interface Props {
  doc?: DocumentItem;
  type: "certificate" | "form" | "letter";
  isLoading: boolean;
}

export default function DocumentHeader({ doc, type }: Props) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isReuploadOpen, setIsReuploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutate: deleteDoc, isPending } = useDeleteDocument(type);

  // 🔹 UI-only flag
const isFileUrl = /\.(doc|docx)$/i.test(doc?.url ?? "");
  const breadcrumbItems = [
    {
      label: (
        <span className="flex items-center gap-2">
          <span className="flex items-center pr-3 mr-2 border-r border-gray-300">
            <FileBadge className="w-4 h-4 text-gray-500" />
          </span>
          <span>Forms & Certificates</span>
        </span>
      ),
      href: `/form-certificate/${type}`,
    },
    { label: `${type}s`, href: `/form-certificate/${type}` },
    { label: doc?.name ?? "Loading..." },
  ];

  const handleConfirmDelete = () => {
    if (!doc?._id) return;
    deleteDoc(doc._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        router.push(`/form-certificate/${type}`);
      },
    });
  };

  // ❗ EXISTING logic untouched
  const handlePrint = () => {
    if (!doc?.url) return;
    const isImage = /\.(png|jpe?g|webp|gif)$/i.test(doc.url);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    if (isImage) {
      iframe.srcdoc = `
        <html>
          <head>
            <style>
              @page { size: A4; margin: 0; }
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 210mm;
                height: 297mm;
              }
              img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
              }
            </style>
          </head>
          <body>
            <img src="${doc.url}" />
          </body>
        </html>
      `;
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      };
    } else {
      iframe.src = doc.url;
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      };
    }
  };

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-30">
        {/* 🔹 Breadcrumb */}
        <div className="px-4 sm:px-6 py-3 border-b">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 🔹 Title + Actions */}
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-1 hover:bg-gray-100 rounded-full transition shrink-0 text-gray-500"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="text-sm sm:text-base font-medium text-gray-500 truncate">
              {doc?.name || "Loading..."}
            </h1>
          </div>

          {/* 🔹 Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 relative">
            <Button
              onClick={handlePrint}
              className="bg-black text-white h-9 px-4 flex gap-2"
            >
              {isFileUrl ? <Upload size={16} /> : <Printer size={16} />}
              <span className="hidden sm:inline">
                {isFileUrl ? "Download" : `Print ${type}`}
              </span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsMenuOpen((p) => !p)}
            >
              <MoreVertical size={18} />
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 top-11 w-48 bg-white border rounded-lg shadow-xl py-2 z-20">
                <button
                  onClick={() => {
                    setIsRenameOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <Pencil size={14} /> Rename
                </button>

                <button
                  onClick={() => {
                    setIsReuploadOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <Upload size={14} /> Re-upload
                </button>

                <button
                  onClick={() => {
                    setIsDeleteOpen(true);
                    setIsMenuOpen(false);
                  }}
                  disabled={isPending}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🔹 Delete Confirmation */}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Certificate"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{doc?.name}</span>?
            <br />
            <span className="text-red-600">This action cannot be undone.</span>
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isProcessing={isPending}
        variant="danger"
      />

      {/* 🔹 Modals */}
      {doc && (
        <>
          <AddDocumentModal
            open={isRenameOpen}
            onClose={() => setIsRenameOpen(false)}
            type={type}
            mode="rename"
            document={{ _id: doc._id, name: doc.name, url: doc.url ?? "" }}
          />
          <AddDocumentModal
            open={isReuploadOpen}
            onClose={() => setIsReuploadOpen(false)}
            type={type}
            mode="reupload"
            document={{ _id: doc._id, name: doc.name, url: doc.url ?? "" }}
          />
        </>
      )}
    </>
  );
}
