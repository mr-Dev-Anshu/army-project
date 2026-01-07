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

        if (
          filters.fromDate &&
          d < new Date(filters.fromDate).getTime()
        )
          return false;

        if (
          filters.toDate &&
          d >
          new Date(filters.toDate + "T23:59:59.999").getTime()
        )
          return false;
      }

      /* ---------- SINGLE DATE ---------- */
      if (filters.date) {
        const recDate = new Date(rawDate)
          .toISOString()
          .split("T")[0];
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
        const fmn =
          item.fmn || item.offenders?.[0]?.offenderDetails?.fmn;

        if (!fmn || fmn !== filters.fmn) return false;
      }

      /* ---------- SEARCH ---------- */
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (
          !item.reportNumber?.toLowerCase().includes(s) &&
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
      const driver = item.offenders?.find(
        (o: any) => o.offenderDetails?.type === "Offender" || !o.offenderDetails?.type
      )?.offenderDetails || item.offenders?.[0]?.offenderDetails || {};

      const coDriver = item.offenders?.find(
        (o: any) => o.offenderDetails?.type === "CoDriver" || o.offenderDetails?.type === "Co-Driver"
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
        mpName:
          item.onDutyDetailsMPReporting?.nameReportingMP || "Unknown",
        unit:
          item.onDutyDetailsMPReporting?.unit ||
          driver.unit ||
          "MP Unit",
        fmn: item.fmn || driver.fmn || "HQ 21 Corps",
        vehicleNo: item.vehicleNumber || "N/A",
        vehicleModel: item.vehicleName || "Unknown",
        reportNo:
          item.reportNumber ||
          `SSC/21 CPU/${item._id.slice(-4)}/${new Date().getFullYear()}`,
        actionStatus: item.actionStatus,

        // ✅ ADDED MISSING FIELDS
        offenceBrief: offence.description || "N/A",
        authSpeed: offence.authSpeed || "-",
        actualSpeed: offence.actualSpeedNoted || "-",
        overSpeed: offence.overSpeedCalculated || "-",
        coDriverDetails: coDriver ? {
          name: coDriver.name,
          armyNumber: coDriver.armyNumber,
          rank: coDriver.rank,
        } : null,

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

    return {
      reportNo: item.reportNo,
      reportDate: new Date(raw.createdAt).toLocaleDateString("en-GB"),
      unitName: "21 Corps Provost Unit",
      particulars: {
        rider: {
          armyNo: offender.armyNumber || "N/A",
          name: offender.name || "N/A",
          rank: offender.rank || "N/A",
          unit: mp.unit || offender.unit || "N/A",
          fmn: raw.fmn || offender.fmn || "N/A",
          address: raw.address || offender.address || "N/A",
          command: raw.command || offender.command || "N/A",
          iCardNo: offender.iCardNumber || "N/A",
        },
        vehicle: {
          baNo: raw.vehicleNumber,
          makeAndTake: raw.vehicleName,
        },
      },
      occurrence: {
        dateOfDuty: item.date,
        dutyLocation: item.placeOfOffence,
        dutyTime: item.time,
        nameOfWitnessingOfficial1: "N/A",
        rankOfWitnessingOfficial1: "N/A",
        nameOfWitnessingOfficial2: "N/A",
        rankOfWitnessingOfficial2: "N/A",
        statement: offence.description || "",
      },
      offence: {
        actualSpeed: offence.actualSpeedNoted || "N/A",
        authSpeed: offence.authSpeed || "N/A",
        overSpeed: offence.overSpeedCalculated || "N/A",
      },
      witnessSig: {
        armyNo: "N/A",
        rank: "N/A",
        name: "N/A",
        unit: "N/A",
      },
      mpSig: {
        armyNo: mp.armyNumber || "N/A",
        name: mp.nameReportingMP || "N/A",
        rank: mp.rank || "N/A",
        unit: mp.unit || "N/A",
      },
      remarks: {
        text: raw.remarks || "",
        station: "N/A",
        dated: new Date().toLocaleDateString("en-GB"),
      },
    };
  };

  /* ================= ACTIONS ================= */

  const handleDownloadReport = (item: any) => {
    generateStaticSpeedWordReport(mapToReportProps(item));
  };

  const handlePrintReport = (item: any) => {
    setViewingReport(item);
    setShouldAutoPrint(true);
  };

  /* ================= RENDER ================= */

  if (isError) {
    return (
      <div className="p-8 text-red-500 text-center">
        Failed to load reports
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
        onFilterChange={(k, v) =>
          setFilters((p) => ({ ...p, [k]: v }))
        }
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
