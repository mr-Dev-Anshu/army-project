import api from "@/config/axios";
import { CreateStaticSpeedPayload } from "./type";


export const createStaticSpeedRecord = async (data: CreateStaticSpeedPayload) => {
  const res = await api.post("/api/speedCheckRecord", data);
  return res.data;
};
