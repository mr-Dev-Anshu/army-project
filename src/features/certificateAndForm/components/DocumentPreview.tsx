import { DocumentItem } from "../types";

interface Props {
  doc?: DocumentItem;
  isLoading?: boolean;
}

export default function DocumentPreview({ doc, isLoading }: Props) {
  if (isLoading) {
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

{isPdf && (
  <iframe
    src={`${doc.url}#toolbar=0`}
    className="w-full h-full"
    style={{ border: "none", margin: 0, padding: 0, display: "block" }}
    title="PDF Preview"
  />
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
