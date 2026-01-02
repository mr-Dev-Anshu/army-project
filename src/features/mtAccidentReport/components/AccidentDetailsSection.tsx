"use client";

import { useForm } from "@/context/FormContext";

export default function AccidentDetailsSection() {
  const { state, dispatch } = useForm();
  const d = state.formData.mtAccidentReport;

  const set = (k: string, v: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mtAccidentReport.${k}`,
      value: v,
    });

  return (
    <section className="border rounded-xl p-6 space-y-6 bg-white">
      <h3 className="text-lg font-semibold text-gray-800">
        Accident Details
      </h3>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600">Date of Accident</label>
          <input
            type="date"
            value={d.dateOfAccident}
            onChange={(e) => set("dateOfAccident", e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600">
            Time of Accident (24hr format)
          </label>
          <input
            type="time"
            value={d.timeOfAccident}
            onChange={(e) => set("timeOfAccident", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Place */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-600">Place of Accident</label>
        <input
          placeholder="Enter address"
          value={d.placeOfAccident}
          onChange={(e) => set("placeOfAccident", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Type of Accident */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Type of Accident</label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Normal", "Serious", "Fatal", "Very Serious"].map((t) => {
            const active = d.typeOfAccident === t;

            return (
              <button
                key={t}
                type="button"
                onClick={() => set("typeOfAccident", t)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition
                  ${
                    active
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-700 hover:border-blue-400"
                  }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Probable Cause */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-600">
          Probable Cause of Accident
        </label>
        <textarea
          rows={3}
          placeholder="Briefly explain cause"
          value={d.probableCause}
          onChange={(e) => set("probableCause", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </section>
  );
}
