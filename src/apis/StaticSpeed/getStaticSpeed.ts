import api from "@/config/axios";

export const getAllStaticSpeedRecord = async (filters: any = {}) => {
  const queryParams = new URLSearchParams();

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      queryParams.append(key, filters[key]);
    }
  });

  const res = await api.get(`/api/speedCheckRecord?${queryParams.toString()}`);
  return res.data;
};
