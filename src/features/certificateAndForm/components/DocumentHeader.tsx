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
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { DocumentItem } from "../types";
import { useDeleteDocument } from "../hook";
import AddDocumentModal from "@/features/certificateAndForm/components/AddDocumentModel";

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

  const { mutate: deleteDoc, isPending } = useDeleteDocument(type);

  const handleDelete = () => {
    if (!doc?._id) return;
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDoc(doc._id, {
        onSuccess: () => router.push(`/form-certificate/${type}`),
      });
    }
  };

  const handlePrint = () => {
    if (!doc?.url) return;
    const isImage = /\.(png|jpe?g|webp|gif)$/i.test(doc.url);
    const iframe = document.createElement("iframe");
    // ... (Your existing iframe logic remains the same)
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    if (isImage) {
      iframe.srcdoc = `<html><head><style>@page { size: A4; margin: 0; } body { margin: 0; display: flex; justify-content: center; align-items: center; width: 210mm; height: 297mm; } img { max-width: 100%; max-height: 100%; object-fit: contain; }</style></head><body><img src="${doc.url}" /></body></html>`;
      iframe.onload = () => { iframe.contentWindow?.focus(); iframe.contentWindow?.print(); };
    } else {
      iframe.src = doc.url;
      iframe.onload = () => { iframe.contentWindow?.focus(); iframe.contentWindow?.print(); };
    }
  };

  return (
    <>
      <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        {/* Left Section: Breadcrumbs & Back */}
        <div className="flex flex-col min-w-0 flex-1 mr-4">
          <nav className="hidden sm:flex items-center gap-2 text-[12px] text-gray-400 whitespace-nowrap mb-1">
            <span onClick={() => router.push("/")} className="hover:text-black cursor-pointer">Forms & Certificates</span>
            <ChevronRight size={12} />
            <span onClick={() => router.push(`/form-certificate/${type}`)} className="capitalize hover:text-black cursor-pointer">{type}s</span>
            <ChevronRight size={12} />
            <span className="text-black truncate max-w-[150px]">{doc?.name}</span>
          </nav>

          <div className="flex items-center gap-2 overflow-hidden">
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-sm sm:text-base text-gray-900 truncate">
              {doc?.name || "Loading..."}
            </h1>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
          {/* Print Label hidden on very small screens, icon only */}
          <Button 
            onClick={handlePrint} 
            className="bg-black text-white flex gap-2 h-9 px-3 sm:px-4"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Print {type}</span>
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsMenuOpen((p) => !p)}
            >
              <MoreVertical size={18} />
            </Button>

            {isMenuOpen && (
              <>
                {/* Backdrop to close menu on mobile tap outside */}
                <div className="fixed inset-0 z-10 sm:hidden" onClick={() => setIsMenuOpen(false)} />
                
                <div className="absolute right-0 top-11 w-48 bg-white border rounded-lg shadow-xl py-2 z-20 origin-top-right transition-all">
                  <button
                    onClick={() => { setIsRenameOpen(true); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 sm:py-2 text-sm sm:text-xs hover:bg-gray-50 active:bg-gray-100"
                  >
                    <Pencil size={14} className="text-gray-500" /> Rename
                  </button>

                  <button
                    onClick={() => { setIsReuploadOpen(true); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 sm:py-2 text-sm sm:text-xs hover:bg-gray-50 active:bg-gray-100"
                  >
                    <Upload size={14} className="text-gray-500" /> Re-Upload
                  </button>

                  <hr className="my-1 border-gray-100" />

                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 px-4 py-3 sm:py-2 text-sm sm:text-xs text-red-600 hover:bg-red-50 active:bg-red-100"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Modals remain the same */}
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