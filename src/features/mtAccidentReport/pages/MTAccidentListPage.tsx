"use client";

import { useReducer, useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  useGetMTAccidentReports,
  useGetMTAccidentReportById,
} from "../hooks/useMTAccidentReport";
import { useForm } from "@/context/FormContext";
import MTAccidentForm from "../components/MTAccidentForm";
import MTAccidentTable from "../components/MTAccidentTable";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import { ArrowLeft, Loader2 } from "lucide-react";

/* ================= TYPES ================= */

interface MTAccidentReport {
  _id: string;
  reportNumber?: string;
  vehicleNumber?: string;
  dateOfAccident?: string;
  firDate?: string;
  individualType?: string;
  individualDetails?: Record<string, any>;
  [key: string]: any;
}

interface PageState {
  showCreate: boolean;
  editId: string | null;
}

type PageAction =
  | { type: "SET_SHOW_CREATE"; payload: boolean }
  | { type: "SET_EDIT_ID"; payload: string | null }
  | { type: "RESET" };

/* ================= REDUCER ================= */

const pageReducer = (state: PageState, action: PageAction): PageState => {
  switch (action.type) {
    case "SET_SHOW_CREATE":
      return { ...state, showCreate: action.payload };
    case "SET_EDIT_ID":
      return { ...state, editId: action.payload };
    case "RESET":
      return { showCreate: false, editId: null };
    default:
      return state;
  }
};

const initialState: PageState = {
  showCreate: false,
  editId: null,
};

/* ================= COMPONENT ================= */

export default function MTAccidentListPage() {
  const reportsQuery = useGetMTAccidentReports();
  const { data, isLoading } = reportsQuery;

  const { state, dispatch: formDispatch } = useForm();
  const [pageState, pageDispatch] = useReducer(pageReducer, initialState);

  /* ================= FILTERS ================= */

  const [filters, setFilters] = useState({
    search: "",
    date: "",
    actionStatus: "All",
    offenceType: "All",
    sortOrder: "desc" as "asc" | "desc",
  });

  /* ================= EDIT QUERY (SAFE) ================= */

  const editQuery = useGetMTAccidentReportById(
    pageState.editId ?? "",
    {
      enabled: Boolean(pageState.editId),
    } as any // ✅ FIX: satisfy TS without breaking hook
  );

  const editData = editQuery.data as MTAccidentReport | undefined;

  /* ================= APPLY EDIT DATA ================= */

  useEffect(() => {
    if (!editData?._id) return;
    if (state.formData.mtAccidentReport?._id === editData._id) return;

    const formatDate = (d?: string) =>
      d ? new Date(d).toISOString().split("T")[0] : "";

    const fixedData: MTAccidentReport = {
      ...editData,
      dateOfAccident: formatDate(editData.dateOfAccident),
      firDate: formatDate(editData.firDate),
      individualDetails: {
        ...editData.individualDetails,
      },
    };

    console.log("🟢 APPLYING EDIT DATA:", fixedData);

    formDispatch({
      type: "SET_FORM_DATA",
      payload: {
        ...state.formData,
        mtAccidentReport: fixedData,
      },
    });
  }, [editData]);

  /* ================= OPEN DRAWER ================= */

  useEffect(() => {
    if (pageState.editId) {
      pageDispatch({ type: "SET_SHOW_CREATE", payload: true });
    }
  }, [pageState.editId]);

  /* ================= HANDLERS ================= */

  const handleBack = () => {
    formDispatch({
      type: "SET_FORM_DATA",
      payload: {
        ...state.formData,
        mtAccidentReport: {},
      },
    });

    pageDispatch({ type: "RESET" });
  };

  const handleAddNew = () => {
    handleBack();
    pageDispatch({ type: "SET_SHOW_CREATE", payload: true });
  };

  /* ================= DATA PROCESS (FIXED TYPE) ================= */

  const processedData: MTAccidentReport[] = useMemo(() => {
    const raw: MTAccidentReport[] = Array.isArray(data)
      ? data
      : (data?.data as MTAccidentReport[]) ?? [];

    if (!filters.search) return raw;

    const q = filters.search.toLowerCase();
    return raw.filter(
      (i) =>
        i.reportNumber?.toLowerCase().includes(q) ||
        i.vehicleNumber?.toLowerCase().includes(q)
    );
  }, [data, filters]);

  /* ================= RENDER ================= */

  return (
    <div className="relative min-h-screen bg-gray-50 p-6">
      <ReportPageHeader
        title="MT Accident Register: 21 CORPs PRO"
        reportCount={processedData.length}
      />

      <ReportFilterBar
        filters={filters}
        onFilterChange={(k, v) =>
          setFilters((p) => ({ ...p, [k]: v }))
        }
        onAddNew={handleAddNew}
        onReset={() =>
          setFilters({
            search: "",
            date: "",
            actionStatus: "All",
            offenceType: "All",
            sortOrder: "desc",
          })
        }
        showOffenceType={false}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <MTAccidentTable
          data={processedData}
          onEdit={(id) => {
            console.log("🟢 EDIT CLICKED:", id);
            pageDispatch({ type: "SET_EDIT_ID", payload: id });
          }}
        />
      )}

      {pageState.showCreate && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/10" />
          <div className="w-full sm:max-w-xl bg-white h-full shadow-2xl overflow-y-auto">
            <div className="border-b px-5 py-3 flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <h1 className="font-semibold text-lg">
                {pageState.editId
                  ? "Edit MT Accident Report"
                  : "Create MT Accident Report"}
              </h1>
            </div>

            <div className="p-6">
              <MTAccidentForm onClose={handleBack} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
