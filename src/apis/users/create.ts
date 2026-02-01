import api from "@/config/axios";

export const createUser = async (data: any) => {
    // TODO: Replace 'superadmin' with actual logged-in user role from AuthContext
    const res = await api.post("/api/users", data);
    return res.data;
};
