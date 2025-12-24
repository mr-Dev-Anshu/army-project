import api from "@/config/axios";
import { CreateStaticSpeedPayload } from "./type";

export const updateStaticSpeedRecord = async (
  id: string,
  data: Partial<CreateStaticSpeedPayload>
) => {
  const res = await api.put(`/api/speedCheckRecord/${id}`, data);
  return res.data;
};
