import { User } from "@/models/user"
async function createUserRepo(data) {
  try {
    return await User.create(data);
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

async function getAllUsersRepo(query = {}) {
  try {
    return await User.find(query)
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

async function getUserByUsernameRepo(username) {
  try {
    return await User.findOne({ username: username.trim() })
      .select('+password')
      .lean();
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
}

// Return a full mongoose document (not lean) for authentication flows
async function getUserByUsernameForAuth(usernameOrEmail) {
  try {
    const trimmed = usernameOrEmail.trim();
    return await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${trimmed}$`, 'i') } },
        { email: { $regex: new RegExp(`^${trimmed}$`, 'i') } }
      ]
    }).select('+password');
  } catch (error) {
    throw new Error(`Error finding user for auth: ${error.message}`);
  }
}

async function getUserByIdRepo(id) {
  try {
    return await User.findById(id).lean();
  } catch (error) {
    throw new Error(`Error finding user by id: ${error.message}`);
  }
}

async function deleteUserRepo(id) {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
}

async function updateUserRepo(id, data) {
  try {
    if (data.password) {
      const user = await User.findById(id).select('+password');
      if (!user) throw new Error("User not found");

      const { _id, createdAt, updatedAt, __v, ...updateData } = data;
      Object.assign(user, updateData);

      await user.save();
      const result = user.toObject();
      delete result.password;
      return result;
    }
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(`Error updating user: ${error.message}`);
  }
}

export {
  createUserRepo,
  getAllUsersRepo,
  getUserByUsernameRepo,
  getUserByUsernameForAuth,
  getUserByIdRepo,
  deleteUserRepo,
  updateUserRepo,
};