"use client";

import { useState } from "react";

import ReportFilterBar from "@/components/common/ReportFilterBar";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";

// SAME TABLE UI COMPONENT (jo screenshot jaisa layaega)
import GroupedList from "@/app/general-traffic-offence-reports/_components/GroupedList";

export default function UnifiedAllReports() {
  const [filters, setFilters] = useState({
    search: "",
    offenceType: "All",
    date: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  const { data: traffic } = useGetAllTrafficOffences({
    groupBy: "offenceType",
  });

  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm">

      {/* EXACT SAME SMALL HEADING */}
      <h2 className="text-sm font-semibold mb-3 text-gray-600">
        All Registered Reports
      </h2>

      {/* EXACT SAME FILTER BAR */}
      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        offenceTypeOptions={["All"]}
        showOffenceType={true}
        onAddNew={() => {}}
        onReset={() =>
          setFilters({
            search: "",
            offenceType: "All",
            date: "",
            actionStatus: "All",
            sortOrder: "desc",
          })
        }
      />

      {/* EXACT SAME TABLE – NO EXTRA HEADER – NO COLLAPSIBLE */}
      <div className="mt-4">
        <GroupedList data={traffic} isVehicleInvolved />
      </div>

    </div>
  );
}
