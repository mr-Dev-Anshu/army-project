"use client";

import React, { useMemo, useState, useRef } from "react";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import { useReactToPrint } from "react-to-print";

import { DynamicTable, Column } from "@/components/common/DynamicTable";
import ReportFilterBar, { FilterState } from "@/components/common/ReportFilterBar";
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

import { useGetAllImmediateReportingIncidents, useDeleteImmediateReportingIncident } from "../hooks";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";

interface Props {
    onAddNew: () => void;
    onEdit: (item: ImmediateReportingIncident) => void;
    onView: (item: ImmediateReportingIncident) => void;
}

const ImmediateReportingIncidentTable: React.FC<Props> = ({ onAddNew, onEdit, onView }) => {
    // 1. Fetch data
    const { data: incidents = [], isLoading } = useGetAllImmediateReportingIncidents();
    const { mutateAsync: deleteIncident, isPending: isDeleting } = useDeleteImmediateReportingIncident();

    // 2. State for delete modal and filters
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null,
    });

    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "", // Keeping generic date if needed, but primary is range
        actionStatus: "All",
        sortOrder: "asc",
        fmn: "",
        unit: "",
        unitLocation: "",
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

    // 3 Unique Options Logic
    const { placeOptions, unitOptions, fmnOptions, unitLocationOptions } = useMemo(() => {
        if (!incidents) return { placeOptions: [], unitOptions: [], fmnOptions: [], unitLocationOptions: [] };

        const places = new Set<string>();
        const units = new Set<string>();
        const fmns = new Set<string>();
        const unitLocations = new Set<string>();

        incidents.forEach(item => {
            if (item.incidentPlace) places.add(item.incidentPlace);

            if (item.individuals && Array.isArray(item.individuals)) {
                item.individuals.forEach((ind: any) => {
                    if (ind.unit) units.add(ind.unit);
                    if (ind.fmn) fmns.add(ind.fmn);
                    if (ind.unitLocation) unitLocations.add(ind.unitLocation);
                });
            }
        });

        return {
            placeOptions: Array.from(places).sort(),
            unitOptions: Array.from(units).sort(),
            fmnOptions: Array.from(fmns).sort(),
            unitLocationOptions: Array.from(unitLocations).sort(),
        };
    }, [incidents]);

    // 4. Filtering Logic
    const filteredData = useMemo(() => {
        return incidents.filter((item: ImmediateReportingIncident) => {
            const searchTerm = filters.search.toLowerCase();

            const individuals = item.individuals || [];

            // Basic search across multiple fields
            const matchesSearch =
                (item.incidentBrief || "").toLowerCase().includes(searchTerm) ||
                individuals.some((ind: any) =>
                    (ind.armyNo || "").toLowerCase().includes(searchTerm) ||
                    (ind.name || "").toLowerCase().includes(searchTerm) ||
                    (ind.unit || "").toLowerCase().includes(searchTerm) ||
                    (ind.unitLocation || "").toLowerCase().includes(searchTerm) ||
                    (ind.fmn || "").toLowerCase().includes(searchTerm)
                );

            let matchesDate = true;
            // Specific Date Check
            if (filters.date) {
                matchesDate = (item.incidentDate && item.incidentDate.includes(filters.date)) || false;
            }

            // Date Range Check
            if (filters.fromDate || filters.toDate) {
                const incidentDate = item.incidentDate ? new Date(item.incidentDate) : null;
                if (incidentDate) {
                    if (filters.fromDate) {
                        matchesDate = matchesDate && incidentDate >= new Date(filters.fromDate);
                    }
                    if (filters.toDate) {
                        matchesDate = matchesDate && incidentDate <= new Date(filters.toDate);
                    }
                } else {
                    matchesDate = false;
                }
            }

            let matchesUnit = true;
            if (filters.unit && filters.unit !== "All") {
                matchesUnit = individuals.some((ind: any) => (ind.unit || "").toLowerCase() === filters.unit.toLowerCase());
            }

            let matchesFmn = true;
            if (filters.fmn && filters.fmn !== "All") {
                matchesFmn = individuals.some((ind: any) => (ind.fmn || "").toLowerCase() === filters.fmn.toLowerCase());
            }

            let matchesPlace = true;
            if (filters.placeOfOffence && filters.placeOfOffence !== "All") {
                matchesPlace = (item.incidentPlace || "").toLowerCase().includes(filters.placeOfOffence.toLowerCase());
            }

            let matchesUnitLocation = true;
            if (filters.unitLocation && filters.unitLocation !== "All") {
                matchesUnitLocation = individuals.some((ind: any) => (ind.unitLocation || "").toLowerCase().includes(filters.unitLocation.toLowerCase()));
            }

            let matchesWorkingStatus = true;
            if (filters.individualWorkingStatus && filters.individualWorkingStatus !== "All") {
                matchesWorkingStatus = individuals.some((ind: any) => ind.individualWorkingStatus === filters.individualWorkingStatus);
            }

            return matchesSearch && matchesDate && matchesUnit && matchesFmn && matchesPlace && matchesUnitLocation && matchesWorkingStatus;
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
            className: "w-16 sticky left-0 z-10 border-r border-gray-300 bg-white border-b",
            headerClassName: "z-20 left-0 bg-gray-100 border-r border-gray-300 font-bold text-[#0A0A0A]",
        },
        {
            header: "Particulars of Individual/Victim",
            cell: (item) => {
                const inds = item.individuals && item.individuals.length > 0
                    ? item.individuals
                    : [];

                return (
                    <div className="flex flex-col space-y-3">
                        {inds.map((ind: any, idx: number) => (
                            <div key={idx} className="flex flex-col font-[Arial] text-xs space-y-1 border-b border-gray-300 last:border-0 pb-2 last:pb-0">
                                <div><span className="font-bold text-[#0A0A0A]">Army no.:</span> <span className="text-[#0A0A0A]">{ind.armyNo}</span></div>
                                <div><span className="font-bold text-[#0A0A0A]">Rank:</span> <span className="text-[#0A0A0A]">{ind.rank}</span></div>
                                <div><span className="font-bold text-[#0A0A0A]">Name:</span> <span className="text-[#0A0A0A]">{ind.name}</span></div>
                            </div>
                        ))}
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[200px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[200px]",
        },
        {
            header: "Age & Service Yrs",
            cell: (item) => {
                const inds = item.individuals && item.individuals.length > 0
                    ? item.individuals
                    : [];
                return (
                    <div className="flex flex-col space-y-3">
                        {inds.map((ind: any, idx: number) => (
                            <div key={idx} className="flex flex-col font-[Arial] text-xs space-y-1 border-b border-gray-300 last:border-0 pb-2 last:pb-0">
                                <div>{ind.age} Years old</div>
                                <div>{ind.totalServiceDuration} Years</div>
                            </div>
                        ))}
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[120px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "Unit",
            cell: (item) => {
                const inds = item.individuals && item.individuals.length > 0
                    ? item.individuals
                    : [];
                return (
                    <div className="flex flex-col space-y-3">
                        {inds.map((ind: any, idx: number) => (
                            <div key={idx} className="font-[Arial] text-sm text-[#0A0A0A] border-b border-gray-300 last:border-0 pb-2 last:pb-0">
                                {ind.unit || "-"}
                            </div>
                        ))}
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[100px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
        },
        {
            header: "Unit Location",
            cell: (item) => {
                const inds = item.individuals && item.individuals.length > 0
                    ? item.individuals
                    : [];
                return (
                    <div className="flex flex-col space-y-3">
                        {inds.map((ind: any, idx: number) => (
                            <div key={idx} className="font-[Arial] text-sm text-[#0A0A0A] border-b border-gray-300 last:border-0 pb-2 last:pb-0">
                                {ind.unitLocation || "-"}
                            </div>
                        ))}
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[120px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "FMN",
            cell: (item) => {
                const inds = item.individuals && item.individuals.length > 0
                    ? item.individuals
                    : [];
                return (
                    <div className="flex flex-col space-y-3">
                        {inds.map((ind: any, idx: number) => (
                            <div key={idx} className="font-[Arial] text-sm text-[#0A0A0A] border-b border-gray-300 last:border-0 pb-2 last:pb-0">
                                {ind.fmn || "-"}
                            </div>
                        ))}
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[120px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "Whether Indl on Lve or Duty",
            cell: (item) => {
                const inds = item.individuals && item.individuals.length > 0
                    ? item.individuals
                    : [];
                return (
                    <div className="flex flex-col space-y-3">
                        {inds.map((ind: any, idx: number) => (
                            <div key={idx} className="font-[Arial] text-sm text-[#0A0A0A] border-b border-gray-300 last:border-0 pb-2 last:pb-0">
                                {ind.individualWorkingStatus || "-"}
                            </div>
                        ))}
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[120px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "Place of Incident",
            cell: (item) => <span className="font-[Arial] text-sm text-[#0A0A0A]">{item.incidentPlace || "-"}</span>,
            className: "border-r border-gray-300 min-w-[150px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[150px]",
        },
        {
            header: "Date of Incident",
            cell: (item) => <span className="font-[Arial] text-sm text-[#0A0A0A]">{item.incidentDate ? format(new Date(item.incidentDate), 'dd/MM/yyyy') : "-"}</span>,
            className: "border-r border-gray-300 min-w-[100px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
        },
        {
            header: "Time of Incident",
            cell: (item) => <span className="font-[Arial] text-sm text-[#0A0A0A]">{item.incidentTime || "-"}</span>,
            className: "border-r border-gray-300 min-w-[100px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
        },
        {
            header: "Brief of the Incident",
            cell: (item) => (
                <div className="font-[Arial] text-xs text-[#0A0A0A] max-w-[250px] whitespace-normal line-clamp-4">
                    {item.incidentBrief || "-"}
                </div>
            ),
            className: "border-r border-gray-300 min-w-[250px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[250px]",
        },
        {
            header: "Coord with Police on Civ Adm, FIR, Current Sit",
            cell: (item) => (
                <div className="font-[Arial] text-xs text-[#0A0A0A] max-w-[250px] whitespace-normal line-clamp-4">
                    {item.coordinationWithPolice || "-"}
                </div>
            ),
            className: "border-r border-gray-300 min-w-[250px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[250px]",
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
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(item._id)} className="text-red-600">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "w-[50px] sticky right-0 z-10 border-l border-gray-300 bg-white border-b align-top py-2 bg-white",
            headerClassName: "z-20 right-0 bg-gray-100 border-l border-gray-300 font-bold text-[#0A0A0A]",
        },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading incidents...</div>;
    }

    return (
        <div className="w-full h-full flex flex-col">
            <ReportPageHeader
                title="(Initial Report) Immediate Reporting of Incident"
                reportCount={filteredData.length}
                onDownload={() => window.print()}
                breadcrumbItems={[
                    { label: "Reports & Analysis", href: "/" },
                    { label: "All Reports", href: "/reports" },
                ]}
            />

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                offenceTypeOptions={[]}
                unitOptions={unitOptions}
                fmnOptions={fmnOptions}
                unitLocationOptions={unitLocationOptions}
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
                showUnitLocation={true}
                showIndividualWorkingStatus={true}
                onAddNew={onAddNew}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    actionStatus: "All",
                    sortOrder: "asc",
                    fmn: "",
                    unit: "",
                    placeOfOffence: "",
                    unitLocation: "",
                    individualWorkingStatus: "All",
                    fromDate: "",
                    toDate: "",
                })}
                placeholder="Search by army no, name unit, fmn..."
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
