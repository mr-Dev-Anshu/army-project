import api from "@/config/axios";

export const getOnDutyWitnessingMpById = async (id: string) => {
  const res = await api.get(`/api/onDutyWitnessingMp/${id}`);
  return res.data;
};
