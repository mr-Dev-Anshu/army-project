'use client';

import { csvToJsonWithHiddenKeys } from '@/lib/csvToJson';
import React, { useState } from 'react';
// Import your function from the lib folder

export default function TestCsvPage() {
  const [jsonResult, setJsonResult] = useState<any[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const json = csvToJsonWithHiddenKeys(content);
      setJsonResult(json);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">CSV Mapping Test</h1>
        
        {/* Upload Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Upload CSV (Row 1=Keys, Row 2=Skip, Row 3=Data)
          </label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFile}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        {jsonResult.length > 0 && (
          <div className="space-y-4">
            {/* Raw Stringified Output */}
            <div className="bg-slate-900 rounded-lg p-4 overflow-hidden shadow-lg">
              <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                <span className="text-slate-400 text-xs uppercase tracking-widest">Raw JSON String</span>
                <span className="text-green-500 text-xs">{jsonResult.length} Records Found</span>
              </div>
              <pre className="text-green-400 text-sm overflow-x-auto max-h-96">
                {JSON.stringify(jsonResult, null, 2)}
              </pre>
            </div>

            {/* Visual Array Render */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {jsonResult.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-500">
                  <p className="text-xs text-gray-400 mb-2 font-bold">INDEX: {idx}</p>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(item, null, 1)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}