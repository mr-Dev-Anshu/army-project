// services/shopkeeperSecurityPassService.js
import {
  createShopkeeperRepo,
  findAllShopkeepersRepo,
  findShopkeeperByIdRepo,
  updateShopkeeperByIdRepo,
  deleteShopkeeperByIdRepo,
} from "@/reposetories/Shopkeeper.repo";

export async function createShopkeeperSecurityPass(data) {
  return await createShopkeeperRepo(data);
}

export async function getAllShopkeeperSecurityPasses() {
  return await findAllShopkeepersRepo();
}

export async function getShopkeeperSecurityPassById(id) {
  return await findShopkeeperByIdRepo(id);
}

export async function updateShopkeeperSecurityPass(id, data) {
  return await updateShopkeeperByIdRepo(id, data);
}

export async function deleteShopkeeperSecurityPass(id) {
  return await deleteShopkeeperByIdRepo(id);
}