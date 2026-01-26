// services/user.service.js
import bcrypt from 'bcryptjs';

import  {
  createUserRepo,
  getAllUsersRepo,
  getUserByUsernameRepo,
  getUserByIdRepo,
  deleteUserRepo,
  updateUserRepo,
}  from '@/reposetories/user.repo'; 
import { hashPassword } from '@/utils/hashPassword';

export async function createUserService(userData) {
  try {
    if (!userData.username || !userData.password) {
      throw new Error('Username and password are required');
    }

    if (typeof userData.username !== 'string' || userData.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (typeof userData.password !== 'string' || userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const existing = await getUserByUsernameRepo(userData.username);
    if (existing) {
      throw new Error('Username already taken');
    }

    const dataToSave = { ...userData };

    if (dataToSave.password) {
      dataToSave.password = await hashPassword(dataToSave.password);
    }

    if (dataToSave.email && typeof dataToSave.email === 'string') {
      dataToSave.email = dataToSave.email.trim().toLowerCase();
    }
    if (dataToSave.armyNo && typeof dataToSave.armyNo === 'string') {
      dataToSave.armyNo = dataToSave.armyNo.trim();
    }
    if (dataToSave.unit && typeof dataToSave.unit === 'string') {
      dataToSave.unit = dataToSave.unit.trim();
    }
    if (dataToSave.rank && typeof dataToSave.rank === 'string') {
      dataToSave.rank = dataToSave.rank.trim();
    }
    if (dataToSave.username && typeof dataToSave.username === 'string') {
      dataToSave.username = dataToSave.username.trim();
    }

    const created = await createUserRepo(dataToSave);

    const { password, ...safeUser } = created.toObject
      ? created.toObject()
      : created;

    return safeUser;
  } catch (err) {
    throw new Error(err.message || 'Failed to create user');
  }
}

async function getAllUsersService(query = {}) {
  return await getAllUsersRepo(query);
}

async function getUserByUsernameService(username) {
  return await getUserByUsernameRepo(username);
}

async function getUserByIdService(id) {
  return await getUserByIdRepo(id);
}

async function deleteUserService(id) {
  return await deleteUserRepo(id);
}

async function updateUserService(id, data) {
  return await updateUserRepo(id, data);
}

async function loginUserService(username, password) {
  const user = await getUserByUsernameService(username);
   console.log(user , "this is user")
  if (!user) {
    throw new Error('Invalid username or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Invalid username or password');
  }

//   const { password, ...safeUser } = user;
  return user;
}

 export  {
  createUserService,
  getAllUsersService,
  getUserByUsernameService,
  getUserByIdService,
  deleteUserService,
  updateUserService,
  loginUserService,
};