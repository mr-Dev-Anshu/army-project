/**
 * Converts a CSV string to JSON using row 1 as keys.
 * Row 2 (headings) is skipped.
 * Data starts from row 3.
 */
export function csvToJsonWithHiddenKeys<T = any>(csvString: string): T[] {
  if (!csvString) return [];

  // Split by lines and filter out empty rows
  const rows = csvString.trim().split(/\r?\n/);

  if (rows.length < 3) {
    throw new Error("CSV must have at least 3 rows: keys, headings, and data.");
  }

  // 1. Extract the hidden keys from Row 1
  const keys = rows[0].split(',').map(key => key.trim());

  // 2. We skip rows[1] (The Display Headings)
  
  // 3. Process data starting from row index 2 (the 3rd row)
  const dataRows = rows.slice(2);

  return dataRows.map((row) => {
    const values = row.split(',');
    const obj: any = {};

    keys.forEach((key, index) => {
      // Handle potential commas in values or missing data
      const value = values[index]?.trim();
      obj[key] = value ?? null;
    });

    return obj as T;
  });
}