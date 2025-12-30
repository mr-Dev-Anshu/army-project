export type OffenderType =
  | "Military Person"
  | "Civilian"
  | "Employee"
  | "Servant/Maid"
  | "Shop Keeper"
  | "Temporary Hired Worker";

export interface CivilianOffenderDetails {
  name: string;
  fatherNameOrHusbandName: string;
  address: string;
  aadharNumber: string;
}

export interface MilitaryOffenderDetails {
  armyNumber: string;
  rank: string;
  name: string;
  unit: string;
  fmn: string;
  command: string;
  address: string;
  iCardNumber: string;
}

export type OffenderDetails =
  | CivilianOffenderDetails
  | MilitaryOffenderDetails
  | Record<string, any>;

export interface CreateOffenderData {
  offenceId: string;
  offenderType: OffenderType;
  offenderDetails: OffenderDetails;
}
