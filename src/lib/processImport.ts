/**
 * Reusable function to process imported data (JSON) using a mutation function (from a custom hook).
 * @param json - The data to import (can be an array or a single object).
 * @param mutationFn - The mutation function to call for each record.
 */
export async function processImport(
  json: any,
  mutationFn: (data: any) => Promise<any>
) {
  if (Array.isArray(json)) {
    await Promise.all(json.map((item) => mutationFn(item)));
  } else if (json) {
    await mutationFn(json);
  }
}