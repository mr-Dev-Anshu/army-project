// components/forms/types.ts

// Existing types... (keep all previous)

export interface MaidServantFamilyMember {
  name: string;
  relationship: string;
  age: string; // e.g., "18 Year old"
}

export interface MaidServant {
  qtrNumber: string;
  ownerName: string;
  ownerRank: string;
  ownerUnit: string;

  servantName: string;
  servantMobile: string;
  servantAadhar: string;
  permanentAddressLine: string;
  permanentCityDistrict: string;
  permanentState: string;
  permanentPincode: string;

  passNumber: string;
  validFrom: string | null;
  validTill: string | null;

  familyMembers: MaidServantFamilyMember[];
}

export interface TempFamilyMember {
  name: string;
  relationship: string;
  age: string;
}