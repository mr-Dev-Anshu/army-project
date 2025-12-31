import api from "@/config/axios";

export const deleteMTAccidentReport = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/api/mt-accident-reports/${id}`);
  return response.data;
};
