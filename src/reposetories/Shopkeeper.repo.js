// repositories/shopkeeperSecurityPassRepository.js

import { ShopkeeperSecurityPass } from "@/models/ShopKeeper";


export async function createShopkeeperRepo(data) {
  const pass = new ShopkeeperSecurityPass(data);
  return await pass.save();
}

export async function findAllShopkeepersRepo() {
  return await ShopkeeperSecurityPass.find({}).sort({ createdAt: -1 });
}

export async function findShopkeeperByIdRepo(id) {
  return await ShopkeeperSecurityPass.findById(id);
}

export async function updateShopkeeperByIdRepo(id, data) {
  return await ShopkeeperSecurityPass.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteShopkeeperByIdRepo(id) {
  return await ShopkeeperSecurityPass.findByIdAndDelete(id);
}