'use client';

import { useState } from 'react';
import { uploadFile } from '@/lib/uploadFile';

export default function UploadDemoPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadedUrl(null);

    try {
      const { url, type } = await uploadFile(file);
      
      // Construct full URL (important for local dev and production)
      const fullUrl = `${window.location.origin}${url}`;
      
      setUploadedUrl(fullUrl);
      setFileType(type || file.type);
      console.log('File uploaded successfully:', fullUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">File Upload Demo</h1>

        {/* Upload Input */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <label className="block text-lg font-medium mb-4">
            Choose a file to upload (image, PDF, video, etc.)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={loading}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          
          {loading && (
            <p className="mt-4 text-blue-600 font-medium">Uploading...</p>
          )}
          
          {error && (
            <p className="mt-4 text-red-600 font-medium">{error}</p>
          )}
        </div>

        {/* Preview / Display Uploaded File */}
        {uploadedUrl && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">Uploaded File</h2>
            
            {/* Image Preview */}
            {fileType.startsWith('image/') && (
              <div className="mb-6">
                <img
                  src={uploadedUrl}
                  alt="Uploaded"
                  className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                  style={{ maxHeight: '600px' }}
                />
              </div>
            )}

            {/* Video Preview */}
            {fileType.startsWith('video/') && (
              <div className="mb-6 flex justify-center">
                <video
                  src={uploadedUrl}
                  controls
                  className="max-w-full rounded-lg shadow-lg"
                  style={{ maxHeight: '600px' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* PDF Preview (iframe) */}
            {fileType === 'application/pdf' && (
              <div className="mb-6">
                <iframe
                  src={uploadedUrl}
                  title="PDF Preview"
                  className="w-full rounded-lg shadow-lg border-0"
                  style={{ height: '800px' }}
                />
              </div>
            )}

            {/* Fallback: Download Link for Other Files */}
            {!fileType.startsWith('image/') && 
             !fileType.startsWith('video/') && 
             fileType !== 'application/pdf' && (
              <div className="text-center">
                <p className="mb-4 text-gray-700">
                  File uploaded successfully! (Preview not available for this type)
                </p>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Download / Open File
                </a>
              </div>
            )}

            {/* Always show the URL */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">File URL:</p>
              <code className="block text-xs break-all text-blue-700">
                {uploadedUrl}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}