import api from "@/config/axios";

export const deleteTrafficOffence = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/api/generalTraficOffence/${id}`);
  return response.data;
};