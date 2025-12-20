export interface GeneralTrafficOffence {
  _id?: string;
  offenceType?: string;
  description?: string;
  fineAmount?: number;
  points?: number;
  [key: string]: any;
}

export interface CreateTrafficOffenceData {
  offenceType: string;
  description?: string;
  fineAmount?: number;
  points?: number;
}

export interface UpdateTrafficOffenceData extends Partial<CreateTrafficOffenceData> {}