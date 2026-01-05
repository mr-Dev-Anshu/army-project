"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";

import ReportPageHeader from "@/components/common/ReportPageHeader";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import MTAccidentTable from "@/features/mt-accident-reports/components/MTAccidentTable";
import MTAccidentReport from "../../components/reports/MtAccideantRreport";
import MTAccidentForm from "@/features/mt-accident-reports/components/MTAccidentForm";

import { Button } from "@/components/ui/button";
import { useGetAllMTAccidentReports } from "@/features/mt-accident-reports/hooks/useMTAccidentReport";
import { generateWordReport } from "@/utils/generateWordReport";
import { useForm } from "@/context/FormContext"; // ✅ IMPORTANT

export default function MTAccidentReportsPage() {
  const router = useRouter();
  const { dispatch } = useForm(); // ✅ IMPORTANT

  const [isCreating, setIsCreating] = useState(false);
  const [editingReport, setEditingReport] = useState<any | null>(null);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [autoPrint, setAutoPrint] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    date: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  const {
    data = [],
    isLoading,
    isError,
  } = useGetAllMTAccidentReports({});

  /* ================= AUTO PRINT ================= */
  useEffect(() => {
    if (viewingReport && autoPrint) {
      const t = setTimeout(() => {
        window.print();
        setAutoPrint(false);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [viewingReport, autoPrint]);

  /* ================= FILTER + SORT ================= */
  const flatAccidents = useMemo(() => {
    let records = [...data];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      records = records.filter((r: any) =>
        r.place?.toLowerCase().includes(q) ||
        r.vehicleNo?.toLowerCase().includes(q) ||
        r.driverName?.toLowerCase().includes(q)
      );
    }

    if (filters.actionStatus !== "All") {
      const isTaken = filters.actionStatus === "Taken";
      records = records.filter((r: any) => r.actionStatus === isTaken);
    }

    if (filters.date) {
      records = records.filter((r: any) =>
        r.date
          ? new Date(r.date).toISOString().split("T")[0] === filters.date
          : false
      );
    }

    records.sort((a: any, b: any) => {
      const da = new Date(a.date || a.createdAt).getTime();
      const db = new Date(b.date || b.createdAt).getTime();
      return filters.sortOrder === "asc" ? da - db : db - da;
    });

    return records;
  }, [data, filters]);

  /* ================= REPORT VIEW ================= */
  const mapToReportProps = (accident: any) => ({
    reportNo: accident.reportNumber || accident._id?.slice(-6),
    reportDate: new Date(accident.createdAt).toLocaleDateString("en-GB"),
    dateOfAccident: accident.date,
    timeOfAccident: accident.time,
    placeOfAccident: accident.place,
    vehicle: {
      number: accident.vehicleNo,
      make: accident.vehicleMake,
    },
    driver: {
      name: accident.driverName,
      rank: accident.driverRank,
      armyNo: accident.driverArmyNo,
      unit: accident.driverUnit,
    },
    casualties: {
      injuredCivil: accident.casualties?.nonFatal || 0,
      injuredMilitary: 0,
      diedCivil: accident.casualties?.fatal || 0,
      diedMilitary: 0,
    },
    cause: accident.brief,
    remarks: accident.actionStatusRemark,
  });

  const handleDownload = (accident: any) =>
    generateWordReport(mapToReportProps(accident));

  const handlePrint = (accident: any) => {
    setViewingReport(accident);
    setAutoPrint(true);
  };

  /* ================= ADD NEW ================= */
  const handleAddNew = () => {
    setEditingReport(null);

    // 🔥 RESET FORM CONTEXT (VERY IMPORTANT)
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        ...require("@/context/FormContext").initialState.formData,
      },
    });

    setIsCreating(true);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="px-6 pt-6">
        <ReportPageHeader
          title="MT Accident Reports"
          reportCount={flatAccidents.length}
          onDownload={() => window.print()}
        />

        <ReportFilterBar
          filters={filters}
          onFilterChange={(k, v) =>
            setFilters((p) => ({ ...p, [k]: v }))
          }
          showOffenceType={false}
          showSort
          showFilter
          onAddNew={handleAddNew}
          onReset={() =>
            setFilters({
              search: "",
              date: "",
              actionStatus: "All",
              sortOrder: "desc",
            })
          }
        />
      </div>

      {/* TABLE */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <div className="h-full bg-white rounded border overflow-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : isError ? (
            <div className="h-full flex items-center justify-center text-red-600">
              Failed to load accident reports.
            </div>
          ) : flatAccidents.length > 0 ? (
            <MTAccidentTable
              data={flatAccidents}
              onView={setViewingReport}
              onPrint={handlePrint}
              onEdit={(item) => {
                setEditingReport(item);
                setIsCreating(true);
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No accident reports found.
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT DRAWER */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/30"
            onClick={() => {
              setIsCreating(false);
              setEditingReport(null);
            }}
          />

          <div className="w-full md:w-1/2 h-full bg-white shadow-xl flex flex-col">
            <div className="border-b px-6 py-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setEditingReport(null);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <h2 className="text-lg font-semibold">
                {editingReport
                  ? "Edit MT Accident Report"
                  : "Create MT Accident Report"}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <MTAccidentForm
                initialData={editingReport ?? undefined}
                onSuccess={() => {
                  setIsCreating(false);
                  setEditingReport(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW REPORT */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 bg-gray-500/40 flex items-center justify-center">
          <div className="bg-white w-[90%] h-[90%] rounded shadow overflow-auto">
            <div className="border-b px-6 py-3 flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewingReport(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <h1 className="font-semibold">View MT Accident Report</h1>

              <div className="ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(viewingReport)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="p-8 flex justify-center">
              <MTAccidentReport {...mapToReportProps(viewingReport)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
