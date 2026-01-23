import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportFilterBar, { FilterState } from "@/components/common/ReportFilterBar";
import ConfirmationModal from "@/components/common/ConfirmationModal";

interface GeneralDutyDiaryTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const GeneralDutyDiaryTable = ({ data, onEdit, onDelete, onAddNew }: GeneralDutyDiaryTableProps) => {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        dutyType: "All",
        date: "",
        sortOrder: "asc",
    });

    // Delete confirmation state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            onDelete(deleteId);
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Extract unique filter options from data
    const { uniqueDutyTypes, uniqueUnits, uniqueFMNs, uniquePlaces } = useMemo(() => {
        const dutyTypes = new Set<string>();
        const units = new Set<string>();
        const fmns = new Set<string>();
        const places = new Set<string>();

        data.forEach(item => {
            const details = item.details || {};
            const offender = item.offender || {};
            const offenderDetails = offender.offenderDetails || details.offenderDetails || {};

            // Duty Types
            if (details.typeOfDuty) dutyTypes.add(details.typeOfDuty);

            // Places (Place of Offence)
            if (details.placeOfOffence) places.add(details.placeOfOffence);

            // Units (Individuals + Offender)
            (details.individuals || []).forEach((ind: any) => {
                if (ind.unit) units.add(ind.unit);
            });
            if (offenderDetails.employeeUnit) units.add(offenderDetails.employeeUnit);
            if (offenderDetails.shopUnit) units.add(offenderDetails.shopUnit);
            if (offenderDetails.officersEnclave?.unit) units.add(offenderDetails.officersEnclave.unit);
            if (offenderDetails.officersEnclave?.officersEnclaveUnit) units.add(offenderDetails.officersEnclave.officersEnclaveUnit);

            // FMNs
            if (offenderDetails.employeeFMN) fmns.add(offenderDetails.employeeFMN);
            if (offenderDetails.officersEnclave?.fmn) fmns.add(offenderDetails.officersEnclave.fmn);
        });

        return {
            uniqueDutyTypes: Array.from(dutyTypes).sort(),
            uniqueUnits: Array.from(units).sort(),
            uniqueFMNs: Array.from(fmns).sort(),
            uniquePlaces: Array.from(places).sort(),
        };
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const details = item.details || {};
            const offender = item.offender || {};
            const offenderDetails = offender.offenderDetails || details.offenderDetails || {};

            // Search logic
            const searchTerm = filters.search.toLowerCase();
            const check = (val: any) => (val?.toString().toLowerCase() || "").includes(searchTerm);

            const matchesSearch =
                check(details.placeOfDuty) ||
                check(details.briefOfDuty) ||
                check(details.reportNo) ||
                check(details.placeOfOffence) ||
                check(details.offenceType) ||
                check(details.occurrenceBrief) ||
                (details.individuals || []).some((ind: any) =>
                    check(ind.name) ||
                    check(ind.armyNo) ||
                    check(ind.rank) ||
                    check(ind.unit)
                ) ||
                check(offenderDetails.name) ||
                check(offenderDetails.civilianName) ||
                check(offenderDetails.civilianAadharCardNumber) ||
                check(offenderDetails.employeeName) ||
                check(offenderDetails.employeeServiceNumber) ||
                check(offenderDetails.maidName) ||
                check(offenderDetails.shopOwnerName) ||
                check(offenderDetails.tempWorkerName);

            // Date logic (Specific Date)
            const itemDate = item.date ? new Date(item.date) : null;
            let matchesDate = true;
            if (filters.date && itemDate) {
                const filterDate = new Date(filters.date);
                matchesDate = itemDate.toDateString() === filterDate.toDateString();
            }

            // Date Range logic
            if (matchesDate && filters.fromDate && itemDate) {
                matchesDate = itemDate >= new Date(filters.fromDate);
            }
            if (matchesDate && filters.toDate && itemDate) {
                matchesDate = itemDate <= new Date(filters.toDate);
            }

            // Duty Type logic
            const matchesDutyType = filters.dutyType && filters.dutyType !== "All"
                ? (details.typeOfDuty || "").toLowerCase() === filters.dutyType.toLowerCase()
                : true;

            // Unit Filter
            let matchesUnit = true;
            if (filters.unit) {
                const searchUnit = filters.unit.toLowerCase();
                const hasIndividualUnit = (details.individuals || []).some((ind: any) => (ind.unit || "").toLowerCase() === searchUnit);
                const hasOffenderUnit =
                    (offenderDetails.employeeUnit || "").toLowerCase() === searchUnit ||
                    (offenderDetails.shopUnit || "").toLowerCase() === searchUnit ||
                    (offenderDetails.officersEnclave?.unit || "").toLowerCase() === searchUnit ||
                    (offenderDetails.officersEnclave?.officersEnclaveUnit || "").toLowerCase() === searchUnit;
                matchesUnit = hasIndividualUnit || hasOffenderUnit;
            }

            // FMN Filter
            let matchesFMN = true;
            if (filters.fmn) {
                const searchFMN = filters.fmn.toLowerCase();
                matchesFMN =
                    (offenderDetails.employeeFMN || "").toLowerCase() === searchFMN ||
                    (offenderDetails.officersEnclave?.fmn || "").toLowerCase() === searchFMN;
            }

            // Place of Offence Filter
            let matchesPlace = true;
            if (filters.placeOfOffence) {
                matchesPlace = (details.placeOfOffence || "").toLowerCase() === filters.placeOfOffence.toLowerCase();
            }

            return matchesSearch && matchesDate && matchesDutyType && matchesUnit && matchesFMN && matchesPlace;
        });
    }, [data, filters]);

    // Add serial numbers to display based on filtered view
    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#E5E5E5" />
                        <path d="M19.334 13.5H12.334V31H20.5007C22.484 31 24.0007 32.5167 24.0007 34.5V18.1667C24.0007 15.6 21.9007 13.5 19.334 13.5Z" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M28.666 23.9974L30.9993 26.3307L35.666 21.6641" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M35.6667 17V13.5H28.6667C26.1 13.5 24 15.6 24 18.1667V34.5C24 32.5167 25.5167 31 27.5 31H35.6667V28.3167" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-lg font-semibold text-[#404040]">Original Military Police General Duty Diary</h2>
                </div>
                <span className="text-sm font-medium  text-[#0A0A0A]">{filteredData.length} Reports</span>
            </div>
            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                showOffenceType={false}
                showActionStatus={false}
                showDateRange={true}
                showDate={true}
                showDutyType={true}
                showUnit={true}
                showFmn={true}
                showPlaceOfOffence={true}
                dutyTypeOptions={uniqueDutyTypes}
                unitOptions={uniqueUnits}
                fmnOptions={uniqueFMNs}
                placeOptions={uniquePlaces}
                showFilter={true}
                onReset={() => setFilters({
                    search: "",
                    dutyType: "All",
                    date: "",
                    fromDate: "",
                    toDate: "",
                    unit: "",
                    fmn: "",
                    placeOfOffence: "",
                    sortOrder: "asc",
                })}
                onAddNew={onAddNew}
                placeholder="Search by Brief of Duty, Place, Name, Army No etc."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1400px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}>
                                    Sr no.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Date of Duty
                                </th>
                                {/* Duty Time Group */}
                                <th className="px-4 py-2 border-r  border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    Duty Time
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Place of Duty
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Type of Duty/Event
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-20 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Total Strength
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 min-w-[250px] align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Assigned Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 min-w-[350px] align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Brief of Duty
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of MPCR NCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of SM/SJCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of 2IC
                                </th>
                                <th className="px-4 py-3 w-[80px] text-center font-bold align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5] border-l border-gray-300" rowSpan={2}>
                                    Actions
                                </th>
                            </tr>
                            <tr>
                                {/* Duty Time Subcols */}
                                <th className="px-4 py-2 border-r border-gray-300 w-20 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">From</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-20 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">To</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {dataWithSrNo.length > 0 ? (
                                dataWithSrNo.map((item, index) => {
                                    return (
                                        <tr key={item._id || index} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-4 py-4 align-top font-medium text-gray-900 border-r border-gray-300 text-center sticky left-0 z-30 bg-white group-hover:bg-gray-50">
                                                {item.serialNumber}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.date ? format(new Date(item.date), "dd/MM/yyyy") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.details?.dutyFrom ? format(new Date(`2000-01-01T${item.details.dutyFrom}`), "HH:mm") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.details?.dutyTill ? format(new Date(`2000-01-01T${item.details.dutyTill}`), "HH:mm") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.details?.placeOfDuty || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.details?.typeOfDuty || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-center text-gray-900">
                                                {item.details?.totalStrength || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300">
                                                <div className="space-y-4">
                                                    {(item.details?.individuals || []).map((ind: any, i: number) => (
                                                        <div key={i} className="text-xs space-y-0.5 pb-2 border-b border-gray-300 last:border-b-0">
                                                            <div className="grid grid-cols-[60px_1fr]">
                                                                <span className="font-bold text-gray-900">Army no.:</span>
                                                                <span className="text-gray-900">{ind.armyNo || "-"}</span>
                                                            </div>
                                                            <div className="grid grid-cols-[60px_1fr]">
                                                                <span className="font-bold text-gray-900">Rank:</span>
                                                                <span className="text-gray-900">{ind.rank || "-"}</span>
                                                            </div>
                                                            <div className="grid grid-cols-[60px_1fr]">
                                                                <span className="font-bold text-gray-900">Name:</span>
                                                                <span className="text-gray-900">{ind.name || "-"}</span>
                                                            </div>
                                                            <div className="grid grid-cols-[60px_1fr]">
                                                                <span className="font-bold text-gray-900">Unit:</span>
                                                                <span className="text-gray-900">{ind.unit || "-"}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-0 align-top border-r border-gray-300 text-gray-900">
                                                <div className="flex flex-col text-xs divide-y divide-gray-300">
                                                    {item.details?.briefOfDuty && (
                                                        <div className="p-3">
                                                            <div className="font-bold text-gray-900 mb-1">Brief of Duty</div>
                                                            <p className="text-gray-800">{item.details.briefOfDuty}</p>
                                                        </div>
                                                    )}
                                                    {item.details?.offenceOccurred && (
                                                        <>
                                                            <div className="flex items-center gap-2 p-3">
                                                                <div className="font-bold text-gray-900">Report No.</div>
                                                                <div className="text-blue-500 font-medium cursor-pointer hover:underline">{item.details.reportNo}</div>
                                                            </div>

                                                            <div className="p-3">
                                                                <div className="font-bold text-gray-900">Place of Offence:</div>
                                                                <div className="text-gray-800">{item.details.placeOfOffence}</div>
                                                            </div>

                                                            <div className="p-3">
                                                                <div className="font-bold text-gray-900">Offence Type:</div>
                                                                <div className="text-gray-800">{item.details.offenceType}</div>
                                                            </div>

                                                            {(() => {
                                                                const offender = item.offender || {};
                                                                const details = offender.offenderDetails || item.details?.offenderDetails || {};
                                                                const category = offender.offenderType || offender.category || item.details?.offenderCategory;

                                                                if (!category) return null;

                                                                const content = (() => {
                                                                    if (category === 'militaryPersonnel') {
                                                                        // Check if any military personnel fields exist
                                                                        const hasData = details.armyNo || details.rank || details.name || details.unit;
                                                                        if (!hasData) return null;

                                                                        return (
                                                                            <>
                                                                                {details.armyNo && <>
                                                                                    <span className="text-gray-900">Army No. -</span><span>{details.armyNo || "-"}</span>
                                                                                </>}
                                                                                {details.rank && <>
                                                                                    <span className="text-gray-900">Rank -</span><span>{details.rank || "-"}</span>
                                                                                </>}
                                                                                {details.name && <>
                                                                                    <span className="text-gray-900">Name -</span><span>{details.name || "-"}</span>
                                                                                </>}
                                                                                {details.unit && <>
                                                                                    <span className="text-gray-900">Unit -</span><span>{details.unit || "-"}</span>
                                                                                </>}
                                                                            </>
                                                                        );
                                                                    } else if (category === 'civilian') {
                                                                        // Check if any civilian fields exist
                                                                        const hasData = details.civilianAadharCardNumber || details.civilianName || details.civilianFathersName || details.isDependent;
                                                                        if (!hasData) return null;

                                                                        return (
                                                                            <>
                                                                                {details.civilianAadharCardNumber && <><span className="text-gray-900">Aadhar No. -</span><span>{details.civilianAadharCardNumber || "-"}</span></>}
                                                                                {details.civilianName && <><span className="text-gray-900">Name -</span><span>{details.civilianName || "-"}</span></>}
                                                                                {details.civilianFathersName && <><span className="text-gray-900">S/O Name -</span><span>{details.civilianFathersName || "-"}</span></>}
                                                                                {details.isDependent && (
                                                                                    <>
                                                                                        <span className="text-gray-900 font-semibold col-span-2 pt-2 pb-1">Relative Details:</span>
                                                                                        {details.relationName && <><span className="text-gray-900">Relation -</span><span>{details.relationName || "-"}</span></>}
                                                                                        {details.relativeCategory === "militaryPersonnel" && (
                                                                                            <>
                                                                                                {details.relativeDetails?.armyNo && <><span className="text-gray-900">Army No. -</span><span>{details.relativeDetails?.armyNo || "-"}</span></>}
                                                                                                {details.relativeDetails?.rank && <><span className="text-gray-900">Rank -</span><span>{details.relativeDetails?.rank || "-"}</span></>}
                                                                                                {details.relativeDetails?.unit && <><span className="text-gray-900">Unit -</span><span>{details.relativeDetails?.unit || "-"}</span></>}
                                                                                            </>
                                                                                        )}
                                                                                        {details.relativeCategory === "servantMaid" && (
                                                                                            <>
                                                                                                {details.relativeDetails?.maidName && <><span className="text-gray-900">Name -</span><span>{details.relativeDetails?.maidName || "-"}</span></>}
                                                                                                {details.relativeDetails?.maidPassID && <><span className="text-gray-900">Pass ID -</span><span>{details.relativeDetails?.maidPassID || "-"}</span></>}
                                                                                                {details.relativeDetails?.officersEnclaveRank && <><span className="text-gray-900">C/O Rank -</span><span>{details.relativeDetails?.officersEnclaveRank || "-"}</span></>}
                                                                                                {details.relativeDetails?.officersEnclaveName && <><span className="text-gray-900">C/O Name -</span><span>{details.relativeDetails?.officersEnclaveName || "-"}</span></>}
                                                                                                {details.relativeDetails?.officersEnclaveUnit && <><span className="text-gray-900">Unit -</span><span>{details.relativeDetails?.officersEnclaveUnit || "-"}</span></>}
                                                                                            </>
                                                                                        )}

                                                                                        {
                                                                                            details.relativeCategory === "shopKeeper" && (
                                                                                                <>
                                                                                                    {details.relativeDetails?.shopOwnerName && <><span className="text-gray-900">Name -</span><span>{details.relativeDetails?.shopOwnerName || "-"}</span></>}
                                                                                                    {details.relativeDetails?.shopName && <><span className="text-gray-900">Shop Name -</span><span>{details.relativeDetails?.shopName || "-"}</span></>}
                                                                                                    {details.relativeDetails?.shopPassNo && <><span className="text-gray-900">Pass No. -</span><span>{details.relativeDetails?.shopPassNo || "-"}</span></>}
                                                                                                    {details.relativeDetails?.shopAddress && <><span className="text-gray-900">Shop Address -</span><span>{details.relativeDetails?.shopAddress || "-"}</span></>}
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                        {
                                                                                            details.relativeCategory === "tempHiredWorker" && (
                                                                                                <>
                                                                                                    {details.relativeDetails?.tempWorkerName && <><span className="text-gray-900">Name -</span><span>{details.relativeDetails?.tempWorkerName || "-"}</span></>}
                                                                                                    {details.relativeDetails?.tempWorkerPassNo && <><span className="text-gray-900">Pass No. -</span><span>{details.relativeDetails?.tempWorkerPassNo || "-"}</span></>}
                                                                                                    {details.relativeDetails?.tempWorkerPlaceOfStay && <><span className="text-gray-900">Place Of Stay -</span><span>{details.relativeDetails?.tempWorkerPlaceOfStay || "-"}</span></>}
                                                                                                    {details.relativeDetails?.tempWorkerPlaceOfWork && <><span className="text-gray-900">Place Of Work -</span><span>{details.relativeDetails?.tempWorkerPlaceOfWork || "-"}</span></>}
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    </>
                                                                                )}
                                                                            </>
                                                                        );
                                                                    } else if (category === "employee") {
                                                                        const hasData = details.employeeServiceNumber || details.employeeRank || details.employeeName || details.employeeUnit;
                                                                        if (!hasData) return null;

                                                                        return (
                                                                            <>
                                                                                {details.employeeServiceNumber && <><span className="text-gray-900">Service No. -</span><span>{details.employeeServiceNumber || "-"}</span></>}
                                                                                {details.employeeRank && <><span className="text-gray-900">Rank -</span><span>{details.employeeRank || "-"}</span></>}
                                                                                {details.employeeName && <><span className="text-gray-900">Name -</span><span>{details.employeeName || "-"}</span></>}
                                                                                {details.employeeUnit && <><span className="text-gray-900">Unit -</span><span>{details.employeeUnit || "-"}</span></>}
                                                                            </>
                                                                        )
                                                                    } else if (category === "servantMaid") {
                                                                        const coRank = details.officersEnclave?.officersEnclaveRank || "-";
                                                                        const coName = details.officersEnclave?.officersEnclaveName || "-";

                                                                        const hasData = details.maidName || details.maidPassID || details.maidFathersName || (coRank !== "-" && coRank !== "") || (coName !== "-" && coName !== "");
                                                                        if (!hasData) return null;

                                                                        return (
                                                                            <>
                                                                                {details.maidName && <><span className="text-gray-900">Name -</span><span>{details.maidName || "-"}</span></>}

                                                                                {details.maidPassID && <><span className="text-gray-900">Pass ID,No. -</span><span>{details.maidPassID || "-"}</span></>}
                                                                                {details.maidFathersName && <><span className="text-gray-900">S/O Name -</span><span>{details.maidFathersName || "-"}</span></>}


                                                                                {(coRank !== "-" || coName !== "-") && (
                                                                                    <>
                                                                                        {coRank !== "-" && <><span className="text-gray-900">C/O Rank -</span><span>{coRank}</span></>}
                                                                                        {coName !== "-" && <><span className="text-gray-900">MP Name -</span><span>{coName}</span></>}


                                                                                    </>
                                                                                )}
                                                                            </>
                                                                        )
                                                                    } else if (category === "shopKeeper") {
                                                                        const hasData = details.shopOwnerName || details.shopName || details.shopPassNo || details.shopAddress;
                                                                        if (!hasData) return null;

                                                                        return (
                                                                            <>
                                                                                {details.shopOwnerName && <><span className="text-gray-900">Name -</span><span>{details.shopOwnerName || "-"}</span></>}
                                                                                {details.shopName && <><span className="text-gray-900">Shop Name -</span><span>{details.shopName || "-"}</span></>}
                                                                                {details.shopPassNo && <><span className="text-gray-900">Pass No. -</span><span>{details.shopPassNo || "-"}</span></>}
                                                                                {details.shopAddress && <><span className="text-gray-900">Shop Address -</span><span>{details.shopAddress || "-"}</span></>}
                                                                            </>
                                                                        )
                                                                    } else if (category === "tempHiredWorker") {
                                                                        const hasData = details.tempWorkerName || details.tempWorkerPassNo || details.tempWorkerPlaceOfStay || details.tempWorkerPlaceOfWork;
                                                                        if (!hasData) return null;

                                                                        return (
                                                                            <>
                                                                                {details.tempWorkerName && <><span className="text-gray-900">Name -</span><span>{details.tempWorkerName || "-"}</span></>}
                                                                                {details.tempWorkerPassNo && <><span className="text-gray-900">Pass No. -</span><span>{details.tempWorkerPassNo || "-"}</span></>}
                                                                                {details.tempWorkerPlaceOfStay && <><span className="text-gray-900">Place Of Stay -</span><span>{details.tempWorkerPlaceOfStay || "-"}</span></>}
                                                                                {details.tempWorkerPlaceOfWork && <><span className="text-gray-900">Place Of Work -</span><span>{details.tempWorkerPlaceOfWork || "-"}</span></>}
                                                                            </>
                                                                        )
                                                                    }
                                                                })();

                                                                if (!content) return null;

                                                                return (
                                                                    <div className="p-3">
                                                                        <div className="font-bold text-gray-900 mb-2 pb-1">Particulars of Offender / Victims:</div>
                                                                        <div className="grid grid-cols-[110px_1fr] gap-x-2 gap-y-1">
                                                                            {content}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}

                                                            <div className="p-3">
                                                                <div className="font-bold text-gray-900 mb-1">Occurrence Brief:</div>
                                                                <p className="text-gray-800">{item.details.occurrenceBrief}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-center text-gray-900">
                                                {item.authentication?.initialsMPCPNCO || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-center text-gray-900">
                                                {item.authentication?.initialsQMSJCO || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-center text-gray-900">
                                                {item.authentication?.initials2IC || "-"}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4 align-top text-center sticky right-0 z-30 bg-white border-l border-gray-300 group-hover:bg-gray-50">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4 text-gray-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => onEdit(item)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-[#0A0A0A]" onClick={() => handleDeleteClick(item._id)}>
                                                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                                            <span className="text-red-500">Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={12} className="px-4 py-12 text-center text-gray-500">
                                        No records found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Entry"
                message="Are you sure you want to delete this entry? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
            />
        </div>
    );
};

export default GeneralDutyDiaryTable;
