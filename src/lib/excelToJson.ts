import * as XLSX from "xlsx";

/**
 * Converts an Excel file buffer to JSON using row 1 as keys.
 * Row 2 (headings) is skipped.
 * Data starts from row 3.
 */
export function excelToJson<T = any>(buffer: ArrayBuffer): T[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert sheet to array of arrays
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];

  if (!rows || rows.length < 3) {
    return [];
  }

  // 1. Extract the hidden keys from Row 1
  const keys = rows[0].map((key: any) => String(key || "").trim());

  // 2. Skip rows[1] (The Display Headings)

  // 3. Process data starting from row index 2 (the 3rd row)
  const dataRows = rows.slice(2);

  return dataRows.map((row) => {
    const obj: any = {};
    keys.forEach((key, index) => {
      const value = row[index];
      obj[key] = value === undefined || value === null ? null : String(value).trim();
    });
    return obj as T;
  });
}