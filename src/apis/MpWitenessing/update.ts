import api from "@/config/axios";

export const updateOnDutyWitnessingMp = async (
  id: string,
  data: Partial<any>
) => {
  const res = await api.put(`/api/onDutyWitnessingMp/${id}`, data);
  return res.data;
};
