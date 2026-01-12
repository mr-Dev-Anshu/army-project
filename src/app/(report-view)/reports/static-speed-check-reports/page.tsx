"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Loader2, ArrowLeft, Download } from "lucide-react";

import StaticSpeedTable from "./_components/StaticSpeedTable";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import ReportPageHeader from "@/components/common/ReportPageHeader";

import { useGetStaticSpeedRecords } from "@/features/staticSpeed/hooks";
import StaticSpeedReport, {
  StaticSpeedReportProps,
} from "@/components/reports/StaticSpeedReport";

import StaticSpeedForm from "@/common/component/staticSpeedForm/MainForm";
import { Button } from "@/components/ui/button";
import { generateStaticSpeedWordReport } from "@/utils/generateStaticSpeedWordReport";

export default function StaticSpeedCheckReportsPage() {
  const { data, isLoading, isError } = useGetStaticSpeedRecords();

  const [isCreating, setIsCreating] = useState(false);
  const [viewingReport, setViewingReport] = useState<any | null>(null);
  const [shouldAutoPrint, setShouldAutoPrint] = useState(false);

  /* ================= AUTO PRINT ================= */

  useEffect(() => {
    if (viewingReport && shouldAutoPrint) {
      const t = setTimeout(() => {
        window.print();
        setShouldAutoPrint(false);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [viewingReport, shouldAutoPrint]);

  /* ================= FILTER STATE ================= */

  const [filters, setFilters] = useState({
    search: "",
    date: "",
    fromDate: "",
    toDate: "",
    unit: "",
    fmn: "",
    actionStatus: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  /* ================= FILTER + TRANSFORM DATA ================= */

  const processedData = useMemo(() => {
    if (!data) return [];

    const filtered = data.filter((item: any) => {
      const rawDate =
        item.offenceOccurenceDetails?.timeOfOffence || item.createdAt;

      /* ---------- DATE RANGE ---------- */
      if (filters.fromDate || filters.toDate) {
        const d = new Date(rawDate).getTime();

        if (filters.fromDate && d < new Date(filters.fromDate).getTime())
          return false;

        if (
          filters.toDate &&
          d > new Date(filters.toDate + "T23:59:59.999").getTime()
        )
          return false;
      }

      /* ---------- SINGLE DATE ---------- */
      if (filters.date) {
        const recDate = new Date(rawDate).toISOString().split("T")[0];
        if (recDate !== filters.date) return false;
      }

      /* ---------- ACTION STATUS ---------- */
      if (filters.actionStatus !== "All") {
        const isTaken = item.actionStatus === true;
        if (
          (filters.actionStatus === "Taken" && !isTaken) ||
          (filters.actionStatus === "Pending" && isTaken)
        )
          return false;
      }

      /* ---------- UNIT ---------- */
      if (filters.unit) {
        const unit =
          item.onDutyDetailsMPReporting?.unit ||
          item.offenders?.[0]?.offenderDetails?.unit;

        if (!unit || unit !== filters.unit) return false;
      }

      /* ---------- FMN ---------- */
      if (filters.fmn) {
        const fmn = item.fmn || item.offenders?.[0]?.offenderDetails?.fmn;

        if (!fmn || fmn !== filters.fmn) return false;
      }

      /* ---------- SEARCH ---------- */
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const rNo = item.reportId || item.reportNumber || item.reportNo || "";
        if (
          !rNo.toLowerCase().includes(s) &&
          !item.vehicleNumber?.toLowerCase().includes(s)
        )
          return false;
      }

      return true;
    });

    /* ---------- SORT ---------- */
    if (filters.sortOrder) {
      filtered.sort((a: any, b: any) => {
        const dA = new Date(
          a.offenceOccurenceDetails?.timeOfOffence || a.createdAt
        ).getTime();
        const dB = new Date(
          b.offenceOccurenceDetails?.timeOfOffence || b.createdAt
        ).getTime();
        return filters.sortOrder === "asc" ? dA - dB : dB - dA;
      });
    }

    /* ---------- MAP FOR TABLE ---------- */
    return filtered.map((item: any) => {
      const offence = item.offenceOccurenceDetails || {};

      // Filter for Driver (Main Offender) vs Co-Driver
      const driver =
        item.offenders?.find(
          (o: any) =>
            o.offenderDetails?.type === "Offender" || !o.offenderDetails?.type
        )?.offenderDetails ||
        item.offenders?.[0]?.offenderDetails ||
        {};

      const coDriver = item.offenders?.find(
        (o: any) =>
          o.offenderDetails?.type === "CoDriver" ||
          o.offenderDetails?.type === "Co-Driver"
      )?.offenderDetails;

      const dateObj = new Date(offence.timeOfOffence || item.createdAt);

      return {
        _id: item._id,
        placeOfOffence: offence.incidentLocation || "Unknown",
        date: dateObj.toLocaleDateString("en-GB"),
        time: dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        driverDetails: {
          name: driver.name,
          armyNumber: driver.armyNumber,
          rank: driver.rank,
        },
        mpName: item.onDutyDetailsMPReporting?.nameReportingMP || "Unknown",
        unit: item.onDutyDetailsMPReporting?.unit || driver.unit || "MP Unit",
        fmn: item.fmn || driver.fmn || "HQ 21 Corps",
        vehicleNo: item.vehicleNumber || "N/A",
        vehicleModel: item.vehicleName || "Unknown",
        reportNo: item.reportId || item.reportNumber || item.reportNo || "N/A",
        actionStatus: item.actionStatus,

        // ✅ ADDED MISSING FIELDS
        offenceBrief: offence.description || "N/A",
        authSpeed: offence.authSpeed || "-",
        actualSpeed: offence.actualSpeedNoted || "-",
        overSpeed: offence.overSpeedCalculated || "-",
        coDriverDetails: coDriver
          ? {
            name: coDriver.name,
            armyNumber: coDriver.armyNumber,
            rank: coDriver.rank,
          }
          : null,

        remarks: item.remark || item.remarks || "N/A",

        originalData: item,
      };
    });
  }, [data, filters]);

  /* ================= REPORT HELPERS ================= */

  const mapToReportProps = (item: any): StaticSpeedReportProps => {
    const raw = item.originalData;
    const offence = raw.offenceOccurenceDetails || {};
    const offender = raw.offenders?.[0]?.offenderDetails || {};
    const mp = raw.onDutyDetailsMPReporting || {};

    // Witness details might be missing in schema, so we attempt to find them safely
    const witness1 = raw.onDutyWitnessingMps?.[0] || {};
    const witness2 = raw.onDutyWitnessingMps?.[1] || {};

    const val = (v: any) => v || "";

    return {
      reportNo: raw.reportId || item.reportNo,
      reportDate: new Date(raw.createdAt).toLocaleDateString("en-GB"),
      unitName: "21 Corps Provost Unit",
      particulars: {
        rider: {
          armyNo: val(offender.armyNumber),
          name: val(offender.name),
          rank: val(offender.rank),
          unit: val(mp.unit || offender.unit),
          fmn: val(raw.fmn || offender.fmn),
          address: val(raw.address || offender.address),
          command: val(raw.command || offender.command),
          iCardNo: val(offender.iCardNumber),
        },
        vehicle: {
          baNo: val(raw.vehicleNumber),
          makeAndTake: val(raw.vehicleName),
        },
      },
      occurrence: {
        dateOfDuty: val(item.date),
        dutyLocation: val(item.placeOfOffence),
        dutyTime: item.time ? `${item.time} Hrs` : "",
        nameOfWitnessingOfficial1: val(witness1.name),
        rankOfWitnessingOfficial1: val(witness1.rank),
        nameOfWitnessingOfficial2: val(witness2.name),
        rankOfWitnessingOfficial2: val(witness2.rank),
        statement: val(offence.description),
      },
      offence: {
        actualSpeed: val(offence.actualSpeedNoted),
        authSpeed: val(offence.authSpeed),
        overSpeed: val(offence.overSpeedCalculated),
      },
      witnessSig: {
        armyNo: val(witness1.armyNumber || witness1.ArmyNo),
        rank: val(witness1.rank),
        name: val(witness1.name),
        unit: val(witness1.unit),
      },
      mpSig: {
        armyNo: val(mp.armyNumber),
        name: val(mp.nameReportingMP),
        rank: val(mp.rank),
        unit: val(mp.unit),
      },
      remarks: {
        text: val(raw.remark || raw.remarks),
        station: "",
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
  };

  /* ================= DOWNLOAD STATE ================= */
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

  /* ================= ACTIONS ================= */

  const handleDownloadReport = async (item: any) => {
    setIsDownloading(true);
    setDownloadType("Word");
    try {
      generateStaticSpeedWordReport(mapToReportProps(item));
      // Small delay to allow file saver to trigger, since generateStaticSpeedWordReport might be synchronous or fast.
      // If generateStaticSpeedWordReport is async, await it. Assuming it is sync based on import name (utils usually are), 
      // but let's wrap it in a small timeout logic or just set false immediately after.
      // Better to simulate async if it's sync to show loader briefly.
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      console.error(e);
      alert("Failed to download Word report");
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const handleDownloadPdf = async (item: any) => {
    const id = item._id || item.reportId;
    if (!id) {
      alert("Report ID not found");
      return;
    }

    setIsDownloading(true);
    setDownloadType("PDF");

    try {
      const response = await fetch(`/api/static-speed-report/pdf/${id}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown server error" }));
        throw new Error(errData.error || "Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `StaticSpeedReport-${item.reportNo || id}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Error", error);
      alert(`Failed to download PDF report: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  const handlePrintReport = (item: any) => {
    setViewingReport(item);
    setShouldAutoPrint(true);
  };

  /* ================= RENDER ================= */

  if (isError) {
    return (
      <div className="p-8 text-red-500 text-center">Failed to load reports</div>
    );
  }

  if (viewingReport) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col relative">
        {/* DOWNLOAD LOADER MODAL */}
        {isDownloading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4 min-w-[300px] animate-in zoom-in-95 duration-200">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <div className="text-center">
                <h3 className="font-semibold text-lg">Generating {downloadType} Report</h3>
                <p className="text-gray-500 text-sm">Please wait while we prepare your download...</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setViewingReport(null);
              setShouldAutoPrint(false);
            }}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">
            Static Speed Check Report
          </h1>
          <div className="ml-auto flex gap-2">
            <Button
              onClick={() => handleDownloadReport(viewingReport)}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isDownloading}
            >
              {isDownloading && downloadType === 'Word' ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
              Download Word Report
            </Button>
            <Button
              onClick={() => handleDownloadPdf(viewingReport)}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isDownloading}
            >
              {isDownloading && downloadType === 'PDF' ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
              Download PDF Report
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-500/10">
          <StaticSpeedReport {...mapToReportProps(viewingReport)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportPageHeader
        title="Static Speed Check Reports"
        reportCount={processedData.length}
      />

      <ReportFilterBar
        filters={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        showOffenceType={false}
        placeholder="Search by report no or vehicle..."
        onAddNew={() => setIsCreating(true)}
        onReset={() =>
          setFilters({
            search: "",
            date: "",
            fromDate: "",
            toDate: "",
            unit: "",
            fmn: "",
            actionStatus: "All",
            sortOrder: "desc",
          })
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      ) : (
        <StaticSpeedTable
          data={processedData}
          onView={setViewingReport}
          onPrint={handlePrintReport}
          onDownload={handleDownloadReport}
        />
      )}
    </div>
  );
}
