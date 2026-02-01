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

const getIndividualInfo = (ind: any) => {
    const details = { ...(ind.individualDetails || {}), ...(ind.offenderDetails || {}) };

    let type = ind.individualType;
    if (!type) {
        if (details.employeeServiceNumber) type = "employee";
        else if (details.maidPassNumber) type = "servantMaid";
        else if (details.shopOwnerName) type = "shopKeeper";
        else if (details.tempWorkerName) type = "tempHiredWorker";
        else if (details.civilianName || details.civilianAadharCardNumber) type = "civilian";
        else type = "militaryPersonnel";
    }
    return { details, type };
};

const getUnit = (ind: any) => {
    const { details, type } = getIndividualInfo(ind);
    if (type === "militaryPersonnel") return details.unit || details.militaryPersonnelUnit;
    if (type === "employee") return details.employeeUnit;
    if (type === "servantMaid") return details.officersEnclaveUnit;
    if (type === "shopKeeper") return details.shopUnit;
    return details.unit;
};

const getFmn = (ind: any) => {
    const { details, type } = getIndividualInfo(ind);
    if (type === "militaryPersonnel") return details.fmn || details.militaryPersonnelFmn;
    if (type === "employee") return details.employeeFmn;
    if (type === "servantMaid") return details.officersEnclaveFmn;
    return details.fmn;
};

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
        window.open(printUrl, '_blank');
    };

    // 3 Unique Options Logic
    const { placeOptions, unitOptions, fmnOptions } = useMemo(() => {
        if (!incidents) return { placeOptions: [], unitOptions: [], fmnOptions: [] };

        const places = new Set<string>();
        const units = new Set<string>();
        const fmns = new Set<string>();

        incidents.forEach(item => {
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
                        details.unit, details.fmn, details.rank, details.name,
                        // Military
                        details.militaryPersonnelArmyNo, details.militaryPersonnelName, details.militaryPersonnelUnit, details.militaryPersonnelFmn,
                        // Employee
                        details.employeeServiceNumber, details.employeeName, details.employeeUnit, details.employeeFmn,
                        // Maid
                        details.maidPassNumber, details.maidName, details.officersEnclaveUnit, details.officersEnclaveFmn,
                        // Shop
                        details.shopOwnerName, details.shopName, details.shopUnit,
                        // Temp
                        details.tempWorkerName, details.tempWorkerPassNo,
                        // Civilian
                        details.civilianName, details.civilianAadharCardNumber,
                        // Explicit unit/fmn helpers
                        getUnit(ind), getFmn(ind),
                        ind.unitLocation
                    ];

                    return valuesToCheck.some(val => val && String(val).toLowerCase().includes(searchTerm));
                });

            let matchesDate = true;
            // Specific Date Check
            if (filters.date) {
                matchesDate = (item.dateOfOccurrence && item.dateOfOccurrence.includes(filters.date)) || false;
            }

            // Date Range Check
            if (filters.fromDate || filters.toDate) {
                const incidentDate = item.dateOfOccurrence ? new Date(item.dateOfOccurrence) : null;
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
                const selected = filters.unit.split(",").map(s => s.trim().toLowerCase());
                matchesUnit = individuals.some((ind: any) => {
                    const val = getUnit(ind);
                    return val && selected.includes(val.toLowerCase());
                });
            }

            let matchesFmn = true;
            if (filters.fmn && filters.fmn !== "All") {
                const selected = filters.fmn.split(",").map(s => s.trim().toLowerCase());
                matchesFmn = individuals.some((ind: any) => {
                    const val = getFmn(ind);
                    return val && selected.includes(val.toLowerCase());
                });
            }

            let matchesPlace = true;
            if (filters.placeOfOffence && filters.placeOfOffence !== "All") {
                matchesPlace = (item.placeOfOccurrence || "").toLowerCase().includes((filters.placeOfOffence || "").toLowerCase());
            }

            let matchesWorkingStatus = true;
            if (filters.individualWorkingStatus && filters.individualWorkingStatus !== "All") {
                matchesWorkingStatus = individuals.some((ind: any) => (ind.individualWorkingStatus || "") === (filters.individualWorkingStatus || ""));
            }

            return matchesSearch && matchesDate && matchesUnit && matchesFmn && matchesPlace && matchesWorkingStatus;
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
                        {inds.map((ind: any, idx: number) => {
                            const { details, type } = getIndividualInfo(ind);

                            const renderField = (label: string, value: any) => {
                                if (!value) return null;
                                return <div><span className="font-bold text-[#0A0A0A]">{label}:</span> <span className="text-[#0A0A0A]">{value}</span></div>;
                            };

                            const renderDate = (label: string, value: any) => {
                                if (!value) return null;
                                return <div><span className="font-bold text-[#0A0A0A]">{label}:</span> <span className="text-[#0A0A0A]">{format(new Date(value), 'dd/MM/yyyy')}</span></div>;
                            };

                            return (
                                <div key={idx} className="flex flex-col font-[Arial] text-xs space-y-1 border-b border-gray-300 last:border-0 pb-2 last:pb-0">
                                    {/* Military Personnel */}
                                    {type === "militaryPersonnel" && (
                                        <>
                                            {renderField("Army No", details.armyNo || details.militaryPersonnelArmyNo)}
                                            {renderField("Rank", details.rank || details.militaryPersonnelRank)}
                                            {renderField("Name", details.name || details.militaryPersonnelName)}
                                            {renderField("Unit", details.unit || details.militaryPersonnelUnit)}
                                            {renderField("FMN", details.fmn || details.militaryPersonnelFmn)}
                                            {renderField("Command", details.militaryPersonnelCommand)}
                                            {renderField("I Card Number", details.militaryPersonnelICardNumber)}
                                        </>
                                    )}

                                    {/* Employee */}
                                    {type === "employee" && (
                                        <>
                                            {renderField("Service No", details.employeeServiceNumber)}
                                            {renderField("Name", details.employeeName)}
                                            {renderField("Rank", details.employeeRank)}
                                            {renderField("Unit", details.employeeUnit)}
                                            {renderField("FMN", details.employeeFmn)}
                                            {renderField("Command", details.employeeCommand)}
                                            {renderField("I-Card", details.employeeICardNumber)}
                                        </>
                                    )}

                                    {/* Servant / Maid (Primary) */}
                                    {type === "servantMaid" && (
                                        <>
                                            {renderField("Pass No", details.maidPassNumber)}
                                            {renderField("Name", details.maidName)}
                                            {renderField("Father's Name", details.maidFathersName)}
                                            {renderField("Pass ID", details.maidPassID)}
                                            {renderField("Trade", details.maidTrade)}
                                            {renderField("Worked at Qtr", details.maidQuarterNumber)}
                                            {renderField("C/O Rank", details.officersEnclaveRank)}
                                            {renderField("C/O Name", details.officersEnclaveName)}
                                            {renderField("Place of Qtr", details.officersEnclavePlaceOfQtr)}
                                            {renderField("Unit", details.officersEnclaveUnit)}
                                            {renderField("FMN", details.officersEnclaveFmn)}
                                            {renderField("Command", details.officersEnclaveCommand)}
                                            {renderField("I-Card", details.officersEnclaveICardNumber)}
                                        </>
                                    )}

                                    {/* Shop Keeper (Primary) */}
                                    {type === "shopKeeper" && (
                                        <>
                                            {renderField("Shop Owner", details.shopOwnerName)}
                                            {renderField("Shop Name", details.shopName)}
                                            {renderField("Address", details.shopAddress)}
                                            {renderField("Unit", details.shopUnit)}
                                            {renderField("Pass No", details.shopPassNo)}
                                            {renderDate("Issue Date", details.shopPassIssueDate)}
                                            {renderDate("Expire Date", details.shopPassExpireDate)}
                                        </>
                                    )}

                                    {/* Temp Hired Worker (Primary) */}
                                    {type === "tempHiredWorker" && (
                                        <>
                                            {renderField("Name", details.tempWorkerName)}
                                            {renderField("Place of Stay", details.tempWorkerPlaceOfStay)}
                                            {renderField("Place of Work", details.tempWorkerPlaceOfWork)}
                                            {renderField("Type of Work", details.tempWorkerTypeOfWork)}
                                            {renderField("Pass No", details.tempWorkerPassNo)}
                                            {renderDate("Issue Date", details.tempWorkerPassIssueDate)}
                                            {renderDate("Expire Date", details.tempWorkerPassExpireDate)}
                                        </>
                                    )}

                                    {/* Civilian */}
                                    {type === "civilian" && (
                                        <>
                                            {renderField("Name", details.civilianName)}
                                            {renderField("Aadhar No", details.civilianAadharCardNumber)}
                                            {renderField("Father's Name", details.civilianFathersName)}
                                            {renderField("Address", details.civilianAddress)}

                                            {details.isDependent && (
                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                    <div className="font-semibold text-gray-700 mb-1">
                                                        Relative <span className="font-normal text-xs">({details.relationName})</span>:
                                                    </div>
                                                    {/* Nested Relative Details */}
                                                    {details.relativeCategory === "militaryPersonnel" && details.relativeDetails && (
                                                        <>
                                                            {renderField("Army No", details.relativeDetails.armyNo || details.relativeDetails.militaryPersonnelArmyNo)}
                                                            {renderField("Rank", details.relativeDetails.rank || details.relativeDetails.militaryPersonnelRank)}
                                                            {renderField("Name", details.relativeDetails.name || details.relativeDetails.militaryPersonnelName)}
                                                            {renderField("Unit", details.relativeDetails.unit || details.relativeDetails.militaryPersonnelUnit)}
                                                            {renderField("FMN", details.relativeDetails.fmn || details.relativeDetails.militaryPersonnelFmn)}
                                                            {renderField("Command", details.relativeDetails.militaryPersonnelCommand)}
                                                        </>
                                                    )}
                                                    {details.relativeCategory === "employee" && details.relativeDetails && (
                                                        <>
                                                            {renderField("Service No", details.relativeDetails.employeeServiceNumber)}
                                                            {renderField("Name", details.relativeDetails.employeeName)}
                                                            {renderField("Rank", details.relativeDetails.employeeRank)}
                                                            {renderField("Unit", details.relativeDetails.employeeUnit)}
                                                            {renderField("FMN", details.relativeDetails.employeeFmn)}
                                                            {renderField("Command", details.relativeDetails.employeeCommand)}
                                                        </>
                                                    )}
                                                    {details.relativeCategory === "servantMaid" && details.relativeDetails && (
                                                        <>
                                                            {renderField("Pass No", details.relativeDetails.maidPassNumber)}
                                                            {renderField("Father's Name", details.relativeDetails.maidFathersName)}
                                                            {renderField("Pass ID", details.relativeDetails.maidPassID)}
                                                            {renderField("Name", details.relativeDetails.maidName || details.relativeDetails.officersEnclaveName)}
                                                            {renderField("Trade", details.relativeDetails.maidTrade)}
                                                            {renderField("Worked at Qtr", details.relativeDetails.maidQuarterNumber)}
                                                            {renderField("C/O Rank", details.relativeDetails.officersEnclaveRank)}
                                                            {renderField("C/O Name", details.relativeDetails.officersEnclaveName)}
                                                            {renderField("Place of Qtr", details.relativeDetails.maidPlaceOfQtr || details.relativeDetails.officersEnclavePlaceOfQtr)}
                                                            {renderField("Unit", details.relativeDetails.maidUnit || details.relativeDetails.officersEnclaveUnit)}
                                                            {renderField("FMN", details.relativeDetails.maidFmn || details.relativeDetails.officersEnclaveFmn)}
                                                            {renderField("Command", details.relativeDetails.maidCommand || details.relativeDetails.officersEnclaveCommand)}
                                                            {renderField("Address", details.relativeDetails.maidAddress || details.relativeDetails.officersEnclaveAddress)}
                                                            {renderField("I-Card", details.relativeDetails.maidICardNumber || details.relativeDetails.officersEnclaveICardNumber)}

                                                        </>
                                                    )}
                                                    {details.relativeCategory === "shopKeeper" && details.relativeDetails && (
                                                        <>
                                                            {renderField("Shop Owner", details.relativeDetails.shopOwnerName)}
                                                            {renderField("Shop Name", details.relativeDetails.shopName)}
                                                            {renderField("Address", details.relativeDetails.shopAddress)}
                                                            {renderField("Unit", details.relativeDetails.shopUnit)}
                                                            {renderField("Pass No", details.relativeDetails.shopPassNo)}
                                                            {renderDate("Issue Date", details.relativeDetails.shopPassIssueDate)}
                                                            {renderDate("Expire Date", details.relativeDetails.shopPassExpireDate)}
                                                        </>
                                                    )}
                                                    {details.relativeCategory === "tempHiredWorker" && details.relativeDetails && (
                                                        <>
                                                            {renderField("Name", details.relativeDetails.tempWorkerName)}
                                                            {renderField("Place of Stay", details.relativeDetails.tempWorkerPlaceOfStay)}
                                                            {renderField("Place of Work", details.relativeDetails.tempWorkerPlaceOfWork)}
                                                            {renderField("Type of Work", details.relativeDetails.tempWorkerTypeOfWork)}
                                                            {renderField("Pass No", details.relativeDetails.tempWorkerPassNo)}
                                                            {renderDate("Issue Date", details.relativeDetails.tempWorkerPassIssueDate)}
                                                            {renderDate("Expire Date", details.relativeDetails.tempWorkerPassExpireDate)}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[200px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[200px]",
        },

        {
            header: "Vehicle BA No. / Reg No.",
            cell: (item) => <span className="font-[Arial] text-sm text-[#0A0A0A]">{item.vehicleNumber || "-"}</span>,
            className: "border-r border-gray-300 min-w-[120px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "Make & Take",
            cell: (item) => <span className="font-[Arial] text-sm text-[#0A0A0A]">{item.vehicleName || "-"}</span>,
            className: "border-r border-gray-300 min-w-[120px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "Age & Service Yrs",
            cell: (item) => {
                const age = item.age || item.individuals?.[0]?.age || "-";
                const service = item.totalServiceDuration || item.individuals?.[0]?.totalServiceDuration || "-";
                return (
                    <div className="flex flex-col font-[Arial] text-xs space-y-1">
                        <div>{age} Years Old</div>
                        <div>{service} Years</div>
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[120px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },

        {
            header: "Whether Indl on Lve or Duty",
            cell: (item) => {
                const status = item.individualWorkingStatus || item.individuals?.[0]?.individualWorkingStatus || "-";
                return (
                    <div className="font-[Arial] text-sm text-[#0A0A0A]">
                        {status}
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[120px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "Place of Incident",
            cell: (item) => <span className="font-[Arial] text-sm text-[#0A0A0A]">{item.placeOfOccurrence || "-"}</span>,
            className: "border-r border-gray-300 min-w-[150px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[150px]",
        },
        {
            header: "Date of Incident",
            cell: (item) => <span className="font-[Arial] text-sm text-[#0A0A0A]">{item.dateOfOccurrence ? format(new Date(item.dateOfOccurrence), 'dd/MM/yyyy') : "-"}</span>,
            className: "border-r border-gray-300 min-w-[100px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
        },
        {
            header: "Time of Incident",
            cell: (item) => <span className="font-[Arial] text-sm text-[#0A0A0A]">{item.timeOfOccurrence || "-"}</span>,
            className: "border-r border-gray-300 min-w-[100px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
        },
        {
            header: "Brief of the Incident",
            cell: (item) => (
                <div className="font-[Arial] text-xs text-[#0A0A0A] max-w-[250px] whitespace-normal line-clamp-4">
                    {item.description || "-"}
                </div>
            ),
            className: "border-r border-gray-300 min-w-[250px] align-top py-2",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[250px]",
        },
        {
            header: "Coord with Police on Civ Adm, FIR, Current Sit",
            cell: (item) => (
                <div className="font-[Arial] text-xs text-[#0A0A0A] max-w-[250px] whitespace-normal line-clamp-4">
                    {item.coordWith || "-"}
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
                        {/* <DropdownMenuItem onClick={() => onEdit(item)}>
                            Edit
                        </DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => handlePrintClick(item._id)}>
                            Print Initial Report
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
                title="MP Occurrence & Investigation Initial Report"
                pageHeaderTitle="(Initial Report) Immediate Reporting of Incident"
                reportCount={filteredData.length}
                // onDownload={() => window.print()}
                breadcrumbItems={[
                    { label: "Immediate Reporting of Incident", href: "/reports/immediate-reporting-incident" },
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
                onReset={() => setFilters({
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
                })}

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
