/**
 * Offline Database using Dexie.js (IndexedDB wrapper)
 * 
 * This provides MongoDB-like storage that works completely offline
 * in the Electron desktop application.
 */

import Dexie, { Table } from 'dexie';

// Generate MongoDB-like ObjectId
export function generateId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return timestamp + random;
}

// Database schema types
export interface GeneralTrafficOffence {
  _id: string;
  offenceType?: string;
  status?: string;
  vehicleType?: string;
  vehicleCategory?: string;
  isVehicleInvolved?: boolean;
  date?: string;
  location?: string;
  description?: string;
  offenderDetails?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface SpeedCheckRecord {
  _id: string;
  date?: string;
  location?: string;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface MpReport {
  _id: string;
  date?: string;
  location?: string;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface WitnessingMp {
  _id: string;
  date?: string;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface Offender {
  _id: string;
  name?: string;
  details?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface FieldSuggestion {
  _id: string;
  field: string;
  value: string;
  count: number;
}

// Database class
class ArmyProjectDB extends Dexie {
  generalTrafficOffences!: Table<GeneralTrafficOffence, string>;
  speedCheckRecords!: Table<SpeedCheckRecord, string>;
  mpReports!: Table<MpReport, string>;
  witnessingMps!: Table<WitnessingMp, string>;
  offenders!: Table<Offender, string>;
  fieldSuggestions!: Table<FieldSuggestion, string>;

  constructor() {
    super('ArmyProjectDB');
    
    this.version(1).stores({
      generalTrafficOffences: '_id, offenceType, status, date, createdAt',
      speedCheckRecords: '_id, date, createdAt',
      mpReports: '_id, date, createdAt',
      witnessingMps: '_id, date, createdAt',
      offenders: '_id, name, createdAt',
      fieldSuggestions: '_id, field, value, count',
    });
  }
}

// Singleton database instance
export const db = new ArmyProjectDB();

// Helper function to create a record with timestamps
function createRecord<T extends { _id?: string }>(data: T): T & { _id: string; createdAt: string; updatedAt: string } {
  const now = new Date().toISOString();
  return {
    ...data,
    _id: data._id || generateId(),
    createdAt: now,
    updatedAt: now,
  };
}

// Helper function to update timestamps
function updateRecord<T>(data: T): T & { updatedAt: string } {
  return {
    ...data,
    updatedAt: new Date().toISOString(),
  };
}

// Database operations that mirror MongoDB API
export const offlineDb = {
  // General Traffic Offences
  generalTrafficOffences: {
    async create(data: Partial<GeneralTrafficOffence>): Promise<GeneralTrafficOffence> {
      const record = createRecord(data as GeneralTrafficOffence);
      await db.generalTrafficOffences.add(record);
      return record;
    },

    async getAll(): Promise<GeneralTrafficOffence[]> {
      return db.generalTrafficOffences.toArray();
    },

    async getById(id: string): Promise<GeneralTrafficOffence | undefined> {
      return db.generalTrafficOffences.get(id);
    },

    async update(id: string, data: Partial<GeneralTrafficOffence>): Promise<GeneralTrafficOffence | undefined> {
      const existing = await db.generalTrafficOffences.get(id);
      if (!existing) return undefined;
      
      const updated = updateRecord({ ...existing, ...data, _id: id });
      await db.generalTrafficOffences.put(updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      await db.generalTrafficOffences.delete(id);
      return true;
    },

    async getGroupedByOffenceType(filters: Record<string, string> = {}): Promise<{ _id: string; count: number; records: GeneralTrafficOffence[] }[]> {
      let records = await db.generalTrafficOffences.toArray();
      
      // Apply filters
      if (filters.offenceType) {
        records = records.filter(r => r.offenceType === filters.offenceType);
      }
      if (filters.status) {
        records = records.filter(r => r.status === filters.status);
      }
      if (filters.date) {
        records = records.filter(r => r.date === filters.date);
      }
      
      // Group by offenceType
      const grouped = records.reduce((acc, record) => {
        const type = record.offenceType || 'Unknown';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(record);
        return acc;
      }, {} as Record<string, GeneralTrafficOffence[]>);
      
      return Object.entries(grouped).map(([type, items]) => ({
        _id: type,
        count: items.length,
        records: items,
      }));
    },
  },

  // Speed Check Records
  speedCheckRecords: {
    async create(data: Partial<SpeedCheckRecord>): Promise<SpeedCheckRecord> {
      const record = createRecord(data as SpeedCheckRecord);
      await db.speedCheckRecords.add(record);
      return record;
    },

    async getAll(): Promise<SpeedCheckRecord[]> {
      return db.speedCheckRecords.toArray();
    },

    async getById(id: string): Promise<SpeedCheckRecord | undefined> {
      return db.speedCheckRecords.get(id);
    },

    async update(id: string, data: Partial<SpeedCheckRecord>): Promise<SpeedCheckRecord | undefined> {
      const existing = await db.speedCheckRecords.get(id);
      if (!existing) return undefined;
      
      const updated = updateRecord({ ...existing, ...data, _id: id });
      await db.speedCheckRecords.put(updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      await db.speedCheckRecords.delete(id);
      return true;
    },
  },

  // MP Reports
  mpReports: {
    async create(data: Partial<MpReport>): Promise<MpReport> {
      const record = createRecord(data as MpReport);
      await db.mpReports.add(record);
      return record;
    },

    async getAll(): Promise<MpReport[]> {
      return db.mpReports.toArray();
    },

    async getById(id: string): Promise<MpReport | undefined> {
      return db.mpReports.get(id);
    },

    async update(id: string, data: Partial<MpReport>): Promise<MpReport | undefined> {
      const existing = await db.mpReports.get(id);
      if (!existing) return undefined;
      
      const updated = updateRecord({ ...existing, ...data, _id: id });
      await db.mpReports.put(updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      await db.mpReports.delete(id);
      return true;
    },
  },

  // Witnessing MPs
  witnessingMps: {
    async create(data: Partial<WitnessingMp>): Promise<WitnessingMp> {
      const record = createRecord(data as WitnessingMp);
      await db.witnessingMps.add(record);
      return record;
    },

    async getAll(): Promise<WitnessingMp[]> {
      return db.witnessingMps.toArray();
    },

    async getById(id: string): Promise<WitnessingMp | undefined> {
      return db.witnessingMps.get(id);
    },

    async update(id: string, data: Partial<WitnessingMp>): Promise<WitnessingMp | undefined> {
      const existing = await db.witnessingMps.get(id);
      if (!existing) return undefined;
      
      const updated = updateRecord({ ...existing, ...data, _id: id });
      await db.witnessingMps.put(updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      await db.witnessingMps.delete(id);
      return true;
    },
  },

  // Offenders
  offenders: {
    async create(data: Partial<Offender>): Promise<Offender> {
      const record = createRecord(data as Offender);
      await db.offenders.add(record);
      return record;
    },

    async getAll(): Promise<Offender[]> {
      return db.offenders.toArray();
    },

    async getById(id: string): Promise<Offender | undefined> {
      return db.offenders.get(id);
    },

    async update(id: string, data: Partial<Offender>): Promise<Offender | undefined> {
      const existing = await db.offenders.get(id);
      if (!existing) return undefined;
      
      const updated = updateRecord({ ...existing, ...data, _id: id });
      await db.offenders.put(updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      await db.offenders.delete(id);
      return true;
    },
  },

  // Field Suggestions
  fieldSuggestions: {
    async addOrUpdate(field: string, value: string): Promise<void> {
      const existing = await db.fieldSuggestions
        .where({ field, value })
        .first();
      
      if (existing) {
        await db.fieldSuggestions.update(existing._id, {
          count: existing.count + 1,
        });
      } else {
        await db.fieldSuggestions.add({
          _id: generateId(),
          field,
          value,
          count: 1,
        });
      }
    },

    async getSuggestions(field: string, query = ''): Promise<FieldSuggestion[]> {
      let results = await db.fieldSuggestions
        .where('field')
        .equals(field)
        .toArray();
      
      if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(r => 
          r.value.toLowerCase().includes(lowerQuery)
        );
      }
      
      return results
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
  },
};

export default offlineDb;
