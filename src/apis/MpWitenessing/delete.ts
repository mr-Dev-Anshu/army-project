import api from "@/config/axios";

export const deleteOnDutyWitnessingMp = async (id: string) => {
  const res = await api.delete(`/api/onDutyWitnessingMp/${id}`);
  return res.data;
};
