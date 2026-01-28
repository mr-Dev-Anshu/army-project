"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/common/FileUpload";

export default function TestUploadPage() {
    const [files, setFiles] = useState<string[]>([]);

    return (
        <div className="min-h-screen bg-white p-10 space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-4">File Upload Component Test</h1>
                <div className="max-w-xl border p-6 rounded-lg shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Attachment Section
                    </h2>

                    <FileUpload
                        value={files}
                        onChange={setFiles}
                    />
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <h3 className="font-semibold mb-2">State Value (files array):</h3>
                <pre className="text-xs">{JSON.stringify(files, null, 2)}</pre>
            </div>
        </div>
    );
}
