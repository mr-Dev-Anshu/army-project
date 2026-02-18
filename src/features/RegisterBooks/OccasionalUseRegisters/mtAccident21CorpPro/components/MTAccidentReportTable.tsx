import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { MoreVertical, Edit, Trash2, CarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import ReportFilterBar, {
  FilterState,
} from "@/components/common/ReportFilterBar";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useMTAccidentReport } from "../hooks/useMTAccidentReport";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface MTAccidentReportTableProps {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onAddNew?: () => void;
}

const MTAccidentReportTable = ({
  data,
  onEdit,
  onDelete,
  onAddNew,
}: MTAccidentReportTableProps) => {
  const { updateReport, isUpdating } = useMTAccidentReport();
  console.log("Rendering MTAccidentReportTable with data:", data);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    date: "",
    fromDate: "",
    toDate: "",
    unit: "",
    fmn: "",
    sortOrder: "asc",
  });

  const [actionRemark, setActionRemark] = useState("");
  const [remarkError, setRemarkError] = useState("");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    recordId: string | null;
    type: "status" | "delete";
    newStatus?: string;
  }>({
    isOpen: false,
    recordId: null,
    type: "status",
  });

  const handleStatusClick = (recordId: string, currentStatus: string) => {
    setActionRemark("");
    setRemarkError("");
    setModalState({
      isOpen: true,
      recordId,
      type: "status",
      newStatus: currentStatus === "taken" ? "pending" : "taken",
    });
  };

  const handleDeleteClick = (id: string) => {
    setModalState({
      isOpen: true,
      recordId: id,
      type: "delete",
    });
  };

  const handleInitialToggle = async (record: any, field: string) => {
    try {
      const currentAuth = record.authentication || {};
      const isAdding = !currentAuth[field];

      // Explicitly construct the object to avoid issues with extra fields like _id, and ensure all fields are present
      const newAuth = {
        initialsOfMPCRNCO: currentAuth.initialsOfMPCRNCO || false,
        initialsOfSMSJCO: currentAuth.initialsOfSMSJCO || false,
        initialsOf2IC: currentAuth.initialsOf2IC || false,
        [field]: isAdding, // Toggle the specific field
      };

      await updateReport({
        id: record._id,
        data: {
          authentication: newAuth,
        } as any,
        suppressToast: true,
      });

      if (isAdding) {
        toast.success("Sign added.");
      } else {
        toast.success("Sign removed.");
      }
    } catch (error) {
      console.error("Failed to update initial", error);
      toast.error("Failed to update sign");
    }
  };

  const handleConfirm = async () => {
    if (!modalState.recordId) return;

    try {
      if (modalState.type === "status") {
        if (!actionRemark.trim()) {
          setRemarkError("Action remark is required.");
          toast.error("Please add action remark");
          return;
        }

        await updateReport({
          id: modalState.recordId,
          data: {
            actionStatus: modalState.newStatus as any, // casting as any to avoid strict type issues if interface mismatch
            actionStatusRemark: actionRemark,
          },
        });
        // Success toast handled in hook
      } else if (modalState.type === "delete") {
        onDelete(modalState.recordId);
        // Modal closing handled below
      }

      setModalState((prev) => ({ ...prev, isOpen: false, recordId: null }));
      setActionRemark("");
      setRemarkError("");
    } catch (error) {
      console.error(error);
      // Error toast handled in hook or here
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getUnitFmn = (individuals: any[]) => {
    const main = individuals?.[0];
    if (!main) return { unit: "-", fmn: "-" };

    const d = main.individualDetails || {};
    const type = main.individualType;

    let unit = "-";
    let fmn = "-";

    if (type === "militaryPersonnel") {
      unit = d.unit || "-";
      fmn = d.fmn || "-";
    }

    if (type === "employee") {
      unit = d.unit || "-";
      fmn = d.fmn || "-";
    }

    return { unit, fmn };
  };

  const uniqueUnits = useMemo(() => {
    const units = new Set<string>();
    data.forEach((item) => {
      const { unit } = getUnitFmn(item.individuals);
      if (unit && unit !== "-") units.add(unit);
    });
    return Array.from(units);
  }, [data]);

  const uniqueFmns = useMemo(() => {
    const fmns = new Set<string>();
    data.forEach((item) => {
      const { fmn } = getUnitFmn(item.individuals);
      if (fmn && fmn !== "-") fmns.add(fmn);
    });
    return Array.from(fmns);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        (item.individualDetails?.individualType?.toLowerCase() || "").includes(
          searchTerm,
        ) ||
        (item.accidentDetails?.placeOfAccident?.toLowerCase() || "").includes(
          searchTerm,
        ) ||
        (item.vehicleDetails?.vehicleNumber?.toLowerCase() || "").includes(
          searchTerm,
        );

      let matchesDate = true;
      if (filters.date) {
        matchesDate =
          item.accidentDetails?.accidentDate &&
          item.accidentDetails.accidentDate.startsWith(filters.date);
      }

      let matchesDateRange = true;
      if (filters.fromDate || filters.toDate) {
        const itemDate = new Date(item.accidentDetails?.accidentDate);
        if (filters.fromDate && new Date(filters.fromDate) > itemDate) {
          matchesDateRange = false;
        }
        if (filters.toDate) {
          const toDate = new Date(filters.toDate);
          toDate.setHours(23, 59, 59, 999);
          if (toDate < itemDate) {
            matchesDateRange = false;
          }
        }
      }

      if (filters.actionStatus && filters.actionStatus !== "All") {
        if (
          (item.actionStatus || "pending").toLowerCase() !==
          filters.actionStatus.toLowerCase()
        ) {
          return false;
        }
      }

      if (filters.unit) {
        const { unit } = getUnitFmn(item.individuals);
        if (!unit.toLowerCase().includes(filters.unit.toLowerCase())) {
          return false;
        }
      }

      if (filters.fmn) {
        const { fmn } = getUnitFmn(item.individuals);
        if (!fmn.toLowerCase().includes(filters.fmn.toLowerCase())) {
          return false;
        }
      }

      return matchesSearch && matchesDate && matchesDateRange;
    });
  }, [data, filters]);

  const dataWithSrNo = filteredData.map((item, index) => ({
    ...item,
    serialNumber: index + 1,
  }));

  const FIELD_CONFIG: Record<string, string[]> = {
    militaryPersonnel: [
      "armyNo",
      "rank",
      "name",
      "unit",
      "fmn",
      "command",
      "address",
      "iCard",
    ],

    civilian: ["name", "fatherName", "address", "iCard"],

    employee: [
      "employeeId",
      "department",
      "placeOfWork",
      "placeOfStay",
      "passNumber",
      "passIssueDate",
      "passExpireDate",
      "address",
    ],

    servantMaid: [
      "passNumber",
      "passId",
      "name",
      "fatherName",
      "trade",
      "quarterNo",
      "officerRank",
      "armyOfficialName",
      "unit",
      "fmn",
      "command",
      "address",
      "iCard",
    ],

    shopKeeper: [
      "ownerName",
      "shopName",
      "shopAddress",
      "unit",
      "passNumber",
      "passIssueDate",
      "passExpireDate",
    ],

    tempHiredWorker: [
      "name",
      "placeOfStay",
      "placeOfWork",
      "workType",
      "passNumber",
      "passIssueDate",
      "passExpireDate",
    ],
  };

  const renderFieldsByType = (type: string, details: any) => {
    if (!details || !FIELD_CONFIG[type]) return null;

    return FIELD_CONFIG[type].map((field) => {
      if (!details[field]) return null;

      const label = field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());

      return (
        <div key={field}>
          <b>{label}:</b> {details[field]}
        </div>
      );
    });
  };


