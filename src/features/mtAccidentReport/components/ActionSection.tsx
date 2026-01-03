"use client";

import { useForm } from "@/context/FormContext";

export default function ActionSection() {
  const { state, dispatch } = useForm();
  const d = state.formData.mtAccidentReport;

  // Map UI value -> boolean
  const set = (value: "Pending" | "Taken") =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mtAccidentReport.actionStatus",
      value: value === "Taken", 
    });

    const ACTION_OPTIONS = [
  { label: "Action Pending", value: "Pending" },
  { label: "Action Taken", value: "Taken" },
] as const;


  return (
    <section className="border rounded-xl p-6 space-y-6 bg-white">
      <h3 className="text-lg font-semibold text-gray-800">Action</h3>

      {/* Action Status */}
   <div className="space-y-2">
  <label className="text-sm font-medium text-gray-900">Action Status</label>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {ACTION_OPTIONS.map((item) => {
      const active =
        (item.value === "Pending" && d.actionStatus === false) ||
        (item.value === "Taken" && d.actionStatus === true);

      return (
        <button
          key={item.value}
          type="button"
          onClick={() =>
            dispatch({
              type: "SET_PATH",
              path: "formData.mtAccidentReport.actionStatus",
              value: item.value === "Taken", // ✅ boolean mapping
            })
          }
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition
            ${
              active
                ? "border-gray-600 bg-gray-100 text-gray-700"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
        >
          <span
            className={`h-4 w-4 rounded-full border flex items-center justify-center
              ${active ? "border-gray-600" : "border-gray-400"}`}
          >
            {active && (
              <span className="h-2 w-2 rounded-full bg-gray-600" />
            )}
          </span>

          {item.label}
        </button>
      );
    })}
  </div>
</div>

      {/* Remark */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-900">Add Remark</label>

        <textarea
          rows={3}
          placeholder="Enter remark"
          value={d.remark}
          onChange={(e) =>
            dispatch({
              type: "SET_PATH",
              path: "formData.mtAccidentReport.remark",
              value: e.target.value,
            })
          }
          className="w-full border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </section>
  );
}
