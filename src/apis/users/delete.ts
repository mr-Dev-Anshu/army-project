import api from "@/config/axios";

export const deleteUser = async (id: string) => {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
};
