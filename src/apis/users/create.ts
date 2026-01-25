import api from "@/config/axios";

export const createUser = async (data: any) => {
    const res = await api.post("/api/users", data);
    return res.data;
};
