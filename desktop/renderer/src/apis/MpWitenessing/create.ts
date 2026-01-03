import api from "@/config/axios";

export const createMpWitenessing = async (data:any): Promise<any> => {
  const response = await api.post("api/witnessing-mps", data);
  return response.data;
}