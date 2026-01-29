import api from "@/config/axios";

export const getUserById = async (id: string) => {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
};
