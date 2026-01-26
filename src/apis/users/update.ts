import api from "@/config/axios";

export const updateUser = async ({ id, data }: { id: string; data: any }) => {
    const res = await api.put(`/api/users/${id}`, data, {
        headers: {
            "x-user-role": "superadmin"
        }
    });
    return res.data;
};
