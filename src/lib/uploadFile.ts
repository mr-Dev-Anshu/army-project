import api from "@/config/axios";

/**
 * Response type returned from the /api/uploads endpoint
 */
export interface UploadResponse {
  url: string;         // e.g., "/uploads/abc123-def456.png"
  filename?: string;   // Optional: the generated unique filename
  type?: string;       // Optional: MIME type
}

/**
 * Error response from API
 */
export interface UploadError {
  error: string;
  details?: string;
}

/**
 * Upload a single file to the server
 * @param file - The File object from input (e.g., from <input type="file" />)
 * @returns Promise with uploaded file URL or throws error
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  // Basic validation
  if (!file || file.size === 0) {
    throw new Error("No file selected or file is empty");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post<UploadResponse>("/api/uploads", formData);

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data as UploadError;
      throw new Error(apiError.error || apiError.details || "Upload failed");
    }

    throw new Error(error.message || "Network error during upload");
  }
};


export const uploadMultipleFiles = async (files: File[]): Promise<UploadResponse[]> => {
  const uploadPromises = files.map(uploadFile);
  return Promise.all(uploadPromises);
};