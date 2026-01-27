// lib/mongoose-plugins/auditFields.js

const { Schema } = require('mongoose');

function auditFieldsPlugin(schema, options = {}) {
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

  // Pre-save hook
  schema.pre('save', function(next) {
    try {
      const userId = getCurrentUserId(); 

      if (this.isNew && userId) {
        this[createdByField] = userId;
      }

      if (userId) {
        this[updatedByField] = userId;
      }

      if (typeof next === 'function') {
        next();
      }
    } catch (error) {
      if (typeof next === 'function') {
        next(error);
      }
    }
  });

  // Pre-update hooks
  const updateOps = ['updateOne', 'findOneAndUpdate', 'updateMany', 'findByIdAndUpdate'];

  updateOps.forEach((method) => {
    schema.pre(method, function(next) {
      try {
        const userId = getCurrentUserId();
        if (userId) {
          this.set(`${updatedByField}`, userId);
        }
        
        if (typeof next === 'function') {
          next();
        }
      } catch (error) {
        if (typeof next === 'function') {
          next(error);
        }
      }
    });
  });
}

let currentUserId = null;

function setCurrentUserId(id) {
  currentUserId = id;
}

function getCurrentUserId() {
  return currentUserId;
}

module.exports = {
  auditFieldsPlugin,
  setCurrentUserId,
  getCurrentUserId
};