const renderParticulars = (individuals: any[], vehicle?: any) => {
  if (!individuals?.length && !vehicle) return "-";
  console.log(vehicle);

  return (
    <div className="text-xs space-y-3">

      {/* ✅ VEHICLE TOP */}
      {vehicle && (
        <div className="pb-3 border-b border-gray-300 mb-3">
          <div className="font-bold mb-1">Vehicle Details</div>

          <div>
            <b>Vehicle No:</b> {vehicle.vehicleNumber || "-"}
          </div>

          <div>
            <b>Make & Type:</b> {vehicle.vehicleModel || "-"}
          </div>
        </div>
      )}
      {individuals.map((ind, index) => (
        <div
          key={index}
          className={`pb-6 ${
            index !== individuals.length - 1
              ? "mb-6 border-b max-h-[1200px] border-gray-300"
              : ""
          }`}
        >
          <div className="font-bold mb-3 capitalize">
            Individual {index + 1} ({ind.individualType})
          </div>

          {renderFieldsByType(ind.individualType, ind.individualDetails)}
        </div>
      ))}
    </div>
  );
};


 const renderCoPassengers = (individuals: any[]) => {
  if (!individuals?.length) return "-";

  return (
    <div className="text-xs">
      {individuals.map((ind, index) => (
        <div
          key={index}
          className={`pb-6 ${
            index !== individuals.length - 1
              ? "mb-6 border-b border-gray-300"
              : ""
          }`}
        >
          {ind.coDriver && (
            <div className="mb-4">
              <div className="font-bold mb-2 capitalize">
                Co Driver ({ind.coDriver.individualType})
              </div>

              {renderFieldsByType(
                ind.coDriver.individualType,
                ind.coDriver.individualDetails
              )}

              {ind.coDriver.militaryRelative && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="font-semibold mb-2 capitalize">
                    Relative ({ind.coDriver.militaryRelative.relation})
                  </div>

                  {renderFieldsByType(
                    ind.coDriver.militaryRelative.individualType,
                    ind.coDriver.militaryRelative.individualDetails
                  )}
                </div>
              )}
            </div>
          )}

          {ind.passengers?.map((p: any, pIndex: number) => (
            <div key={pIndex} className="mt-4 pt-3 border-t border-gray-200">
              <div className="font-bold mb-2 capitalize">
                Passenger {pIndex + 1} ({p.individualType})
              </div>

              {renderFieldsByType(p.individualType, p.individualDetails)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#F5F5F5] p-1 rounded-full">
            <CarIcon className="text-[#404040]" size="18" />
          </div>
          <h2 className="text-lg font-semibold text-[#404040]">
            MT Accident Register: 21 CORPs PRO
          </h2>
        </div>
        <span className="text-sm font-medium text-[#0A0A0A]">
          {filteredData.length} Reports
        </span>
      </div>

      <ReportFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        showOffenceType={false}
        showActionStatus={true}
        showDate={true}
        showDateRange={true}
        dateRangeLabel="Date range"
        showUnit={true}
        unitOptions={uniqueUnits}
        showFilter={true}
        showFmn={true}
        fmnOptions={uniqueFmns}
        showPlaceOfOffence={false}
        onReset={() =>
          setFilters({
            search: "",
            date: "",
            fromDate: "",
            toDate: "",
            unit: "",
            fmn: "",
            actionStatus: "",
            sortOrder: "asc",
          })
        }
        onAddNew={onAddNew}
        placeholder="Search by report no..."
      />

      <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
        <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-sm text-gray-700 min-w-[1800px]">
            <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
              <tr>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-14 align-top sticky left-0 top-0 z-50 bg-[#F5F5F5]"
                >
                  Sr no.
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 min-w-[200px] align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Particulars of Offender(s), Victim(s) and Vehicles Involved
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Unit
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  FMN
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Date & Time of Accident
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-40 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Place of Accident
                </th>
               
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-[300px] align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Particulars of Co-Driver & Passengers
                </th>

                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Type of Accident
                </th>
                {/* Casualty Header Group */}
                <th
                  colSpan={4}
                  className="px-4 py-2 border-r border-gray-300 align-top text-center border-b sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  No. of Casualty
                </th>

                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-48 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Damage to Vehicle
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-48 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Probable Cause of Accident
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  FIR/MACT. Status
                </th>

                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-40 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Initials of MPCR NCO
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-40 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Initials of SM/SJCO
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-40 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Initials of 2IC
                </th>

                <th
                  rowSpan={2}
                  className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]"
                >
                  Action Status
                </th>
                <th
                  rowSpan={2}
                  className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5]"
                ></th>
              </tr>
              <tr>
                {/* Sub-headers for Casualty */}
                <th className="px-2 py-2 border-r border-gray-300 text-center w-20 sticky top-[37px] z-40 bg-[#F5F5F5]">
                  Injured (Civ)
                </th>
                <th className="px-2 py-2 border-r border-gray-300 text-center w-20 sticky top-[37px] z-40 bg-[#F5F5F5]">
                  Injured (Mil)
                </th>
                <th className="px-2 py-2 border-r border-gray-300 text-center w-20 sticky top-[37px] z-40 bg-[#F5F5F5]">
                  Died (Civ)
                </th>
                <th className="px-2 py-2 border-r border-gray-300 text-center w-20 sticky top-[37px] z-40 bg-[#F5F5F5]">
                  Died (Mil)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {dataWithSrNo.length > 0 ? (
                dataWithSrNo.map((item, index) => {
                  const { unit, fmn } = getUnitFmn(item.individuals);
                  return (
                    <tr
                      key={item._id || index}
                      className="hover:bg-gray-50/50 transition-colors group bg-white"
                    >
                      <td className="px-4 py-4 align-top font-medium text-gray-900 border-r border-gray-300 text-center sticky left-0 z-30 bg-white group-hover:bg-gray-50">
                        {item.serialNumber}
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300">
                        <div>{renderParticulars(item.individuals,item.vehicleDetails)}</div>
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                        {unit}
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                        {fmn}
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {item.accidentDetails?.accidentDate
                              ? format(
                                  new Date(item.accidentDetails.accidentDate),
                                  "dd/MM/yyyy",
                                )
                              : "-"}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {item.accidentDetails?.accidentTime || ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                        {item.accidentDetails?.placeOfAccident || "-"}
                      </td>
                     
                      {/* 🔹 Co Driver & Passengers */}
                      <td className="px-4 py-4 align-top border-r min-w-[300px] border-gray-300">
                        {renderCoPassengers(item.individuals)}
                      </td>

                      {/* 🔹 Type of Accident */}
                      <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A] capitalize">
                        {item.accidentDetails?.accidentType || "-"}
                      </td>

                      {/* Casualty Columns */}
                      <td className="px-2 py-4 align-top border-r border-gray-300 text-center text-[#0A0A0A] tabular-nums">
                        {item.casualtyDetails?.injuredCivil
                          ? String(item.casualtyDetails.injuredCivil).padStart(
                              2,
                              "0",
                            )
                          : "00"}
                      </td>
                      <td className="px-2 py-4 align-top border-r border-gray-300 text-center text-[#0A0A0A] tabular-nums">
                        {item.casualtyDetails?.injuredMilitary
                          ? String(
                              item.casualtyDetails.injuredMilitary,
                            ).padStart(2, "0")
                          : "00"}
                      </td>
                      <td className="px-2 py-4 align-top border-r border-gray-300 text-center text-[#0A0A0A] tabular-nums">
                        {item.casualtyDetails?.diedCivil
                          ? String(item.casualtyDetails.diedCivil).padStart(
                              2,
                              "0",
                            )
                          : "00"}
                      </td>
                      <td className="px-2 py-4 align-top border-r border-gray-300 text-center text-[#0A0A0A] tabular-nums">
                        {item.casualtyDetails?.diedMilitary
                          ? String(item.casualtyDetails.diedMilitary).padStart(
                              2,
                              "0",
                            )
                          : "00"}
                      </td>

                      <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A] text-sm">
                        {/* Placeholder for Damage to Vehicle as we don't have it in schema yet */}
                        {item.damageToVehicle || "-"}
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A] text-sm">
                        {item.accidentDetails?.causeOfAccident || "-"}
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                        {item.firMactDetails?.firMactNumber || "-"}
                      </td>

                      <td className="px-4 py-4 align-top border-r border-gray-300">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={
                              item.authentication?.initialsOfMPCRNCO || false
                            }
                            onCheckedChange={() =>
                              handleInitialToggle(item, "initialsOfMPCRNCO")
                            }
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={
                              item.authentication?.initialsOfSMSJCO || false
                            }
                            onCheckedChange={() =>
                              handleInitialToggle(item, "initialsOfSMSJCO")
                            }
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={
                              item.authentication?.initialsOf2IC || false
                            }
                            onCheckedChange={() =>
                              handleInitialToggle(item, "initialsOf2IC")
                            }
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top border-r border-gray-300">
                        <div
                          className="flex flex-col items-center gap-1 cursor-pointer"
                          title={item.actionStatusRemark || "No remark"}
                          onClick={() =>
                            handleStatusClick(item._id, item.actionStatus)
                          }
                        >
                          <div
                            className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                              item.actionStatus === "taken"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            <div
                              className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                item.actionStatus === "taken"
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            ></div>
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium uppercase">
                            {item.actionStatus === "taken"
                              ? "Taken"
                              : "Pending"}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-4 align-top text-center sticky border-l-2 right-0 z-30 bg-white group-hover:bg-gray-50">
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
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => handleDeleteClick(item._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={15}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
        title={
          modalState.type === "status" ? "Change Action Status" : "Delete Entry"
        }
        message={
          modalState.type === "status"
            ? `Are you sure you want to change the status to ${modalState.newStatus === "taken" ? "Taken" : "Pending"}?`
            : "Are you sure you want to delete this report? This action cannot be undone."
        }
        confirmLabel={modalState.type === "status" ? "Yes, Change" : "Delete"}
        cancelLabel="Cancel"
        variant={modalState.type === "status" ? "info" : "danger"}
        isProcessing={isUpdating}
      >
        {modalState.type === "status" && (
          <div className="flex flex-col gap-2 mt-2">
            <Label htmlFor="remark">
              Action Remark <span className="text-red-500">*</span>
            </Label>
            <Input
              id="remark"
              placeholder="Enter reason for status change..."
              value={actionRemark}
              onChange={(e) => {
                setActionRemark(e.target.value);
                if (e.target.value.trim()) setRemarkError("");
              }}
              className={
                remarkError ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
            {remarkError && (
              <span className="text-xs text-red-500 mt-1">{remarkError}</span>
            )}
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
};

export default MTAccidentReportTable;
