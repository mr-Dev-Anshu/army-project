import api from "@/config/axios";

export const deleteOffender = async (id: string) => {
  const res = await api.delete(`/api/offender/${id}`);
  return res.data;
};