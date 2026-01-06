export interface Reference {
  _id: string;
  reference: string;
}

export interface OffenceData {
  offenceType: string;
  references: string[];
}
