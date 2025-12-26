"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Upload, Download, Clipboard, FileIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Step7Documents() {
  const { state, dispatch } = useForm();

  const documents = state.formData.mpReport.documents || [];

  const [statement, setStatement] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  /* SAVE */
  const saveDocument = () => {
    if (!statement.trim()) return alert("Statement required");

    dispatch({
      type: "ADD_MP_DOCUMENT",
      payload: {
        statement,
        url,
        fileName: file?.name || "",
      },
    });

    setStatement("");
    setUrl("");
    setFile(null);
  };

  /* CLEAR */
  const clearForm = () => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "documents",
      payload: [],
    });

    setStatement("");
    setUrl("");
    setFile(null);
  };

  return (
    <FormSection title="7. DOCUMENTS:" onClear={clearForm}>
      <p className="font-semibold mb-2">Attach Documents</p>

      {/* Statement */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Enter Statement</label>
        <Textarea
          placeholder="Write here..."
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
        />
      </div>

      {/* Upload + URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <p className="text-sm mb-1">Attach Related Document (Optional)</p>

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <Button
            className="bg-black text-white flex gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={16} />
            Upload Document
          </Button>

          {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Enter URL</label>
          <Input
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>

      <Button className="bg-blue-600 text-white mt-4" onClick={saveDocument}>
        Save Document
      </Button>

      {/* LIST UI */}
      {documents.length > 0 && (
        <div className="mt-8 border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Document List:</p>
            <span className="text-blue-600 font-semibold">
              ({String(documents.length).padStart(2, "0")})
            </span>
          </div>

          <table className="w-full mt-4 text-sm">
            <thead>
              <tr className="border-b mb-2">
                <th className="w-12 text-left">Sno.</th>
                <th className="text-left">Statement</th>
                <th className="w-24 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((d: any, i: number) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-3">{i + 1}.</td>

                  <td className="py-3 pr-4">{d.statement}</td>

                  <td className="py-3">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (d.url) window.open(d.url, "_blank");
                          else if (d.fileName)
                            alert("File backend se serve hogi");
                          else fileRef.current?.click();
                        }}
                      >
                        {d.fileName ? (
                          <FileIcon size={18} /> 
                        ) : d.url ? (
                          <Download size={18} /> 
                        ) : (
                          <Upload size={18} /> 
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </FormSection>
  );
}
