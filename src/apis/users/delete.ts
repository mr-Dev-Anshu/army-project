import api from "@/config/axios";

export const deleteUser = async (id: string) => {
    // TODO: Replace 'superadmin' with actual logged-in user role from AuthContext
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
};
