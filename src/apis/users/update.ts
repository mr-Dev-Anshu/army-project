import api from "@/config/axios";

export const updateUser = async ({ id, data }: { id: string; data: any }) => {
    const res = await api.put(`/api/users/${id}`, data);
    return res.data;
};
