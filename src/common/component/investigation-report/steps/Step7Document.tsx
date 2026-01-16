"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/uploadFile";

export default function Step7Documents() {
  const { state, dispatch } = useForm();

  const documents = state.formData.mpReport.documents || [];

  const [statement, setStatement] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUploading, setFileUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  /* ========= SAVE ========= */
  const saveDocument = async () => {
    if (!statement.trim()) return alert("Statement required");

    let finalUrl = url;
    if (file) {
      if (fileUploading) return;
      setFileUploading(true);
      try {
        const res = await uploadFile(file);
        finalUrl = res.url;
      } catch (err: any) {
        alert("File upload failed: " + err.message);
        setFileUploading(false);
        return;
      }
      setFileUploading(false);
    }

    const newDoc = {
      statement,
      url: finalUrl,
      fileName: file?.name || "",
    };

    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.documents",
      value: [...documents, newDoc],
    });

    setStatement("");
    setUrl("");
    setFile(null);
  };

  /* ========= CLEAR ========= */
  const clearForm = () => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.documents",
      value: [],
    });

    setStatement("");
    setUrl("");
    setFile(null);
  };

  return (
    <FormSection title="">
      <p className="font-semibold mb-2">Attach Documents</p>

      {/* Statement */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Enter Statement</label>

        <Textarea
          placeholder="Write here..."
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Upload Section */}
      <div className="mt-6">
        <label className="text-sm font-medium">
          Attach Related Document{" "}
          <span className="text-gray-500">(Optional)</span>
        </label>

        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {/* ⭐ SAME LINE LIKE YOUR DESIGN */}
        <div className="flex items-center gap-3 mt-2">
          <Button
            className="bg-black text-white flex gap-2"
            onClick={() => fileRef.current?.click()}
            disabled={fileUploading}
          >
            {fileUploading ? "Uploading..." : <><Upload size={16} /> Upload Document</>}
          </Button>

          <Input
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
      </div>

      {/* Save Button Right Aligned */}
      <div className="flex justify-end mt-6">
        <Button className="bg-black text-white" onClick={saveDocument} disabled={fileUploading}>
          {fileUploading ? "Uploading..." : "Save Document"}
        </Button>
      </div>

      {/* ================= LIST UI ================= */}
      {documents.length > 0 && (
        <div className="mt-8  p-4">
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
