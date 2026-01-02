"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { DynamicTable, Column } from "@/components/common/DynamicTable";
import { useDeleteMTAccidentReport } from "../hooks/useMTAccidentReport";

interface MTAccidentTableProps {
  data: any[];
  onEdit: (id: string) => void;
}

export default function MTAccidentTable({ data, onEdit }: MTAccidentTableProps) {
  const { mutate: deleteReport } = useDeleteMTAccidentReport();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteReport(id);
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Date",
      cell: (item) =>
        item.dateOfAccident
          ? new Date(item.dateOfAccident).toLocaleDateString("en-GB")
          : "-",
    },
    {
      header: "Time",
      accessorKey: "timeOfAccident",
    },
    {
      header: "Individual Type",
      accessorKey: "individualType",
      className: "text-sm",
    },
    {
      header: "Accident Type",
      cell: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            item.typeOfAccident === "Fatal" || item.typeOfAccident === "Very Serious"
              ? "bg-red-100 text-red-700"
              : item.typeOfAccident === "Serious"
              ? "bg-orange-100 text-orange-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {item.typeOfAccident || "-"}
        </span>
      ),
    },
    {
      header: "Place",
      accessorKey: "placeOfAccident",
      className: "text-sm",
    },
    {
      header: "Vehicle",
      accessorKey: "vehicleNumber",
      className: "text-sm",
    },
    {
      header: "Injured / Died",
      cell: (item) => {
        const totalInjured =
          (item.injuredCivil || 0) + (item.injuredMilitary || 0);
        const totalDied =
          (item.diedCivil || 0) + (item.diedMilitary || 0);

        return totalInjured > 0 || totalDied > 0 ? (
          <span className="text-red-600 font-semibold text-sm">
            I: {totalInjured}, D: {totalDied}
          </span>
        ) : (
          "-"
        );
      },
      className: "text-center",
    },
    {
      header: "Status",
      cell: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            item.actionStatus
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {item.actionStatus ? "Taken" : "Pending"}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(item._id)}
            className="w-8 h-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(item._id)}
            className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <DynamicTable
      data={data}
      columns={columns}
      emptyMessage="No MT Accident reports found"
    />
  );
}
