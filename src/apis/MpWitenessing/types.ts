import { OffenceOccurenceDetails, OnDutyDetails, OnDutyDetailsMPReporting } from "@/common/types/form.types";

// ----- WITNESS -----
export interface Witness {
  dutyBlock: OnDutyDetails;
  reportingBlock: OnDutyDetailsMPReporting;
  offenceBlock: OffenceOccurenceDetails;

  _id?: string;
  __v?: number;
  [key: string]: any;
}

// ----- PAYLOAD -----
export interface CreateWitnessData {
  offenceId: string;
  witnesses: Witness[];
}

export interface UpdateWitnessData extends Partial<CreateWitnessData> {}