import {
    createUserRepo,
    getAllUsersRepo,
    getUserByUsernameRepo,
    getUserByIdRepo,
    deleteUserRepo,
    updateUserRepo
} from "@/reposetories/user.repo";

export const createUserService = async (data) => {
    return await createUserRepo(data);
};

export const getAllUsersService = async () => {
    return await getAllUsersRepo();
}

export const getUserByUsernameService = async (username) => {
    return await getUserByUsernameRepo(username);
}

export const getUserByIdService = async (id) => {
    return await getUserByIdRepo(id);
}

export const deleteUserService = async (id) => {
    return await deleteUserRepo(id);
}

export const updateUserService = async (id, data) => {
    return await updateUserRepo(id, data);
}
