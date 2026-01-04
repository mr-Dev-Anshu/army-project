import { Trash2 } from "lucide-react";

type GenericObject = Record<string, unknown>;

interface DynamicOffenderListProps {
  data?: GenericObject[];
  title?: string;
  onDelete?: (index: number) => void;
}

export default function DynamicOffenderList({
  data = [],
  title = "Victim / Offender List",
  onDelete = () => {},
}: DynamicOffenderListProps) {
  if (!data.length) return null;

  const formatFieldName = (key: string): string =>
    key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

  const pickMatching = (
    obj: GenericObject,
    keywords: string[]
  ): { key: string; value: unknown }[] => {
    return Object.entries(obj).filter(
      ([k, v]) =>
        v &&
        keywords.some((word) =>
          k.toLowerCase().includes(word.toLowerCase())
        )
    ).map(([k, v]) => ({ key: k, value: v }));
  };

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
              <th className="px-4 py-3 border-r">Army No / Rank / Name</th>
              <th className="px-4 py-3 border-r">Identity Card</th>
              <th className="px-4 py-3 border-r">Unit / FMN / Address</th>
              <th className="px-4 py-3">Remark</th>
            </tr>
          </thead>

          <tbody>
            {data.map((off, i) => {
              // 🔥 KEY FIX
              const source = (off as any).details ?? off;

              const col1 = pickMatching(source, [
                "army",
                "rank",
                "rider",
                "driver",
                "name",
              ]);

              const col2 = pickMatching(source, ["id", "card"]);

              const col3 = pickMatching(source, [
                "unit",
                "fmn",
                "address",
                "command",
              ]);

              return (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 border-r">{i + 1}.</td>

                  <td className="px-4 py-3 border-r align-top">
                    {col1.length ? (
                      col1.map((f) => (
                        <div key={f.key}>
                          <b>{formatFieldName(f.key)}:</b>{" "}
                          {String(f.value)}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>

                  <td className="px-4 py-3 border-r align-top">
                    {col2.length ? (
                      col2.map((f) => (
                        <div key={f.key}>{String(f.value)}</div>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>

                  <td className="px-4 py-3 border-r align-top">
                    {col3.length ? (
                      col3.map((f) => (
                        <div key={f.key}>
                          <b>{formatFieldName(f.key)}:</b>{" "}
                          {String(f.value)}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
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
