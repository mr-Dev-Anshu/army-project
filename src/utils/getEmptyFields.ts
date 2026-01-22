// Optional fields to skip
const OPTIONAL_FIELDS = ["remarks", "time", "customFields.remarks"];

export const getMissingFields = (data: any, parentKey = ""): string[] => {
    if (!data || typeof data !== "object") return [];

    // Skip arrays for now; assume empty array is valid or handled elsewhere
    if (Array.isArray(data)) return [];

    let missing: string[] = [];

    Object.keys(data).forEach((key) => {
        const value = data[key];
        const currentKey = parentKey ? `${parentKey}.${key}` : key;

        // Skip optional fields
        if (OPTIONAL_FIELDS.some(field => currentKey.endsWith(field))) {
            return;
        }

        // Check for empty values
        if (
            value === "" ||
            value === null ||
            value === undefined ||
            (Array.isArray(value) && value.length === 0)
        ) {
            missing.push(currentKey);
        } else if (typeof value === "object") {
            // Recursively check nested objects
            missing = [...missing, ...getMissingFields(value, currentKey)];
        }
    });

    return missing;
};
