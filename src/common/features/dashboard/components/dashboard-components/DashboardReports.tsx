"use client";

import React, { useMemo, useState } from "react";
import {
    Search,
    Calendar,
    Filter,
    ArrowUpDown,
    MoreVertical,
    Eye,
    Printer,
    Edit,
    Trash,
    ChevronDown,
    ArrowLeft,
    RotateCcw
} from "lucide-react";
import MilitaryPoliceReport, { MilitaryPoliceReportProps } from "@/components/reports/MilitaryPoliceReport";
import { useGetAllTrafficOffences, useUpdateTrafficOffence, useDeleteTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { DynamicTable, Column } from "@/components/common/DynamicTable";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default function DashboardReports() {
    const [search, setSearch] = useState("");
    const [offenceCategory, setOffenceCategory] = useState("All");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [status, setStatus] = useState("All");
    const [viewingReport, setViewingReport] = useState<any | null>(null);
    const [shouldAutoPrint, setShouldAutoPrint] = useState(false);

    // Auto Print Effect
    React.useEffect(() => {
        if (viewingReport && shouldAutoPrint) {
            const timer = setTimeout(() => {
                window.print();
                setShouldAutoPrint(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [viewingReport, shouldAutoPrint]);

    // Reuse hooks from General Traffic Offence
    const { data, isLoading } = useGetAllTrafficOffences({ groupBy: "offenceType" });
    const { mutateAsync: updateOffence } = useUpdateTrafficOffence();
    const { mutateAsync: deleteOffence } = useDeleteTrafficOffence();

    const [modalState, setModalState] = React.useState<{ isOpen: boolean; offenceId: string | null; type: "status" | "delete"; newStatus?: boolean }>({
        isOpen: false,
        offenceId: null,
        type: "status",
        newStatus: false,
    });

    const allOffences = useMemo(() => {
        if (!data) return [];

        // Flatten the grouped data
        let flattened: any[] = [];
        data.forEach((group: any) => {
            if (group.offences) {
                flattened = [...flattened, ...group.offences];
            }
        });
        return flattened;
    }, [data]);

    const filteredData = useMemo(() => {
        return allOffences.filter(item => {
            // Search
            const searchLower = search.toLowerCase();
            const reportNo = item.reportNumber?.toLowerCase() || "";
            const offenceType = item.currentOffenceType?.toLowerCase() || "";
            const matchesSearch = !search || reportNo.includes(searchLower) || offenceType.includes(searchLower);

            // Category
            const matchesCategory = offenceCategory === "All" || item.currentOffenceType === offenceCategory;

            // Date
            // Note: Comparing dates roughly for now
            let matchesDate = true;
            if (date) {
                const itemDate = new Date(item.offenceOccurenceDetails?.timeOfOffence || item.createdAt);
                matchesDate = itemDate.toDateString() === date.toDateString();
            }

            // Status
            let matchesStatus = true;
            if (status !== "All") {
                const isTaken = item.actionStatus === true;
                if (status === "Taken") matchesStatus = isTaken;
                if (status === "Pending") matchesStatus = !isTaken;
            }

            return matchesSearch && matchesCategory && matchesDate && matchesStatus;
        }).map((item, index) => ({ ...item, displayIndex: index + 1 }));
    }, [allOffences, search, offenceCategory, date, status]);

    const handleStatusClick = (offenceId: string, currentStatus: boolean) => {
        setModalState({
            isOpen: true,
            offenceId,
            type: "status",
            newStatus: !currentStatus,
        });
    };

    const handleDeleteClick = (offenceId: string) => {
        setModalState({
            isOpen: true,
            offenceId,
            type: "delete",
        });
    };

    const handleConfirm = async () => {
        if (!modalState.offenceId) return;
        try {
            if (modalState.type === "status") {
                await updateOffence({
                    id: modalState.offenceId,
                    data: { actionStatus: modalState.newStatus },
                });
                toast.success("Action status updated successfully!");
            } else if (modalState.type === "delete") {
                await deleteOffence(modalState.offenceId);
                toast.success("Report deleted successfully!");
            }
            setModalState({ isOpen: false, offenceId: null, type: "status", newStatus: false });
        } catch (error) {
            toast.error("Failed to update.");
        }
    };

    const mapToReportProps = (offence: any): MilitaryPoliceReportProps => {
        const primary = offence.offenders?.[0]?.offenderDetails || {};
        const secondary = offence.offenders?.[1]?.offenderDetails;
        const mpDetails = offence.onDutyDetailsMPReporting || {};
        const occDetails = offence.offenceOccurenceDetails || {};
        const witness = offence.witnessDetails?.[0] || {};
        const date = new Date(occDetails.timeOfOffence || offence.createdAt);

        return {
            reportNo: offence.reportNumber || "N/A",
            reportDate: new Date(offence.createdAt).toLocaleDateString("en-GB"),
            particulars: {
                primary: {
                    aadharCardNo: primary.aadharCardNo || "N/A",
                    name: primary.name || "N/A",
                    so: primary.so || "N/A",
                    relation: primary.relation || "N/A",
                    armyNo: primary.armyNo || "N/A",
                    rank: primary.rank || "N/A",
                    unit: primary.unit || "N/A",
                    fmn: primary.fmn || "N/A",
                    command: primary.command || "N/A",
                    address: primary.address || "N/A",
                    iCardNo: primary.iCardNo || "N/A",
                },
                secondary: secondary ? {
                    aadharCardNo: secondary.aadharCardNo || "N/A",
                    name: secondary.name || "N/A",
                    so: secondary.so || "N/A",
                    relation: secondary.relation || "N/A",
                    armyNo: secondary.armyNo || "N/A",
                    rank: secondary.rank || "N/A",
                    unit: secondary.unit || "N/A",
                    fmn: secondary.fmn || "N/A",
                    command: secondary.command || "N/A",
                    address: secondary.address || "N/A",
                    iCardNo: secondary.iCardNo || "N/A",
                } : undefined,
                vehicle: offence.vehicleNumber ? {
                    baNo: offence.vehicleNumber,
                    makeAndTake: offence.vehicleName || "Unknown"
                } : undefined,
            },
            occurrence: {
                dateOfDuty: mpDetails.dateOfDuty ? new Date(mpDetails.dateOfDuty).toLocaleDateString("en-GB") : date.toLocaleDateString("en-GB"),
                dutyTime: mpDetails.dutyTime || "N/A",
                dutyLocation: mpDetails.placeOfDuty || "N/A",
                nameOfWitnessingOfficial1: witness.name || "N/A",
                nameOfWitnessingOfficial2: offence.witnessDetails?.[1]?.name || "",
                nameOfWitnessingOfficial3: offence.witnessDetails?.[2]?.name || "",
                timeOfOffence: date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }),
                locationOfOffence: occDetails.incidentLocation || "N/A",
                statement: occDetails.statement || "No statement provided.",
            },
            offence: {
                type: offence.currentOffenceType || "Traffic Offence",
                ref1: "Mil Tfc offence (Auth - Para 48 of SAO 6/S/2001/PM).",
                ref2: "Para 463(a) of CMP manual, SAO 9/S/78 and Stn order.",
                description: occDetails.description || "No description provided.",
            },
            witnessSig: {
                armyNo: witness.armyNo || "N/A",
                rank: witness.rank || "N/A",
                name: witness.name || "N/A",
                unit: witness.unit || "N/A",
            },
            mpSig: {
                armyNo: mpDetails.armyNoReportingMP || "N/A",
                rank: mpDetails.rank || "N/A",
                name: mpDetails.nameReportingMP || "N/A",
                unit: mpDetails.unit || "N/A",
            },
            remarks: {
                text: offence.remarks || "The indl committed offence as enumerated under Para 3 above. Suitable discp action be initiated against the indl by the unit, and inform to this office within 15 days from issue of this report.",
                station: offence.station || "C/O 56 APO",
                dated: new Date(offence.createdAt).toLocaleDateString("en-GB"),
            },
        };
    };

    const columns = useMemo<Column<any>[]>(() => [
        {
            header: "Sr no.",
            cell: (row) => <span className="text-gray-900 font-medium">{row.displayIndex}</span>,
            className: "w-16 text-center"
        },
        {
            header: "Report no.",
            cell: (row) => <span className="text-gray-600 font-medium text-sm">#{row.reportNumber || "N/A"}</span>,
            className: "w-32"
        },
        {
            header: "Date & Time",
            cell: (row) => {
                const d = new Date(row.offenceOccurenceDetails?.timeOfOffence || row.createdAt);
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-medium text-sm">{format(d, "MMM dd, yyyy")}</span>
                        <span className="text-gray-500 text-xs">{format(d, "HH:mm")}</span>
                    </div>
                )
            },
            className: "w-32"
        },
        {
            header: "Offence Type",
            cell: (row) => <span className="text-gray-900 font-medium text-sm">{row.currentOffenceType || "Traffic Offence"}</span>,
            className: "w-40"
        },
        {
            header: "Offence Brief",
            cell: (row) => <span className="text-gray-600 text-sm truncate max-w-[200px] block" title={row.offenceOccurenceDetails?.description}>{row.offenceOccurenceDetails?.description || "No description"}</span>,
            className: "w-64"
        },
        {
            header: "Particulars of Indls.",
            cell: (row) => {
                const name = row.offenders?.[0]?.offenderDetails?.name || "Unknown";
                return <span className="text-gray-900 font-medium text-sm">{name}</span>
            },
            className: "w-48"
        },
        {
            header: "Action status",
            cell: (row) => {
                const isTaken = row.actionStatus === true;
                return (
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleStatusClick(row._id, isTaken)}>
                        <div className={cn("w-10 h-5 rounded-full p-1 transition-colors duration-200 ease-in-out relative", isTaken ? "bg-green-500" : "bg-red-500")}>
                            <div className={cn("bg-white w-3 h-3 rounded-full shadow-sm absolute top-1 transition-transform duration-200 ease-in-out", isTaken ? "left-[calc(100%-1.25rem)]" : "left-1")} />
                        </div>
                        <span className="text-sm text-gray-600">{isTaken ? "Taken" : "Pending"}</span>
                    </div>
                )
            },
            className: "w-40"
        },
        {
            header: "",
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewingReport(row)} className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setViewingReport(row); setShouldAutoPrint(true); }} className="cursor-pointer">
                            <Printer className="w-4 h-4 mr-2" /> Print
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(row._id)} className="cursor-pointer text-red-600">
                            <Trash className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "w-12 text-center"
        }
    ], []);

    const offenceOptions = useMemo(() => {
        const types = new Set(allOffences.map(o => o.currentOffenceType).filter(Boolean));
        return ["All", ...Array.from(types)];
    }, [allOffences]);

    if (viewingReport) {
        return (
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => setViewingReport(null)} className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Button>
                        <h1 className="text-lg font-semibold text-gray-800">View Report</h1>
                    </div>
                    <Button onClick={() => window.print()} variant="outline" size="sm" className="gap-2">
                        <Printer className="w-4 h-4" />
                        Print Report
                    </Button>
                </div>
                <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-50/50 print:p-0 print:bg-white print:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="w-full max-w-[210mm] print:max-w-none">
                        <MilitaryPoliceReport {...mapToReportProps(viewingReport)} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 justify-between shadow-sm">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by offence type"
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">

                    {/* Offence Category */}
                    <div className="relative">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
                                    <span className="text-gray-400">Offence Category:</span>
                                    <span className="font-medium text-gray-800">{offenceCategory}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {offenceOptions.map(opt => (
                                    <DropdownMenuItem key={opt as string} onClick={() => setOffenceCategory(opt as string)}>
                                        {opt as string}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Date Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
                                <span className="text-gray-400">Date:</span>
                                <span className="font-medium text-gray-800">{date ? format(date, "MMM dd, yyyy") : "All"}</span>
                                <Calendar className="w-4 h-4 text-gray-400" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>


                    {/* Action Status */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
                                <span className="text-gray-400">Action Status:</span>
                                <span className="font-medium text-gray-800">{status}</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setStatus("All")}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatus("Taken")}>Taken</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatus("Pending")}>Pending</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Reset Button */}
                    <div className="border-l border-gray-200 pl-3 ml-3 h-full flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-gray-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                                setSearch("");
                                setOffenceCategory("All");
                                setDate(undefined);
                                setStatus("All");
                            }}
                            title="Reset Filters"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <DynamicTable columns={columns} data={filteredData} className="w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" />

                {filteredData.length === 0 && !isLoading && (
                    <div className="p-8 text-center text-gray-500">
                        No reports found.
                    </div>
                )}
                {isLoading && (
                    <div className="p-8 text-center text-gray-500">
                        Loading reports...
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirm}
                title={modalState.type === "status" ? "Change Action Status" : "Delete Report"}
                message={
                    modalState.type === "status"
                        ? `Are you sure you want to change the status to ${modalState.newStatus ? "Taken" : "Pending"}?`
                        : "Are you sure you want to delete this report? This action cannot be undone."
                }
                confirmLabel={modalState.type === "status" ? "Yes, Change" : "Yes, Delete"}
            />
        </div>
    );
}
