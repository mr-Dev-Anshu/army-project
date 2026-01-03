"use client";

import { useForm } from "@/context/FormContext";

export default function FirDetailsSection() {
  const { state, dispatch } = useForm();
  const d = state.formData.mtAccidentReport;

  const set = (k: string, v: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mtAccidentReport.${k}`,
      value: v,
    });

    const toDateInputValue = (value?: string) => {
  if (!value) return "";
  return value.split("T")[0]; // ISO → yyyy-MM-dd
};


  return (
    <section className="border rounded-xl p-6 space-y-6 bg-white">
      <h3 className="text-lg font-semibold text-gray-900">
        FIR / MACT Details
      </h3>

      {/* FIR No & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900">
            FIR / MACT No.
          </label>
          <input
            placeholder="Value"
            value={d.firCaseNumber}
            onChange={(e) => set("firCaseNumber", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm  font-medium text-gray-900">
            FIR Date
          </label>
        <input
            type="date"
            value={toDateInputValue(d.firDate)}
            onChange={(e) => set("firDate", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Police Station */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-900">
          FIR Police Station
        </label>
        <input
          placeholder="Enter station name"
          value={d.firPoliceStation}
          onChange={(e) => set("firPoliceStation", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </section>
  );
}
