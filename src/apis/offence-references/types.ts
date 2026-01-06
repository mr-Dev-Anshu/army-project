/* =====================
   OFFENCE REFERENCE TYPES
===================== */

export interface OffenceReference {
  _id: string;
  offenceType: string;
  reference: string;
  createdAt?: string;
  updatedAt?: string;
}

/* =====================
   PAYLOAD TYPES
===================== */

export interface CreateOffenceReferencePayload {
  offenceType: string;
  reference: string;
}

/* =====================
   QUERY TYPES
===================== */

export interface GetOffenceReferenceQuery {
  offenceType?: string;
  search?: string;
}
