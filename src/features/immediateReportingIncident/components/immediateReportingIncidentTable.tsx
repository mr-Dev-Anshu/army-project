"use client";

import React, { useMemo, useState, useRef } from "react";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import { useReactToPrint } from "react-to-print";

import { DynamicTable, Column } from "@/components/common/DynamicTable";
import ReportFilterBar, {
  FilterState,
} from "@/components/common/ReportFilterBar";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ImmediateReportingIncidentReport from "@/components/reports/ImmediateReportingIncident";

import {
  useGetAllImmediateReportingIncidents,
  useDeleteImmediateReportingIncident,
} from "../hooks";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";

interface Props {
  onAddNew: () => void;
  onEdit: (item: ImmediateReportingIncident) => void;
  onView: (item: ImmediateReportingIncident) => void;
}

const getIndividualInfo = (ind: any) => {
  const details = {
    ...(ind.individualDetails || {}),
    ...(ind.offenderDetails || {}),
  };

  let type = ind.individualType;
  if (!type) {
    if (details.employeeServiceNumber) type = "employee";
    else if (details.maidPassNumber) type = "servantMaid";
    else if (details.shopOwnerName) type = "shopKeeper";
    else if (details.tempWorkerName) type = "tempHiredWorker";
    else if (details.civilianName || details.civilianAadharCardNumber)
      type = "civilian";
    else type = "militaryPersonnel";
  }
  return { details, type };
};

const getUnit = (ind: any) => {
  const { details, type } = getIndividualInfo(ind);
  if (type === "militaryPersonnel")
    return details.unit || details.militaryPersonnelUnit;
  if (type === "employee") return details.employeeUnit;
  if (type === "servantMaid") return details.officersEnclaveUnit;
  if (type === "shopKeeper") return details.shopUnit;
  return details.unit;
};

const getFmn = (ind: any) => {
  const { details, type } = getIndividualInfo(ind);
  if (type === "militaryPersonnel")
    return details.fmn || details.militaryPersonnelFmn;
  if (type === "employee") return details.employeeFmn;
  if (type === "servantMaid") return details.officersEnclaveFmn;
  return details.fmn;
};

