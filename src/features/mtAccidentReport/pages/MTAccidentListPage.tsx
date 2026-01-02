"use client";

import { useReducer, useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useGetMTAccidentReports, useGetMTAccidentReportById } from "../hooks/useMTAccidentReport";
import { useForm } from "@/context/FormContext";
import MTAccidentForm from "../components/MTAccidentForm";
import MTAccidentTable from "../components/MTAccidentTable";
import ReportPageHeader from "@/components/common/ReportPageHeader";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import { ArrowLeft, Loader2 } from "lucide-react";

/* ===== TYPES ===== */
interface PageState {
  showCreate: boolean;
  editId: string | null;
}

type PageAction =
  | { type: "SET_SHOW_CREATE"; payload: boolean }
  | { type: "SET_EDIT_ID"; payload: string | null }
  | { type: "RESET" };

/* ===== REDUCER ===== */
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

export default function MTAccidentListPage() {
  const { data, isLoading } = useGetMTAccidentReports();
  const { state, dispatch: formDispatch } = useForm();
  const [pageState, pageDispatch] = useReducer(pageReducer, initialState);

  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    actionStatus: "All",
    offenceType: "All", // Not used but part of interface
    sortOrder: "desc" as "asc" | "desc",
  });

  // Fetch data when editing
  const { data: editData } = useGetMTAccidentReportById(pageState.editId || "");

  // Load data into form when editData is fetched
  useEffect(() => {
    if (editData && editData._id) {
      formDispatch({
        type: "SET_FORM_DATA",
        payload: {
          ...state.formData,
          mtAccidentReport: editData,
        },
      });
      pageDispatch({ type: "SET_SHOW_CREATE", payload: true });
    }
  }, [editData, formDispatch, state.formData]);

  const handleBack = () => {
    // Reset form
    formDispatch({
      type: "SET_FORM_DATA",
      payload: {
        ...state.formData,
        mtAccidentReport: {
          individualType: "",
          dateOfAccident: "",
          timeOfAccident: "",
          placeOfAccident: "",
          typeOfAccident: "",
          probableCause: "",
          vehicleNumber: "",
          makeAndModel: "",
          injuredCivil: 0,
          injuredMilitary: 0,
          diedCivil: 0,
          diedMilitary: 0,
          firCaseNumber: "",
          firDate: "",
          firPoliceStation: "",
          actionStatus: false,
          remark: "",
          unit: "",
          fmn: "",
          driverType: "",
          driverDetails: {},
          coDriverDetails: {},
          individualDetails: {},
          offenders: [],
        },
      },
    });
    pageDispatch({ type: "RESET" });
  };

  const handleAddNew = () => {
    handleBack(); // Reset first
    pageDispatch({ type: "SET_SHOW_CREATE", payload: true });
  };

  // Process data with filtering and sorting
  const processedData = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

    // Filter by Date
    if (filters.date) {
      filtered = filtered.filter((item) => {
        const itemDate = item.dateOfAccident ? new Date(item.dateOfAccident).toISOString().split('T')[0] : "";
        return itemDate === filters.date;
      });
    }

    // Filter by Action Status
    if (filters.actionStatus !== "All") {
      const isTaken = filters.actionStatus === "Taken";
      filtered = filtered.filter((item) => !!item.actionStatus === isTaken);
    }

    // Search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((item: any) => {
        const reportNo = item.reportNumber?.toLowerCase() || "";
        const vehicleNo = item.vehicleNumber?.toLowerCase() || "";
        const unit = item.individualDetails?.unit?.toLowerCase() || "";
        return reportNo.includes(searchLower) || vehicleNo.includes(searchLower) || unit.includes(searchLower);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.dateOfAccident || 0).getTime();
      const dateB = new Date(b.dateOfAccident || 0).getTime();
      return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [data, filters]);

  if (pageState.showCreate) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Reports
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">
            {pageState.editId ? "Edit MT Accident Report" : "Create New MT Accident Report"}
          </h1>
        </div>
        <div className="flex-1 overflow-hidden p-6 overflow-y-auto">
          <MTAccidentForm onClose={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <ReportPageHeader
        title="MT Accident Register: 21 CORPs PRO"
        reportCount={processedData.length}
        breadcrumbItems={[
          { label: "Reports & Analysis", href: "/" },
          { label: "All Registered Reports", href: "/dashboard/view-reports" }, // Assuming this route
          "MT Accident Register: 21 CORPs PRO"
        ]}
        onDownload={() => console.log("Download")}
      />

      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          MT Accident Register: 21 CORPs PRO
        </h2>
        <span className="text-sm font-bold text-gray-900">
          {processedData.length} Reports
        </span>
      </div>

      <ReportFilterBar
        filters={filters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onAddNew={handleAddNew}
        onReset={() => setFilters({ search: "", date: "", actionStatus: "All", offenceType: "All", sortOrder: "desc" })}
        showOffenceType={false}
        placeholder="Search by report no, unit, offence type..."
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <MTAccidentTable
          data={processedData}
          onEdit={(id) => pageDispatch({ type: "SET_EDIT_ID", payload: id })}
        />
      )}
    </div>
  );
}
