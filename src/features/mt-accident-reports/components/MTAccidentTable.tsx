"use client";

import React, { useMemo, useState } from "react";
import { MoreVertical, Eye, Printer, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useUpdateMTAccidentReport,
  useDeleteMTAccidentReport,
} from "../hooks/useMTAccidentReport";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ================= PROPS ================= */

interface MTAccidentTableProps {
  data: any[];
  onView?: (item: any) => void;
  onPrint?: (item: any) => void;

  /** ✅ FULL ITEM FOR EDIT */
  onEdit?: (item: any) => void;
}

/* ================= COMPONENT ================= */

export default function MTAccidentTable({
  data,
  onView,
  onPrint,
  onEdit,
}: MTAccidentTableProps) {
  const { mutateAsync: updateReport, isPending: isUpdating } =
    useUpdateMTAccidentReport();
  const { mutateAsync: deleteReport, isPending: isDeleting } =
    useDeleteMTAccidentReport();

  const [actionRemark, setActionRemark] = useState("");
  const [remarkError, setRemarkError] = useState("");

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    reportId: string | null;
    type: "status" | "delete";
    newStatus?: boolean;
  }>({
    isOpen: false,
    reportId: null,
    type: "delete",
  });

  /* ================= DATA ================= */

  const processedData = useMemo(
    () => data.map((d, i) => ({ ...d, sr: i + 1 })),
    [data]
  );

  /* ================= HANDLERS ================= */

  const openDelete = (id: string) => {
    setModalState({
      isOpen: true,
      reportId: id,
      type: "delete",
    });
  };

  const openStatus = (id: string, current: boolean) => {
    setActionRemark("");
    setRemarkError("");
    setModalState({
      isOpen: true,
      reportId: id,
      type: "status",
      newStatus: !current,
    });
  };

  const handleConfirm = async () => {
    if (!modalState.reportId) return;

    try {
      if (modalState.type === "status") {
        if (!actionRemark.trim()) {
          setRemarkError("Action remark is required");
          return;
        }

        await updateReport({
          id: modalState.reportId,
          data: {
            actionStatus: modalState.newStatus,
            actionStatusRemark: actionRemark,
          },
        });

        toast.success("Action status updated");
      } else {
        await deleteReport(modalState.reportId);
        toast.success("Report deleted");
      }

      setModalState({
        isOpen: false,
        reportId: null,
        type: "delete",
      });
      setActionRemark("");
    } catch {
      toast.error("Operation failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="h-[calc(100vh-260px)] overflow-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        {/* ================= HEADER ================= */}
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th rowSpan={2} className="border px-3 py-2">Sr No.</th>
            <th rowSpan={2} className="border px-3 py-2">Particulars of Individual / Victim</th>
            <th rowSpan={2} className="border px-3 py-2">Unit</th>
            <th rowSpan={2} className="border px-3 py-2">FMN</th>
            <th rowSpan={2} className="border px-3 py-2">Date & Time of Accident</th>
            <th rowSpan={2} className="border px-3 py-2">Place of Accident</th>
            <th rowSpan={2} className="border px-3 py-2">Veh. BA No. / Make & Type</th>
            <th rowSpan={2} className="border px-3 py-2">Type of Accident</th>
            <th colSpan={4} className="border px-3 py-2 text-center">No. of Casualty</th>
            <th rowSpan={2} className="border px-3 py-2">Probable Cause</th>
            <th rowSpan={2} className="border px-3 py-2">FIR / MACT Status</th>
            <th rowSpan={2} className="border px-3 py-2">Report No.</th>
            <th rowSpan={2} className="border px-3 py-2">Action Status</th>
            <th rowSpan={2} className="border px-3 py-2"></th>
          </tr>
          <tr>
            <th className="border px-2">Inj (Civ)</th>
            <th className="border px-2">Inj (Mil)</th>
            <th className="border px-2">Died (Civ)</th>
            <th className="border px-2">Died (Mil)</th>
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody>
          {processedData.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="border px-2 text-center">{item.sr}</td>

              <td className="border px-2 text-xs">
                <div><b>Army:</b> {item.driverArmyNo || "--"}</div>
                <div><b>Rank:</b> {item.driverRank || "--"}</div>
                <div><b>Name:</b> {item.driverName || "--"}</div>
              </td>

              <td className="border px-2">{item.driverUnit || "--"}</td>
              <td className="border px-2">{item.fmn || "--"}</td>

              <td className="border px-2 text-xs">
                <div>{item.date || "--"}</div>
                <div className="text-gray-500">{item.time || "--"}</div>
              </td>

              <td className="border px-2">{item.place || "--"}</td>

              <td className="border px-2 text-xs">
                <div>{item.vehicleNo || "--"}</div>
                <div className="text-gray-500">{item.vehicleMake || "--"}</div>
              </td>

              <td className="border px-2 text-center">{item.typeOfAccident || "--"}</td>

              <td className="border px-2 text-center">{item.casualties?.injuredCivil ?? 0}</td>
              <td className="border px-2 text-center">{item.casualties?.injuredMilitary ?? 0}</td>
              <td className="border px-2 text-center">{item.casualties?.diedCivil ?? 0}</td>
              <td className="border px-2 text-center">{item.casualties?.diedMilitary ?? 0}</td>

              <td className="border px-2">{item.brief || "--"}</td>
              <td className="border px-2">{item.firMactNumber || "--"}</td>
              <td className="border px-2 font-mono">{item.reportNumber || "--"}</td>

              <td
                className="border px-2 text-center cursor-pointer"
                onClick={() => openStatus(item._id, item.actionStatus)}
              >
                {item.actionStatus ? "Taken" : "Pending"}
              </td>

              <td className="border px-2 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(item)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPrint?.(item)}>
                      <Printer className="w-4 h-4 mr-2" /> Print
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(item)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => openDelete(item._id)}
                    >
                      <Trash className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((p) => ({ ...p, isOpen: false }))}
        onConfirm={handleConfirm}
        title={modalState.type === "delete" ? "Delete Report" : "Change Action Status"}
        message="Are you sure?"
        confirmLabel="Confirm"
        isProcessing={isUpdating || isDeleting}
      >
        {modalState.type === "status" && (
          <div className="mt-2">
            <Label>Action Remark *</Label>
            <Input
              value={actionRemark}
              onChange={(e) => {
                setActionRemark(e.target.value);
                if (e.target.value.trim()) setRemarkError("");
              }}
              className={remarkError ? "border-red-500" : ""}
            />
            {remarkError && (
              <p className="text-xs text-red-500">{remarkError}</p>
            )}
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
}