const ImmediateReportingIncidentTable: React.FC<Props> = ({
  onAddNew,
  onEdit,
  onView,
}) => {
  // 1. Fetch data
  const { data: incidents = [], isLoading } =
    useGetAllImmediateReportingIncidents();
  const { mutateAsync: deleteIncident, isPending: isDeleting } =
    useDeleteImmediateReportingIncident();

  // 2. State for delete modal and filters
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  console.log(incidents);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    date: "", // Keeping generic date if needed, but primary is range
    actionStatus: "All",
    sortOrder: "asc",
    fmn: "",
    unit: "",
    individualWorkingStatus: "All",
    placeOfOffence: "",
    fromDate: "",
    toDate: "",
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteIncident(deleteModal.id);
      toast.success("Incident Report deleted successfully");
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      console.error("Failed to delete incident:", error);
      toast.error("Failed to delete incident");
    }
  };

  const handlePrintClick = (id: string) => {
    // Open a specific print view or API endpoint in a new tab
    // Replace '/print-incident/' with your actual route
    const printUrl = `/print/immediate-reporting-incident/${id}`;
    window.open(printUrl, "_blank");
  };

  // 3 Unique Options Logic
  const { placeOptions, unitOptions, fmnOptions } = useMemo(() => {
    if (!incidents)
      return { placeOptions: [], unitOptions: [], fmnOptions: [] };

    const places = new Set<string>();
    const units = new Set<string>();
    const fmns = new Set<string>();

    incidents.forEach((item) => {
      if (item.placeOfOccurrence) places.add(item.placeOfOccurrence);

      if (item.individuals && Array.isArray(item.individuals)) {
        item.individuals.forEach((ind: any) => {
          const unit = getUnit(ind);
          const fmn = getFmn(ind);

          if (unit) units.add(unit);
          if (fmn) fmns.add(fmn);
        });
      }
    });

    return {
      placeOptions: Array.from(places).sort(),
      unitOptions: Array.from(units).sort(),
      fmnOptions: Array.from(fmns).sort(),
    };
  }, [incidents]);

  // 4. Filtering Logic
  const filteredData = useMemo(() => {
    return incidents.filter((item: ImmediateReportingIncident) => {
      const searchTerm = filters.search.toLowerCase();

      const individuals = item.individuals || [];

      // Basic search across multiple fields
      const matchesSearch =
        (item.description || "").toLowerCase().includes(searchTerm) ||
        (item.vehicleNumber || "").toLowerCase().includes(searchTerm) ||
        (item.vehicleName || "").toLowerCase().includes(searchTerm) ||
        individuals.some((ind: any) => {
          const { details } = getIndividualInfo(ind);
          const valuesToCheck = [
            // Common
            details.unit,
            details.fmn,
            details.rank,
            details.name,
            // Military
            details.militaryPersonnelArmyNo,
            details.militaryPersonnelName,
            details.militaryPersonnelUnit,
            details.militaryPersonnelFmn,
            // Employee
            details.employeeServiceNumber,
            details.employeeName,
            details.employeeUnit,
            details.employeeFmn,
            // Maid
            details.maidPassNumber,
            details.maidName,
            details.officersEnclaveUnit,
            details.officersEnclaveFmn,
            // Shop
            details.shopOwnerName,
            details.shopName,
            details.shopUnit,
            // Temp
            details.tempWorkerName,
            details.tempWorkerPassNo,
            // Civilian
            details.civilianName,
            details.civilianAadharCardNumber,
            // Explicit unit/fmn helpers
            getUnit(ind),
            getFmn(ind),
            ind.unitLocation,
          ];

          return valuesToCheck.some(
            (val) => val && String(val).toLowerCase().includes(searchTerm),
          );
        });

      let matchesDate = true;
      // Specific Date Check
      if (filters.date) {
        matchesDate =
          (item.dateOfOccurrence &&
            item.dateOfOccurrence.includes(filters.date)) ||
          false;
      }

      // Date Range Check
      if (filters.fromDate || filters.toDate) {
        const incidentDate = item.dateOfOccurrence
          ? new Date(item.dateOfOccurrence)
          : null;
        if (incidentDate) {
          if (filters.fromDate) {
            matchesDate =
              matchesDate && incidentDate >= new Date(filters.fromDate);
          }
          if (filters.toDate) {
            matchesDate =
              matchesDate && incidentDate <= new Date(filters.toDate);
          }
        } else {
          matchesDate = false;
        }
      }

      let matchesUnit = true;
      if (filters.unit && filters.unit !== "All") {
        const selected = filters.unit
          .split(",")
          .map((s) => s.trim().toLowerCase());
        matchesUnit = individuals.some((ind: any) => {
          const val = getUnit(ind);
          return val && selected.includes(val.toLowerCase());
        });
      }

      let matchesFmn = true;
      if (filters.fmn && filters.fmn !== "All") {
        const selected = filters.fmn
          .split(",")
          .map((s) => s.trim().toLowerCase());
        matchesFmn = individuals.some((ind: any) => {
          const val = getFmn(ind);
          return val && selected.includes(val.toLowerCase());
        });
      }

      let matchesPlace = true;
      if (filters.placeOfOffence && filters.placeOfOffence !== "All") {
        matchesPlace = (item.placeOfOccurrence || "")
          .toLowerCase()
          .includes((filters.placeOfOffence || "").toLowerCase());
      }

      let matchesWorkingStatus = true;
      if (
        filters.individualWorkingStatus &&
        filters.individualWorkingStatus !== "All"
      ) {
        matchesWorkingStatus = individuals.some(
          (ind: any) =>
            (ind.individualWorkingStatus || "") ===
            (filters.individualWorkingStatus || ""),
        );
      }

      return (
        matchesSearch &&
        matchesDate &&
        matchesUnit &&
        matchesFmn &&
        matchesPlace &&
        matchesWorkingStatus
      );
    });
  }, [incidents, filters]);

  // 4. Columns Definition
  const columns: Column<ImmediateReportingIncident>[] = [
    {
      header: "Sr no.",
      cell: (item) => (
        <span className="font-normal font-[Arial] text-[#0A0A0A]">
          {filteredData.indexOf(item) + 1}
        </span>
      ),
      className:
        "w-16 sticky left-0 z-10 border-r border-gray-300 bg-white border-b",
      headerClassName:
        "z-20 left-0 bg-gray-100 border-r border-gray-300 font-bold text-[#0A0A0A]",
    },
    {
      header: "Particulars of Individual/Victim",
      cell: (item) => {
        const inds = item.individuals || [];
        if (!inds.length) return "-";

        const renderAllFields = (obj: any) => {
          if (!obj) return null;

          return Object.entries(obj).map(([key, value]) => {
            if (!value) return null;

            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());

            return (
              <div key={key}>
                <b>{label}:</b> {String(value)}
              </div>
            );
          });
        };

        return (
          <div className="text-xs">
            {inds.map((ind: any, index: number) => {
              const type =
                ind.offenderType || ind.individualType || "individual";
              const details =
                ind.offenderDetails || ind.individualDetails || {};

              return (
                <div
                  key={index}
                  className={`pb-6 ${
                    index !== inds.length - 1
                      ? "mb-6 border-b border-gray-300"
                      : ""
                  }`}
                >
                  {/* MT Accident style heading */}
                  <div className="font-bold mb-3 capitalize">
                    Individual {index + 1} ({type})
                  </div>

                  {renderAllFields(details)}
                </div>
              );
            })}
          </div>
        );
      },
      className: "border-r border-gray-300 min-w-[200px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[200px]",
    },

    {
      header: "Vehicle BA No. / Reg No.",
      cell: (item) => (
        <span className="font-[Arial] text-sm text-[#0A0A0A]">
          {item.vehicleNumber || "-"}
        </span>
      ),
      className: "border-r border-gray-300 min-w-[120px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
    },
    {
      header: "Make & Take",
      cell: (item) => (
        <span className="font-[Arial] text-sm text-[#0A0A0A]">
          {item.vehicleName || "-"}
        </span>
      ),
      className: "border-r border-gray-300 min-w-[120px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
    },
    {
      header: "Age & Service Yrs",
      cell: (item) => {
        const age = item.age;
        const service = item.totalServiceDuration;
        return (
          <div className="flex flex-col font-[Arial] text-xs space-y-1">
            {age && <div>{age} Years Old</div>}
            {service && <div>{service} Years</div>}
          </div>
        );
      },
      className: "border-r border-gray-300 min-w-[120px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
    },

    {
      header: "Whether Indl on Lve or Duty",
      cell: (item) => {
        const status = item.individualWorkingStatus || "-";
        return (
          <div className="font-[Arial] text-sm text-[#0A0A0A]">{status}</div>
        );
      },
      className: "border-r border-gray-300 min-w-[120px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
    },
    {
      header: "Place of Incident",
      cell: (item) => (
        <span className="font-[Arial] text-sm text-[#0A0A0A]">
          {item.placeOfOccurrence || "-"}
        </span>
      ),
      className: "border-r border-gray-300 min-w-[150px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[150px]",
    },
    {
      header: "Date of Incident",
      cell: (item) => (
        <span className="font-[Arial] text-sm text-[#0A0A0A]">
          {item.dateOfOccurrence
            ? format(new Date(item.dateOfOccurrence), "dd/MM/yyyy")
            : "-"}
        </span>
      ),
      className: "border-r border-gray-300 min-w-[100px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
    },
    {
      header: "Time of Incident",
      cell: (item) => (
        <span className="font-[Arial] text-sm text-[#0A0A0A]">
          {item.timeOfOccurrence || "-"}
        </span>
      ),
      className: "border-r border-gray-300 min-w-[100px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
    },
    {
      header: "Brief of the Incident",
      cell: (item) => (
        <div className="font-[Arial] text-xs text-[#0A0A0A] max-w-[250px] whitespace-normal line-clamp-4">
          {item.description || "-"}
        </div>
      ),
      className: "border-r border-gray-300 min-w-[250px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[250px]",
    },
    {
      header: "Coord with Police on Civ Adm, FIR, Current Sit",
      cell: (item) => (
        <div className="font-[Arial] text-xs text-[#0A0A0A] max-w-[250px] whitespace-normal line-clamp-4">
          {item.coordWith || "-"}
        </div>
      ),
      className: "border-r border-gray-300 min-w-[250px] align-top py-2",
      headerClassName:
        "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[250px]",
    },
    {
      header: "Actions",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(item)}>
              View
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => onEdit(item)}>
                            Edit
                        </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => handlePrintClick(item._id)}>
              Print Initial Report
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(item._id)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className:
        "w-[50px] sticky right-0 z-10 border-l border-gray-300 bg-white border-b align-top py-2 bg-white",
      headerClassName:
        "z-20 right-0 bg-gray-100 border-l border-gray-300 font-bold text-[#0A0A0A]",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading incidents...</div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <ReportPageHeader
        title="MP Occurrence & Investigation Initial Report"
        pageHeaderTitle="(Initial Report) Immediate Reporting of Incident"
        reportCount={filteredData.length}
        // onDownload={() => window.print()}
        breadcrumbItems={[
          {
            label: "Immediate Reporting of Incident",
            href: "/immediate-reporting-incident",
          },
        ]}
      />

      <ReportFilterBar
        placeholder="Search by Vehicle No, Make & Take, Unit, FMN, Name..."
        filters={filters}
        onFilterChange={handleFilterChange}
        offenceTypeOptions={[]}
        unitOptions={unitOptions}
        fmnOptions={fmnOptions}
        showOffenceType={false}
        showActionStatus={false}
        showPriceListFilter={false}
        showAgreementStatus={false}
        showDateRange={true}
        dateRangeLabel="Incident Date"
        showDate={true}
        showFilter={true}
        showPlaceOfOffence={true}
        placeOptions={placeOptions}
        placeLabel="Place of Incident"
        showUnitLocation={false}
        showIndividualWorkingStatus={true}
        onAddNew={onAddNew}
        onReset={() =>
          setFilters({
            search: "",
            date: "",
            actionStatus: "All",
            sortOrder: "asc",
            fmn: "",
            unit: "",
            placeOfOffence: "",
            individualWorkingStatus: "All",
            fromDate: "",
            toDate: "",
          })
        }
        showFmn={true}
        showUnit={true}
      />

      <DynamicTable
        className="[&::-webkit-scrollbar]:hidden border-gray-300 [&_tbody]:divide-gray-300 [&_table]:border-gray-300 h-[calc(100vh-240px)] max-h-full shadow-sm rounded-md overflow-auto"
        data={filteredData}
        columns={columns}
        getRowClassName={() => "border-b border-gray-300 hover:bg-white"}
      />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Incident Report"
        message="Are you sure you want to delete this incident report? This action cannot be undone."
        confirmLabel="Delete"
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default ImmediateReportingIncidentTable;
