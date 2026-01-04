import { Trash2 } from "lucide-react";

interface DynamicOffenderListProps {
  data?: any[];
  title?: string;
  onDelete?: (index: number) => void;
}

export default function DynamicOffenderList({
  data = [],
  title = "Victim / Offender List",
  onDelete = (index: number) => {},
}: DynamicOffenderListProps) {
  const offenders = data;
  if (!offenders.length) return null;

  // convert any key into pretty label
  const formatFieldName = (key: string) => {
    return key
      ?.replace(/_/g, " ")
      ?.replace(/\s+/g, " ")
      ?.replace(/([A-Z])/g, " $1")
      ?.replace(/\b\w/g, (c) => c.toUpperCase())
      ?.trim();
  };

  // helper -> get keys belonging to a column (by fuzzy match)
  const pickMatching = (obj: any, keywords: string[] = []) => {
    return Object.entries(obj)
      .filter(([k, v]) => {
        if (!v) return false;

        return keywords.some((word) =>
          k.toLowerCase().includes(word.toLowerCase())
        );
      })
      .map(([k, v]) => ({ key: k, value: v }));
  };

  return (
    <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200">
        <h3 className="font-normal text-base text-gray-900">{title}:</h3>

        <span className="text-blue-600 font-normal text-base">
          ({String(offenders.length).padStart(2, "0")})
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold w-14 border-r">
                Sno.
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold border-r">
                Army No / Rank / Name
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold border-r">
                Identity Card
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold border-r">
                Unit / FMN / Address
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Remark
              </th>
            </tr>
          </thead>

          <tbody>
            {offenders.map((off, i) => {
              const col1 = pickMatching(off, [
                "army",
                "rank",
                "rider",
                "driver",
                "name",
                "witness",
              ]);

              const col2 = pickMatching(off, ["id", "card"]);

              const col3 = pickMatching(off, [
                "unit",
                "fmn",
                "address",
                "command",
              ]);

              return (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium border-r">{i + 1}.</td>

                  {/* Column 1 */}
                  <td className="px-4 py-3 text-sm border-r align-top">
                    {col1.length ? (
                      col1.map((f) => (
                        <div key={f.key}>
                          <b>{formatFieldName(f.key)}:</b> {String(f.value)}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>

                  {/* Column 2 */}
                  <td className="px-4 py-3 text-sm border-r align-top">
                    {col2.length ? (
                      col2.map((f) => <div key={f.key}>{String(f.value)}</div>)
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>

                  {/* Column 3 */}
                  <td className="px-4 py-3 text-sm border-r align-top">
                    {col3.length ? (
                      col3.map((f) => (
                        <div key={f.key}>
                          <b>{formatFieldName(f.key)}:</b> {String(f.value)}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>

                  {/* Remark */}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">--</span>

                      <button
                        className="text-gray-400 hover:text-red-600"
                        onClick={() => onDelete(i)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
