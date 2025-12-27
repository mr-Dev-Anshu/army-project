import api from "@/config/axios";

export const getAllStaticSpeedRecord = async () => {
  const res = await api.get(`/api/speedCheckRecord`);
  return res.data;
};
