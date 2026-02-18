import { useEffect, useState } from "react";
import { DocumentItem } from "../types";

interface Props {
  doc?: DocumentItem;
  isLoading?: boolean;
}

export default function DocumentPreview({ doc, isLoading }: Props) {
  const [isPdfValid, setIsPdfValid] = useState<boolean>(true);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  useEffect(() => {
    if (doc?.url && doc.url.toLowerCase().endsWith(".pdf")) {
      setIsValidating(true);
      fetch(doc.url, { method: "HEAD" })
        .then((res) => {
          const contentType = res.headers.get("content-type");
          if (res.ok) {
            // If it returns HTML, it's likely the SPA fallback (sidebar issue)
            if (contentType && contentType.toLowerCase().includes("text/html")) {
              setIsPdfValid(false);
            } else {
              setIsPdfValid(true);
            }
          } else {
            setIsPdfValid(false);
          }
        })
        .catch(() => {
          // If CORS fails or network error, we can't be sure. 
          // But usually the sidebar issue implies a 200 OK + HTML.
          // So we default to true here to let it try rendering if it's a real separate domain issue.
          setIsPdfValid(true);
        })
        .finally(() => {
          setIsValidating(false);
        });
    } else {
      setIsValidating(false);
      setIsPdfValid(true);
    }
  }, [doc?.url]);

  if (isLoading || isValidating) {
    return (
      <main className="px-3 py-4 sm:p-6 flex justify-center bg-gray-50 h-full">
        <div className="bg-white shadow border rounded w-full sm:w-[210mm] h-full sm:h-[297mm] flex items-center justify-center">
          <span className="text-gray-400 italic">Loading preview…</span>
        </div>
      </main>
    );
  }

  if (!doc?.url) {
    return (
      <main className="px-3 py-4 sm:p-6 flex justify-center bg-gray-50 h-full">
        <div className="bg-white shadow border rounded w-full sm:w-[210mm] h-full sm:h-[297mm] flex items-center justify-center text-gray-400 italic">
          Preview not available
        </div>
      </main>
    );
  }

  const url = doc.url.toLowerCase();
  const isPdf = url.endsWith(".pdf");
  const isImage = /\.(png|jpe?g|webp|gif)$/i.test(url);
  const isWord = /\.(doc|docx)$/i.test(url);

  return (
    <main className="px-3 py-4 sm:p-6 flex justify-center bg-gray-50 h-full">
      <div className="bg-white shadow border rounded w-full sm:w-[210mm] h-[calc(100vh-140px)] sm:h-[297mm] overflow-hidden">
        {isPdf && isPdfValid && (
          <iframe
            src={`${doc.url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full"
            style={{ border: "none", margin: 0, padding: 0, display: "block" }}
            title="PDF Preview"
          />
        )}

        {isPdf && !isPdfValid && (
          <div className="flex items-center justify-center h-full text-gray-400 italic">
            Preview not available
          </div>
        )}

        {isImage && (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={doc.url}
              alt="Image Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        {isWord && (
          <div className="flex items-center justify-center h-full text-gray-500 italic px-4 text-center">
            Word preview not available because the browser does not support
            previewing Word documents. Please download file.
          </div>
        )}

        {!isPdf && !isImage && !isWord && (
          <div className="flex items-center justify-center h-full text-gray-400 italic">
            Unsupported file format
          </div>
        )}
      </div>
    </main>
  );
}
