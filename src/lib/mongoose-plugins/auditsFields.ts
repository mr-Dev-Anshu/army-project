// lib/mongoose-plugins/auditFields.ts

import { Schema, Document, Model } from 'mongoose';


interface AuditOptions {
  createdByField?: string;   
  updatedByField?: string;   
}

export function auditFieldsPlugin(schema: Schema, options: AuditOptions = {}) {
  const createdByField = options.createdByField || 'createdBy';
  const updatedByField = options.updatedByField || 'updatedBy';
   console.log(schema , "this is schema here ")
  if (!schema.paths[createdByField]) {
    console.log("creating created by ")
    schema.add({
      [createdByField]: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    });
  }

  if (!schema.paths[updatedByField]) {
    console.log("creating updated by ")
    schema.add({
      [updatedByField]: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    });
  }

  schema.pre('save', function (next) {
    const userId = getCurrentUserId(); 

    if (this.isNew && userId) {
      this[createdByField] = userId;
    }

    if (userId) {
      this[updatedByField] = userId;
    }

    next();
  });

  const updateOps = ['updateOne', 'findOneAndUpdate', 'updateMany', 'findByIdAndUpdate'];

  updateOps.forEach((method) => {
    schema.pre(method, function (next) {
      const userId = getCurrentUserId();
      if (userId) {
        this.set(`${updatedByField}`, userId);
      }
      next();
    });
  });
}

let currentUserId: string | null = null;

export function setCurrentUserId(id: string | null) {
  currentUserId = id;
}

export function getCurrentUserId(): string | null {
  return currentUserId;
}