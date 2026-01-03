"use client";

import { useForm } from "@/context/FormContext";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function AccidentDetailsSection() {
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
  return value.split("T")[0];
};

  return (
    <section className="space-y-6">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">
        Accident Details
      </h3>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900">
            Date of Accident
          </label>
          <div className="relative">
            <input
          type="date"
          value={toDateInputValue(d.dateOfAccident)}
          onChange={(e) => set("dateOfAccident", e.target.value)}
          className="border rounded px-3 py-2"
        />
            
          </div>
        </div>

        {/* Time */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900">
            Time of Accident (24hr format)
          </label>
          <div className="relative">
            <input
              type="time"
              value={d.timeOfAccident}
              onChange={(e) => set("timeOfAccident", e.target.value)}
              className="w-full h-11 text-gray-500 rounded-xl border border-gray-300 px-4 pr-10 text-sm focus:outline-none"
            />
          
          </div>
        </div>
      </div>

      {/* Place */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-900">
          Place of Accident
        </label>
        <div className="relative">
          <input
            placeholder="Enter Address"
            value={d.placeOfAccident}
            onChange={(e) => set("placeOfAccident", e.target.value)}
            className="w-full h-11 rounded-xl border border-gray-300 px-4 pr-10 text-sm focus:outline-none"
          />
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Type of Accident */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">
          Type of Accident
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Normal", "Serious", "Fatal", "Very Serious"].map((t) => {
            const active = d.typeOfAccident === t;

            return (
              <button
                key={t}
                type="button"
                onClick={() => set("typeOfAccident", t)}
                className={`
                  h-11 rounded-xl border text-sm font-semibold transition
                  flex items-center justify-center gap-2
                  ${
                    active
                      ? "border-gray-400 text-gray-900"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }
                `}
              >
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center
                    ${active ? "border-gray-900" : "border-gray-400"}`}
                >
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-gray-700" />
                  )}
                </span>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Probable Cause */}
      <div className="space-y-1">
        <label className="text-sm  font-semibold  text-gray-900">
          Probable Cause of Accident
        </label>
        <textarea
          rows={3}
          placeholder="Briefly explain cause"
          value={d.probableCause}
          onChange={(e) => set("probableCause", e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm resize-none focus:outline-none"
        />
      </div>
    </section>
  );
}
