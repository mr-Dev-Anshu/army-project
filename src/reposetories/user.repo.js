import { User } from "@/models/user";

export const createUserRepo = async (data) => {
    try {
        const user = await User.create(data);
        return user;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

export const getAllUsersRepo = async () => {
    try {
        return await User.find({}).sort({ createdAt: -1 });
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}

export const getUserByUsernameRepo = async (username) => {
    try {
        return await User.findOne({ username });
    } catch (error) {
        throw new Error(`Error finding user: ${error.message}`);
    }
};

export const getUserByIdRepo = async (id) => {
    try {
        return await User.findById(id);
    } catch (error) {
        throw new Error(`Error finding user by id: ${error.message}`);
    }
}

export const deleteUserRepo = async (id) => {
    try {
        return await User.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
}

export const updateUserRepo = async (id, data) => {
    try {
        return await User.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}
