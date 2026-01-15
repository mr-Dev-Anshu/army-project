"use client";

import React, { useMemo, useState } from "react";
import { format, differenceInDays, isValid } from "date-fns";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";

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

import { useGetAllVehiclesSecurityPasses, useDeleteVehiclesSecurityPass } from "../hooks";
import { VehiclesSecurityPassManagement } from "@/apis/vehiclesSecurityPassManagement/types";

interface Props {
    onAddNew: () => void;
    onEdit: (item: VehiclesSecurityPassManagement) => void;
}

const VehiclesSecurityPassManagementTable: React.FC<Props> = ({ onAddNew, onEdit }) => {
    const { data: passes = [], isLoading } = useGetAllVehiclesSecurityPasses();
    const { mutateAsync: deletePass, isPending: isDeleting } = useDeleteVehiclesSecurityPass();

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null,
    });

    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "",
        actionStatus: "All",
        sortOrder: "asc",
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
            await deletePass(deleteModal.id);
            toast.success("Security Pass deleted successfully");
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            console.error("Failed to delete pass:", error);
            toast.error("Failed to delete security pass");
        }
    };

    const filteredData = useMemo(() => {
        return passes.filter((item: VehiclesSecurityPassManagement) => {
            // Search logic
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                item.vehicleIdentification?.registrationNumber?.toLowerCase().includes(searchTerm) ||
                item.ownerInformation?.name?.toLowerCase().includes(searchTerm) ||
                item.vehiclePassDetails?.passNumber?.toLowerCase().includes(searchTerm) ||
                item.ownerInformation?.ownerDetails?.unit?.toLowerCase().includes(searchTerm);

            // Date logic (Record Date or Issued Date)
            const createdDate = item.createdAt;
            const issuedDate = item.vehiclePassDetails?.issuedDate ? new Date(item.vehiclePassDetails.issuedDate).toISOString() : "";

            const matchesDate = filters.date
                ? (createdDate && createdDate.includes(filters.date)) ||
                (issuedDate && issuedDate.includes(filters.date))
                : true;

            // Pass Status Logic (Valid/Expired)
            let matchesStatus = true;
            if (filters.actionStatus && filters.actionStatus !== "All") {
                const validTo = item.vehiclePassDetails?.validTo ? new Date(item.vehiclePassDetails.validTo) : null;
                const isExpired = validTo ? validTo < new Date() : false;

                if (filters.actionStatus === "Valid") {
                    matchesStatus = !isExpired && !!validTo;
                } else if (filters.actionStatus === "Expired") {
                    matchesStatus = isExpired;
                }
            }

            return matchesSearch && matchesDate && matchesStatus;
        });
    }, [passes, filters]);

    const columns: Column<VehiclesSecurityPassManagement>[] = [
        {
            header: "Sr no.",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {filteredData.indexOf(item) + 1}
                </span>
            ),
            className: (item) => {
                const validTo = item.vehiclePassDetails?.validTo ? new Date(item.vehiclePassDetails.validTo) : null;
                const isExpired = validTo ? validTo < new Date() : false;
                return `w-16 sticky left-0 z-10 border-r border-gray-300 ${isExpired ? "bg-red-50 hover:bg-red-50" : "bg-white border-b border-gray-300"}`;
            },
            headerClassName: "z-20 left-0 bg-gray-100 border-r border-gray-300 font-bold text-[#0A0A0A]",
        },
        {
            header: "Record Date",
            accessorKey: "createdAt",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "-"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 min-w-[100px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
        },
        {
            header: "Vehicle Reg. No.",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item.vehicleIdentification?.registrationNumber || "-"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 min-w-[140px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[140px]",
        },
        {
            header: "Vehicle Category",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item.vehicleIdentification?.category || "-"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 min-w-[120px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "Vehicle Type",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item.vehicleIdentification?.type || "-"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 min-w-[100px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
        },
        {
            header: "Color",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item.vehicleIdentification?.color || "-"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 min-w-[80px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[80px]",
        },
        {
            header: "Owner Name & Mobile No.",
            cell: (item) => (
                <div className="flex flex-col font-[Arial]">
                    <span className="font-normal text-[#0A0A0A]">{item.ownerInformation?.name || "-"}</span>
                    <span className="text-[#0A0A0A] font-normal text-xs">{item.ownerInformation?.mobileNumber || "-"}</span>
                </div>
            ),
            className: "border-r border-gray-300 min-w-[180px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[180px]",
        },
        {
            header: "Owner Type",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A] capitalize">
                    {item.ownerInformation?.ownerType?.replace(/([A-Z])/g, ' $1').trim() || "-"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 min-w-[120px] capitalize",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "Owner Particulars",
            cell: (item) => {
                const info = item.ownerInformation;
                const details = info?.ownerDetails || {};
                if (!info) return "-";

                const renderField = (label: string, value: any) => {
                    if (!value) return null;
                    return (
                        <div>
                            <span className="font-semibold text-gray-500">{label}:</span> <span className="text-gray-900">{value}</span>
                        </div>
                    );
                };

                const renderDate = (label: string, value: any) => {
                    if (!value) return null;
                    return renderField(label, format(new Date(value), "dd/MM/yyyy"));
                };

                // Military Personnel
                if (info.ownerType === "militaryPersonnel") {
                    return (
                        <div className="flex flex-col space-y-1 font-[Arial] text-xs">
                            {renderField("Army No", details.armyNo)}
                            {renderField("Rank", details.rank)}
                            {renderField("Unit", details.unit)}
                            {renderField("FMN", details.fmn)}
                            {renderField("Command", details.command)}
                        </div>
                    );
                }

                // Employee
                if (info.ownerType === "employee") {
                    return (
                        <div className="flex flex-col space-y-1 font-[Arial] text-xs">
                            {renderField("Service No", details.serviceNumber)}
                            {renderField("Rank", details.employeeRank)}
                            {renderField("Unit", details.employeeUnit)}
                            {renderField("FMN", details.employeeFmn)}
                            {renderField("Command", details.employeeCommand)}
                            {renderField("I-Card", details.employeeICardNumber)}
                        </div>
                    );
                }

                // Servant / Maid (Primary)
                if (info.ownerType === "servantMaid") {
                    return (
                        <div className="flex flex-col space-y-1 font-[Arial] text-xs">
                            {renderField("Pass No", details.maidPassNumber)}
                            {renderField("Father's Name", details.maidFathersName)}
                            {renderField("Pass ID", details.maidPassID)}
                            {renderField("Trade", details.maidTrade)}
                            {renderField("Worked at Qtr", details.maidQuarterNumber)}
                            {renderField("Employer Rank", details.officersEnclaveRank)}
                            {renderField("Employer Name", details.officersEnclaveName)}
                            {renderField("Place of Qtr", details.maidPlaceOfQtr)}
                            {renderField("Unit", details.maidUnit)}
                            {renderField("FMN", details.maidFmn)}
                            {renderField("Command", details.maidCommand)}
                            {renderField("I-Card", details.maidICardNumber)}
                        </div>
                    );
                }

                // Shop Keeper (Primary)
                if (info.ownerType === "shopKeeper") {
                    return (
                        <div className="flex flex-col space-y-1 font-[Arial] text-xs">
                            {renderField("Shop Owner", details.shopOwnerName)}
                            {renderField("Shop Name", details.shopName)}
                            {renderField("Address", details.shopAddress)}
                            {renderField("Unit", details.shopUnit)}
                            {renderField("Pass No", details.shopPassNo)}
                            {renderDate("Issue Date", details.shopPassIssueDate)}
                            {renderDate("Expire Date", details.shopPassExpireDate)}
                        </div>
                    );
                }

                // Temp Hired Worker (Primary)
                if (info.ownerType === "tempHiredWorker") {
                    return (
                        <div className="flex flex-col space-y-1 font-[Arial] text-xs">
                            {renderField("Name", details.tempWorkerName)}
                            {renderField("Place of Stay", details.placeOfStay)}
                            {renderField("Place of Work", details.placeOfWork)}
                            {renderField("Type of Work", details.typeOfWork)}
                            {renderField("Pass No", details.tempWorkerPassNo)}
                            {renderDate("Issue Date", details.tempWorkerPassIssueDate)}
                            {renderDate("Expire Date", details.tempWorkerPassExpireDate)}
                        </div>
                    );
                }

                // Civilian
                if (info.ownerType === "civilian") {
                    return (
                        <div className="flex flex-col space-y-1 font-[Arial] text-xs">
                            {renderField("Aadhar No", details.aadharCardNumber)}
                            {renderField("Father's Name", details.fathersName)}

                            {details.isDependent && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                    <div className="font-semibold text-gray-700 mb-1">
                                        Relative ({details.relationName}) - {details.relativeCategory}:
                                    </div>
                                    {/* Nested Relative Details */}
                                    {details.relativeCategory === "militaryPersonnel" && details.relativeDetails && (
                                        <>
                                            {renderField("Army No", details.relativeDetails.armyNo)}
                                            {renderField("Rank", details.relativeDetails.rank)}
                                            {renderField("Unit", details.relativeDetails.unit)}
                                            {renderField("FMN", details.relativeDetails.fmn)}
                                            {renderField("Command", details.relativeDetails.command)}
                                        </>
                                    )}
                                    {details.relativeCategory === "servantMaid" && details.relativeDetails && (
                                        <>
                                            {renderField("Pass No", details.relativeDetails.maidPassNumber)}
                                            {renderField("Father's Name", details.relativeDetails.maidFathersName)}
                                            {renderField("Pass ID", details.relativeDetails.maidPassID)}
                                            {renderField("Name", details.relativeDetails.relativeName)}
                                            {renderField("Trade", details.relativeDetails.maidTrade)}
                                            {renderField("Worked at Qtr", details.relativeDetails.maidQuarterNumber)}
                                            {renderField("Employer Rank", details.relativeDetails.officersEnclaveRank)}
                                            {renderField("Employer Name", details.relativeDetails.officersEnclaveName)}
                                            {renderField("Place of Qtr", details.relativeDetails.maidPlaceOfQtr)}
                                            {renderField("Unit", details.relativeDetails.maidUnit)}
                                            {renderField("FMN", details.relativeDetails.maidFmn)}
                                            {renderField("Command", details.relativeDetails.maidCommand)}
                                            {renderField("Address", details.relativeDetails.relativeAddress)}
                                            {renderField("I-Card", details.relativeDetails.maidICardNumber)}

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
                            {/* Fallback Address if exists and not redundant */}
                            {details.address && renderField("Address", details.address)}
                        </div>
                    );
                }

                // Fallback
                return (
                    <div className="flex flex-col space-y-1 font-[Arial] text-xs text-[#0A0A0A]">
                        {details.address && <div><span className="font-semibold">Address:</span> {details.address}</div>}
                    </div>
                );
            },
            className: "border-r border-gray-300 min-w-[180px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[180px]",
        },
        {
            header: "Pass Status",
            cell: (item) => {
                const validTo = item.vehiclePassDetails?.validTo ? new Date(item.vehiclePassDetails.validTo) : null;
                const isExpired = validTo ? validTo < new Date() : false;
                // Assuming "Pass Status" Yes/No means "Is Valid?" or "Is Issued?"
                // Image shows "Yes" and "No". "No" corresponds to "Pass Expired".
                return (
                    <span className="font-normal font-[Arial] text-[#0A0A0A]">
                        {item.vehiclePassDetails?.isAvailable && !isExpired ? "Yes" : "No"}
                    </span>
                );
            },
            className: "border-r border-gray-300 min-w-[80px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[80px]",
        },
        {
            header: "Pass No.",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item.vehiclePassDetails?.passNumber || "-"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 min-w-[100px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[100px]",
        },
        {
            header: (
                <div className="flex flex-col h-full">
                    <div className="text-xs text-center font-bold uppercase text-[#0A0A0A] pb-2 border-b border-gray-300 px-4 pt-3 bg-gray-100">
                        Pass Validity
                    </div>
                    <div className="flex text-[10px] items-center text-[#0A0A0A] font-medium bg-gray-100">
                        <div className="flex-1 px-4 py-1 border-r border-gray-300 ">From</div>
                        <div className="flex-1 px-4 py-1">To</div>
                    </div>
                </div>
            ),
            cell: (item) => {
                const validFrom = item.vehiclePassDetails?.validFrom ? new Date(item.vehiclePassDetails.validFrom) : null;
                const validTo = item.vehiclePassDetails?.validTo ? new Date(item.vehiclePassDetails.validTo) : null;
                const isExpired = validTo ? validTo < new Date() : false;
                const daysAgo = isExpired && validTo ? differenceInDays(new Date(), validTo) : 0;

                return (
                    <div className="relative h-full flex flex-col items-center justify-center font-[Arial]">
                        <div className="flex w-full">
                            <div className={`flex-1 px-4 border-r border-gray-100 text-sm font-normal text-center ${isExpired ? "text-[#AEAEB2]" : "text-[#0A0A0A]"}`}>
                                {validFrom && isValid(validFrom) ? format(validFrom, "dd/MM/yyyy") : "-"}
                            </div>
                            <div className={`flex-1 px-4 text-sm font-normal text-center ${isExpired ? "text-[#AEAEB2]" : "text-[#0A0A0A]"}`}>
                                {validTo && isValid(validTo) ? format(validTo, "dd/MM/yyyy") : "-"}
                            </div>
                        </div>
                        {isExpired && (
                            <div className="flex flex-col items-center justify-center mt-3">
                                <span className="text-[12px] font-bold text-[#FF383C] uppercase tracking-wide">
                                    PASS EXPIRED
                                </span>
                                <span className="text-[10px] font-semibold text-[#0A0A0A]">
                                    {daysAgo} Days Ago
                                </span>
                            </div>
                        )}
                    </div>
                );
            },
            className: "min-w-[220px] py-4 align-top border-r border-gray-300",
            headerClassName: "p-0 min-w-[220px] border-r border-gray-300 font-bold text-[#0A0A0A]",
        },
        {
            header: "Pass Issued Date",
            cell: (item) => {
                const date = item.vehiclePassDetails?.issuedDate ? new Date(item.vehiclePassDetails.issuedDate) : null;
                return (
                    <span className="font-normal font-[Arial] text-[#0A0A0A]">
                        {date && isValid(date) ? format(date, "dd/MM/yyyy") : "-"}
                    </span>
                );
            },
            className: "border-r border-gray-300 min-w-[120px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[120px]",
        },
        {
            header: "Issuing Authority",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item.vehiclePassDetails?.issuingAuthority || "-"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 min-w-[140px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[140px]",
        },
        {
            header: (
                <div className="flex flex-col h-full">
                    <div className="text-xs text-center font-bold uppercase text-[#0A0A0A] pb-2 border-b border-gray-300 px-4 pt-3 bg-gray-100">
                        Initials of
                    </div>
                    <div className="flex text-[10px] items-center text-[#0A0A0A] font-medium bg-gray-100">
                        <div className="flex-1 px-4 py-1 border-r border-gray-300 text-center">MPCR NCO</div>
                        <div className="flex-1 px-4 py-1 border-r border-gray-300 text-center">SM/SJCO</div>
                        <div className="flex-1 px-4 py-1 text-center">2IC</div>
                    </div>
                </div>
            ),
            cell: (item) => (
                <div className="flex w-full h-full items-center justify-center font-[Arial]">
                    <div className="flex-1 px-2 border-r border-gray-100 text-center text-sm text-[#0A0A0A]">{item.authentication?.initialsMPCPNCO || "-"}</div>
                    <div className="flex-1 px-2 border-r border-gray-100 text-center text-sm text-[#0A0A0A]">{item.authentication?.initialsQMSJCO || "-"}</div>
                    <div className="flex-1 px-2 text-center text-sm text-[#0A0A0A]">{item.authentication?.initials2IC || "-"}</div>
                </div>
            ),
            className: "min-w-[240px] p-0 align-top border-r border-gray-300",
            headerClassName: "p-0 min-w-[240px] border-r border-gray-300 font-bold text-[#0A0A0A]",
        },
        {
            header: "Remark",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item.remark || "-"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 min-w-[150px]",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] min-w-[150px]",
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
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(item._id)} className="text-red-600">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: (item) => {
                const validTo = item.vehiclePassDetails?.validTo ? new Date(item.vehiclePassDetails.validTo) : null;
                const isExpired = validTo ? validTo < new Date() : false;
                return `w-[50px] sticky right-0 z-10 border-l border-gray-300 ${isExpired ? "bg-red-50 hover:bg-red-50" : "bg-white border-b border-gray-300"}`;
            },
            headerClassName: "z-20 right-0 bg-gray-100 border-l border-gray-300 font-bold text-[#0A0A0A]",
        },
    ];


    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading security passes...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* Icon from image or shopkeeper table */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <g clipPath="url(#clip0_670_96759)">
                            <path d="M10 17C10.2761 17 10.5 16.7761 10.5 16.5C10.5 16.2239 10.2761 16 10 16C9.72386 16 9.5 16.2239 9.5 16.5C9.5 16.7761 9.72386 17 10 17Z" stroke="#404040" strokeWidth="1.2" strokeLinejoin="round" />
                            <path d="M15.5 17C15.7761 17 16 16.7761 16 16.5C16 16.2239 15.7761 16 15.5 16C15.2239 16 15 16.2239 15 16.5C15 16.7761 15.2239 17 15.5 17Z" stroke="#404040" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="round" />
                            <path d="M7.02344 7.02499H8.02344L9.35344 13.235C9.40223 13.4624 9.52877 13.6657 9.71129 13.8099C9.89381 13.9541 10.1209 14.0302 10.3534 14.025H15.2434C15.471 14.0246 15.6917 13.9466 15.869 13.8039C16.0462 13.6612 16.1695 13.4623 16.2184 13.24L17.0434 9.52499H8.55844" stroke="#404040" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_670_96759">
                                <rect width="12" height="12" fill="white" transform="translate(6 6)" />
                            </clipPath>
                        </defs>
                    </svg>
                    <h2 className="text-lg font-semibold text-[#404040]">Vehicles Security Pass</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">{filteredData.length} Vehicle</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                offenceTypeOptions={[]}
                showOffenceType={false}
                showActionStatus={true}
                statusLabel="Pass Status"
                actionStatusOptions={["Valid", "Expired"]}
                showPriceListFilter={false}
                showAgreementStatus={false}
                showDateRange={false}
                showFilter={true}
                onAddNew={onAddNew}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    actionStatus: "All",
                    sortOrder: "asc",
                })}
                placeholder="Search by report no, unit, offence type..."
                showFmn={false}
                showPlaceOfOffence={false}
            />

            <DynamicTable
                className="[&::-webkit-scrollbar]:hidden border-gray-300 [&_tbody]:divide-gray-300 [&_table]:border-gray-300"
                data={filteredData}
                columns={columns}
                getRowClassName={(item) => {
                    const validTo = item.vehiclePassDetails?.validTo ? new Date(item.vehiclePassDetails.validTo) : null;
                    const isExpired = validTo ? validTo < new Date() : false;
                    return isExpired ? "bg-red-50 border border-red-500 hover:bg-red-50" : "border-b border-gray-300 hover:bg-white";
                }}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Security Pass"
                message="Are you sure you want to delete this security pass? This action cannot be undone."
                confirmLabel="Delete"
                isProcessing={isDeleting}
            />
        </div>
    );
};

export default VehiclesSecurityPassManagementTable;
