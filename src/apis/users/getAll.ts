import api from "@/config/axios";

export const getAllUsers = async () => {
    const res = await api.get("/api/users");
    return res.data;
};
