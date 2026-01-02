"use client";

import { useReducer, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetMTAccidentReports, useGetMTAccidentReportById } from "../hooks/useMTAccidentReport";
import { useForm } from "@/context/FormContext";
import MTAccidentForm from "../components/MTAccidentForm";
import MTAccidentTable from "../components/MTAccidentTable";

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
  }, [editData?._id, formDispatch]);

  const handleBack = () => {
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
        },
      },
    });
    pageDispatch({ type: "RESET" });
  };

  const handleAddNew = () => {
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
        },
      },
    });
    pageDispatch({ type: "SET_EDIT_ID", payload: null });
    pageDispatch({ type: "SET_SHOW_CREATE", payload: true });
  };

  if (pageState.showCreate) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          ← Back to List
        </Button>

        <MTAccidentForm onClose={handleBack} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">MT Accident Reports</h1>
        <Button onClick={handleAddNew}>
          Add MT Accident
        </Button>
      </div>

      <MTAccidentTable 
        data={data || []} 
        onEdit={(id) => pageDispatch({ type: "SET_EDIT_ID", payload: id })}
      />
    </div>
  );
}
