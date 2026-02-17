"use client";
import { useParams, useRouter } from "next/navigation";
import { useDocumentDetails } from "@/features/certificateAndForm/hook/index";
import DocumentHeader from "@/features/certificateAndForm/components/DocumentHeader";
import DocumentPreview from "@/features/certificateAndForm/components/DocumentPreview";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const rawType = Array.isArray(params?.type) ? params.type[0] : params?.type;
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const typeStr = rawType ?? "";
  const idStr = rawId ?? "";

  const allowedTypes = ["certificate", "form", "letter"] as const;
  const isValidType = allowedTypes.includes(typeStr as any);
  const normalizedType = isValidType ? (typeStr as typeof allowedTypes[number]) : "certificate";

  const { data: doc, isLoading, isFetching } = useDocumentDetails(idStr, normalizedType);

  if (isLoading) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center gap-3 text-gray-500 bg-gray-50/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse">Loading document...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-100/50 sm:bg-white overflow-hidden">
      {/* 📱 Mobile-Only Back Navigation */}
      <div className="sm:hidden flex items-center px-4 py-3 bg-white border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="-ml-2 h-8 gap-1 text-gray-600"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-medium">Back</span>
        </Button>
      </div>

      {/* Component 1: Header - Sticky/Fixed at top */}
      <div className="flex-none z-20 shadow-sm sm:shadow-none bg-white">
        <DocumentHeader
          doc={doc}
          type={normalizedType}
          isLoading={isLoading || isFetching}
        />
      </div>

      {/* Component 2: Preview Content - Scrollable area */}
      <main className="flex-1 overflow-y-auto relative p-0 sm:p-4 lg:p-6 bg-gray-100/50">
        <div className="max-w-5xl mx-auto h-full">
          {/* Container for the preview. 
            On mobile (p-0), the document fills the width. 
            On desktop (sm:p-4), it looks like a paper on a desk.
          */}
          <div className="bg-white min-h-full sm:min-h-0 sm:rounded-xl sm:shadow-lg sm:border border-gray-200 transition-all duration-300">
            <DocumentPreview doc={doc} isLoading={isLoading || isFetching} />
          </div>
        </div>
      </main>
    </div>
  );
}