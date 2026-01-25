import { DocumentItem } from "../types";

interface Props {
  doc?: DocumentItem;
  isLoading?: boolean;
}

export default function DocumentPreview({ doc, isLoading }: Props) {
  if (isLoading) {
    return (
      <main className="px-3 py-4 sm:p-6 flex justify-center bg-gray-50 h-full overflow-hidden">
        <div className="bg-white shadow border rounded
          w-full sm:w-[210mm]
          h-full sm:h-[297mm]
          flex items-center justify-center overflow-hidden">
          <span className="text-gray-400 italic">Loading preview…</span>
        </div>
      </main>
    );
  }

  if (!doc?.url) {
    return (
      <main className="px-3 py-4 sm:p-6 flex justify-center bg-gray-50 h-full overflow-hidden">
        <div className="bg-white shadow border rounded
          w-full sm:w-[210mm]
          h-full sm:h-[297mm]
          flex items-center justify-center text-gray-400 italic overflow-hidden">
          Preview not available
        </div>
      </main>
    );
  }

  const url = doc.url.toLowerCase();
  const isPdf = url.endsWith(".pdf");
  const isImage = /\.(png|jpe?g|webp|gif)$/i.test(url);
  const isWord = /\.(doc|docx)$/i.test(url);

  const pdfUrl = `${doc.url}#toolbar=0&navpanes=0&scrollbar=0`;
  const wordPreviewUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
    doc.url
  )}&embedded=true`;

  return (
    <main className="px-3 py-4 sm:p-6 flex justify-center bg-gray-50 h-full overflow-hidden">
      <div
        className="
          bg-white shadow border rounded
          w-full sm:w-[210mm]
          h-[calc(100vh-140px)] sm:h-[297mm]
          overflow-hidden
        "
      >
        {isPdf && (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-none overflow-hidden"
            scrolling="no"
            title="PDF Preview"
          />
        )}

        {isImage && (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={doc.url}
              alt="Image Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        {isWord && (
          <iframe
            src={wordPreviewUrl}
            className="w-full h-full border-none overflow-hidden"
            scrolling="no"
            title="Word Preview"
          />
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
