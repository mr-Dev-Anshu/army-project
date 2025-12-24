import api from "@/config/axios";

export const deleteStaticSpeedRecord = async (id: string) => {
  const res = await api.delete(`/api/speedCheckRecord/${id}`);
  return res.data;
};
