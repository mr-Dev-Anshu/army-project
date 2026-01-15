import { FieldSuggestion } from "@/models/FiledSuggestion";

/**
 * Generic function to track suggestions for any model/data
 * @param {Object} data - The incoming body/object (e.g., GeneralTrafficOffence)
 * @param {Object} config - Configuration for the model
 *   - fields: Array<string> → top-level string fields to track
 *   - nestedFields: Object → { 'path.to.field': 'fieldType' }
 *   - arrayFields: Object → { 'path.to.array': 'fieldType' } → for arrays of strings
 *   - arrayObjectFields: Object → { 'path.to.array': { 'objectField': 'fieldType' } } → for arrays of objects
 *   - trackCustomFields: 'specific' | 'generic' | false
 */
async function trackFieldSuggestions(data, config = {}) {
  if (!data || typeof data !== 'object') return;

  const {
    fields = [],
    nestedFields = {},
    arrayFields = {},
    arrayObjectFields = {},
    trackCustomFields = 'specific',
  } = config;

  const updatePromises = [];

  // 1. Top-level fields
  for (const field of fields) {
    if (data[field] && typeof data[field] === 'string') {
      updatePromises.push(updateSuggestion(field, data[field]));
    }
  }

  // 2. Nested fields
  for (const [path, fieldType] of Object.entries(nestedFields)) {
    const value = getNestedValue(data, path);
    if (value && typeof value === 'string') {
      updatePromises.push(updateSuggestion(fieldType, value));
    }
  }

  // 3. Array fields (strings)
  for (const [path, fieldType] of Object.entries(arrayFields)) {
    const arrayValue = getNestedValue(data, path);
    if (Array.isArray(arrayValue)) {
      for (const item of arrayValue) {
        if (typeof item === 'string' && item.trim()) {
          updatePromises.push(updateSuggestion(fieldType, item.trim()));
        }
      }
    }
  }

  // 4. Array Object fields (e.g., workers: [{ name: '...', type: '...' }])
  for (const [arrayPath, fieldMapping] of Object.entries(arrayObjectFields)) {
    const arrayValue = getNestedValue(data, arrayPath);
    if (Array.isArray(arrayValue)) {
      for (const item of arrayValue) {
        if (item && typeof item === 'object') {
          for (const [objField, fieldType] of Object.entries(fieldMapping)) {
            const value = getNestedValue(item, objField);
            if (value && typeof value === 'string') {
              updatePromises.push(updateSuggestion(fieldType, value));
            }
          }
        }
      }
    }
  }

  // 5. Custom fields
  if (trackCustomFields) {
    extractFromCustomFields(data, updatePromises, trackCustomFields);
  }

  // Execute all updates in parallel
  if (updatePromises.length > 0) {
    await Promise.all(updatePromises).catch(err => {
      console.error("Error tracking suggestions:", err);
    });
  }
}

// Helper: Get nested value safely
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// Helper: Recursively find and track all customFields
function extractFromCustomFields(obj, promisesArray, mode) {
  function traverse(current) {
    if (!current || typeof current !== 'object') return;
    if (Array.isArray(current)) {
      current.forEach(traverse);
      return;
    }

    for (const [key, value] of Object.entries(current)) {
      if (key === 'customFields' && typeof value === 'object' && value !== null) {
        for (const [cfKey, cfValue] of Object.entries(value)) {
          if (typeof cfValue === 'string' && cfValue.trim()) {
            if (mode === 'generic') {
              promisesArray.push(updateSuggestion('customField', cfValue.trim()));
            } else {
              promisesArray.push(updateSuggestion(`custom.${cfKey}`, cfValue.trim()));
            }
          }
        }
      }

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value);
      }
    }
  }

  traverse(obj);
}

// Core: Upsert suggestion
async function updateSuggestion(fieldType, rawValue) {
  const value = rawValue.trim();
  if (!value) return;

  const lowercaseValue = value.toLowerCase();

  try {
    await FieldSuggestion.findOneAndUpdate(
      { fieldType, value: lowercaseValue },
      {
        $setOnInsert: { value: lowercaseValue },
        $inc: { count: 1 },
        $set: { lastUsed: new Date() },
      },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Suggestion update failed [${fieldType}]: ${lowercaseValue}`, err.message);
  }
}

export default trackFieldSuggestions;