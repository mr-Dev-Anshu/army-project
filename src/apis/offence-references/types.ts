// src/features/offence-references/types.ts

/**
 * Minimal reference shape used for display in the UI
 */
export interface Reference {
  _id: string;
  reference: string;
}

/**
 * Full offence reference document as returned from the API
 */
export interface OffenceReference {
  _id: string;
  offenceType: string;
  reference: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload for creating a new offence reference
 */
export interface CreateOffenceReferencePayload {
  offenceType: string;
  reference: string;
}

/**
 * Query parameters for fetching offence references
 * Used in useGetOffenceReferences(offenceType, searchQuery)
 */
export interface GetOffenceReferencesQuery {
  offenceType: string;     // lowercase offence type (e.g., "theft")
  searchQuery?: string;    // optional search term to filter references
}

/**
 * Shape of the final offence data (if you ever need to group again)
 */
export interface OffenceData {
  offenceType: string;
  references: string[]; // array of reference _id strings
}