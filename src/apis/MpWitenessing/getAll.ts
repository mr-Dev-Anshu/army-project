import api from "@/config/axios";

export const getAllOnDutyWitnessingMp = async () => {
  const res = await api.get("/api/onDutyWitnessingMp");
  return res.data;
};
