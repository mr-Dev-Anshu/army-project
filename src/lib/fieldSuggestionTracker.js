import { FieldSuggestion } from "@/models/FiledSuggestion";

/**
 * Generic function to track suggestions for any model/data
 * @param {Object} data - The incoming body/object (e.g., GeneralTrafficOffence)
 * @param {Object} config - Configuration for the model
 *   - fields: Array<string> → top-level string fields to track
 *   - nestedFields: Object → { 'path.to.field': 'fieldType' }
 *   - arrayFields: Object → { 'path.to.array': 'fieldType' } → for arrays like offenceTypes
 *   - trackCustomFields: 'specific' | 'generic' | false
 *       → 'specific': custom.helmetWorn, custom.reason
 *       → 'generic': sab 'customField' mein
 *       → false: skip custom fields
 */
async function trackFieldSuggestions(data, config = {}) {
  if (!data || typeof data !== 'object') return;

  const {
    fields = [],
    nestedFields = {},
    arrayFields = {},
    trackCustomFields = 'specific',
  } = config;

  const updatePromises = [];

  // 1. Top-level fields (e.g., vehicleNumber, vehicleName)
  for (const field of fields) {
    if (data[field] && typeof data[field] === 'string') {
      updatePromises.push(updateSuggestion(field, data[field]));
    }
  }

  // 2. Nested fields (e.g., onDutyDetails.dutyLocation)
  for (const [path, fieldType] of Object.entries(nestedFields)) {
    const value = getNestedValue(data, path);
    if (value && typeof value === 'string') {
      updatePromises.push(updateSuggestion(fieldType, value));
    }
  }

  // 3. Array fields (e.g., offenceTypes[], offenceTypeReference[])
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

  // 4. Custom fields (root + sab nested customFields objects se)
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

// Helper: Get nested value safely (e.g., data.onDutyDetails.dutyLocation)
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// Helper: Recursively find and track all customFields (at any nesting level)
function extractFromCustomFields(obj, promisesArray, mode) {
  function traverse(current) {
    if (!current || typeof current !== 'object') return;
    if (Array.isArray(current)) {
      current.forEach(traverse);
      return;
    }

    for (const [key, value] of Object.entries(current)) {
      // Agar customFields mila → uske andar ke strings track karo
      if (key === 'customFields' && typeof value === 'object' && value !== null) {
        for (const [cfKey, cfValue] of Object.entries(value)) {
          if (typeof cfValue === 'string' && cfValue.trim()) {
            if (mode === 'generic') {
              promisesArray.push(updateSuggestion('customField', cfValue.trim()));
            } else {
              // 'specific' mode
              promisesArray.push(updateSuggestion(`custom.${cfKey}`, cfValue.trim()));
            }
          }
        }
      }

      // Deep traverse for nested objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value);
      }
    }
  }

  traverse(obj);
}

// Core: Upsert suggestion with count++ and update lastUsed
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