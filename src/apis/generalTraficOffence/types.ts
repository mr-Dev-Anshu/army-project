import { OffenderPerson, OffenderWithoutVehicleState, VehicleDetailsState, Witness } from "@/common/types/form.types";

export interface GeneralTrafficOffence {
  _id?: string;
  offenceType?: string;
  description?: string;
  fineAmount?: number;
  points?: number;
  [key: string]: any;
}

export interface CreateTrafficOffenceData {
  isVehicleInvolved: boolean;
  vehicleDetails?: VehicleDetailsState;
  offenderWithoutVehicle?: OffenderWithoutVehicleState;
  witnesses: Witness[];
  offenderPeople: OffenderPerson[];
  remarks?: string;
  actionStatus?: boolean;
  customFields?: Record<string, any>;
}


export interface UpdateTrafficOffenceData extends Partial<CreateTrafficOffenceData> { }