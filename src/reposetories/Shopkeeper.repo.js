// repositories/shopkeeperSecurityPassRepository.js

import { ShopkeeperSecurityPass } from "@/models/ShopKeeper";
import trackFieldSuggestions from "@/lib/fieldSuggestionTracker";
import { SHOPKEEPER_SUGGESTION_CONFIG } from "@/lib/fieldSuggestionConfig/Shopkeeper";


export async function createShopkeeperRepo(data) {
  const result = await new ShopkeeperSecurityPass(data).save();
  // Track suggestions asynchronously
  trackFieldSuggestions(data, SHOPKEEPER_SUGGESTION_CONFIG);
  return result;
}

export async function findAllShopkeepersRepo() {
  return await ShopkeeperSecurityPass.find({}).sort({ createdAt: -1 });
}

export async function findShopkeeperByIdRepo(id) {
  return await ShopkeeperSecurityPass.findById(id);
}

export async function updateShopkeeperByIdRepo(id, data) {
  const result = await ShopkeeperSecurityPass.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (result) {
    trackFieldSuggestions(data, SHOPKEEPER_SUGGESTION_CONFIG);
  }
  return result;
}

export async function deleteShopkeeperByIdRepo(id) {
  return await ShopkeeperSecurityPass.findByIdAndDelete(id);
}
