import api from "@/config/axios";

export const getStaticSpeedRecordById = async (id: string) => {
  const res = await api.get(`/api/speedCheckRecord/${id}`);
  return res.data;
};