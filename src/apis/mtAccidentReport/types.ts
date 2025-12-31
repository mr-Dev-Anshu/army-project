export interface MTAccidentReport {
  _id?: string;
  individualType?: string;
  dateOfAccident?: Date;
  timeOfAccident?: string;
  placeOfAccident?: string;
  typeOfAccident?: string;
  probableCause?: string;
  vehicleNumber?: string;
  makeAndModel?: string;
  injuredCivil?: number;
  injuredMilitary?: number;
  diedCivil?: number;
  diedMilitary?: number;
  firCaseNumber?: string;
  firDate?: Date;
  firPoliceStation?: string;
  actionStatus?: boolean;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMTAccidentReportData {
  individualType: string;
  dateOfAccident: Date;
  timeOfAccident: string;
  placeOfAccident: string;
  typeOfAccident: string;
  probableCause: string;
  vehicleNumber?: string;
  makeAndModel?: string;
  injuredCivil?: number;
  injuredMilitary?: number;
  diedCivil?: number;
  diedMilitary?: number;
  firCaseNumber?: string;
  firDate?: Date;
  firPoliceStation?: string;
  actionStatus?: boolean;
  remark?: string;
}

export interface UpdateMTAccidentReportData extends Partial<CreateMTAccidentReportData> {}
