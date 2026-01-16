import { Trash2 } from "lucide-react";

type GenericObject = Record<string, unknown>;

interface DynamicOffenderListProps {
  data?: any[];
  title?: string;
  onDelete?: (index: number) => void;
}

export default function DynamicOffenderList({
  data = [],
  title = "Victim / Offender List",
  onDelete = (index: number) => { },
}: DynamicOffenderListProps) {
  if (!data.length) return null;

  /* ================= FORMAT LABEL ================= */
  const formatFieldName = (key: string): string =>
    key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

  /* ================= PICK BY KEYWORDS ================= */
  const pickMatching = (
    obj: GenericObject,
    keywords: string[]
  ): { key: string; value: unknown }[] =>
    Object.entries(obj)
      .filter(
        ([k, v]) =>
          v !== undefined &&
          v !== null &&
          v !== "" &&
          keywords.some((word) =>
            k.toLowerCase().includes(word.toLowerCase())
          )
      )
      .map(([k, v]) => ({ key: k, value: v }));

  return (
    <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex justify-between items-center px-6 py-3 border-b">
        <h3 className="text-base">{title}:</h3>
        <span className="text-blue-600">
          ({String(data.length).padStart(2, "0")})
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 w-14 border-r">Sno.</th>
              <th className="px-4 py-3 border-r">
                Army No / Rank / Name
              </th>
              <th className="px-4 py-3 border-r">Identity Card</th>
              <th className="px-4 py-3 border-r">
                Unit / FMN / Address
              </th>
              <th className="px-4 py-3">Remark</th>
            </tr>
          </thead>

          <tbody>
            {data.map((off, i) => {
              /* 🔥 SUPPORT BOTH SHAPES */
              const source: GenericObject = {
                ...off,
                ...((off as any).details || {}),
              };

              /* 🔥 ROLE / TYPE LABEL */
              const roleLabel =
                (off as any).role ||
                (off as any).offenderType ||
                (off as any).type ||
                "Unknown";

              const col1 = pickMatching(source, [
                "army",
                "armynumber",
                "rank",
                "name",
                "driver",
                "rider",
                "vehicle", // Catch vehicle fields
                "type",
                "role",
              ]);

              const col2 = pickMatching(source, [
                "id",
                "card",
                "icard",
                "icardnumber",
                "pass", // Catch pass numbers
                "issue",
                "expire",
              ]);

              const col3 = pickMatching(source, [
                "unit",
                "fmn",
                "address",
                "command",
                "place", // Catch place of work/stay
                "work",
                "stay",
              ]);

              return (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 border-r">
                    {i + 1}. <br />
                    <span className="text-xs font-semibold text-gray-500">{roleLabel}</span>
                  </td>

                  {/* ===== COLUMN 1 ===== */}
                  <td className="px-4 py-3 border-r align-top text-sm">
                    {col1.length ? (
                      col1.map((f) => (
                        <div key={f.key}>
                          <span className="font-medium text-gray-700">{formatFieldName(f.key)}:</span>{" "}
                          {String(f.value)}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>

                  {/* ===== COLUMN 2 ===== */}
                  <td className="px-4 py-3 border-r align-top text-sm">
                    {col2.length ? (
                      col2.map((f) => (
                        <div key={f.key}>
                          <span className="font-medium text-gray-700">{formatFieldName(f.key)}:</span>{" "}
                          {String(f.value)}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>

                  {/* ===== COLUMN 3 ===== */}
                  <td className="px-4 py-3 border-r align-top text-sm">
                    {col3.length ? (
                      col3.map((f) => (
                        <div key={f.key}>
                          <span className="font-medium text-gray-700">{formatFieldName(f.key)}:</span>{" "}
                          {String(f.value)}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>

                  {/* ===== DELETE ===== */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onDelete(i)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
