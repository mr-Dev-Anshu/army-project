// lib/mongoose-plugins/auditFields.js

import { Schema } from 'mongoose';

export function auditFieldsPlugin(schema, options = {}) {
  const createdByField = options.createdByField || 'createdBy';
  const updatedByField = options.updatedByField || 'updatedBy';

  if (!schema.paths[createdByField]) {
    schema.add({
      [createdByField]: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    });
  }

  if (!schema.paths[updatedByField]) {
    schema.add({
      [updatedByField]: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
    });
  }

  // Pre-save hook using async/await (no next callback)
  schema.pre('save', async function () {
    try {
      const userId = getCurrentUserId();
      if (this.isNew && userId) {
        this[createdByField] = userId;
      }
      if (userId) {
        this[updatedByField] = userId;
      }
    } catch (error) {
      console.error('Audit Plugin pre-save Error:', error);
      throw error;
    }
  });

  // Pre-update hooks using async/await (no next callback)
  const updateOps = ['updateOne', 'findOneAndUpdate', 'updateMany', 'findByIdAndUpdate'];

  updateOps.forEach((method) => {
    schema.pre(method, async function () {
      try {
        const userId = getCurrentUserId();
        if (userId) {
          this.set(`${updatedByField}`, userId);
        }
      } catch (error) {
        console.error(`Audit Plugin ${method} Error:`, error);
        throw error;
      }
    });
  });
}

let currentUserId = null;

export function setCurrentUserId(id) {
  currentUserId = id;
}

export function getCurrentUserId() {
  return currentUserId;
}
