

"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye } from "lucide-react";
import { CiEraser } from "react-icons/ci";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useForm } from "@/context/FormContext";

import MilitaryPoliceReport from "@/components/reports/MilitaryPoliceReport";
import StaticSpeedReport from "@/components/reports/StaticSpeedReport";
import MpOccurrenceReport from "@/components/reports/MpOccurrenceReport";

export const RightPanel = ({
  step,
  formData,
  onNext,
  onPrev,
  stepsConfig,
  mode,
  mapTrafficToReport,
  mapMpToReport
}: any) => {
  const { state, dispatch } = useForm();

  const current = stepsConfig?.[String(step)];
  const totalSteps = Object.keys(stepsConfig || {}).length;
  const isLastStep = step === totalSteps;

  /* ================= NEXT DISABLE LOGIC ================= */
  const isNextDisabled = () => {
    if (mode === "static" && step === 1)
      return !(
        formData.staticSpeed?.vehicleDetails?.vehicleType &&
        formData.staticSpeed?.vehicleDetails?.category
      );

    if (mode === "traffic" && step === 1)
      return !formData.traffic?.vehicleInvolved;

    return false;
  };

 /* ================= CLEAR BUTTON ================= */
const clearForm = () => {
  if (mode === "traffic") {
    dispatch({
      type: "SET_PATH",
      path: "formData.traffic",
      value: {
        vehicleInvolved: "",
        vehicleDetails: {
          category: "",
          vehicleType: "",
          driverType: "",
          vehicleName: "",
          vehicleNumber: "",
        },
        offenderWithoutVehicle: {
          offenderType: "",
          military: {
            armyNumber: "",
            rank: "",
            name: "",
            unit: "",
            fmn: "",
            command: "",
            address: "",
            iCardNumber: "",
          },
        },
        offenderDetails: {},
        onDutyDetails: {
          dateOfDuty: "",
          startTime: "",
          endTime: "",
          dutyLocation: "",
          dutyType: "",
        },
        onDutyDetailsMPReporting: {
          nameReportingMP: "",
          rank: "",
          unit: "",
          armyNumber: "",
          contactNumber: "",
        },
        offenceOccurenceDetails: {
          timeOfOffence: "",
          incidentLocation: "",
          description: "",
          time: "",
        },
        offenceTypes: [],
        offenceCode: [],
        witnesses: [],
        selectedWitness: null,
        offenderPeople: [],
        remarks: "",
      },
    });
  }

  else if (mode === "static") {
    dispatch({
      type: "SET_PATH",
      path: "formData.staticSpeed",
      value: {
        vehicleInvolved: "",
        vehicleDetails: {
          category: "",
          vehicleType: "",
          driverType: "",
          vehicleNumber: "",
          vehicleName: "",
        },
        dutyBlock: {
          dateOfDuty: "",
          startTime: "",
          endTime: "",
          dutyLocation: "",
          dutyType: "",
        },
        reportingBlock: {
          nameReportingMP: "",
          rank: "",
          unit: "",
          armyNumber: "",
          contactNumber: "",
        },
        offenceBlock: {
          timeOfOffence: "",
          time: "",
          incidentLocation: "",
          description: "",
          authSpeed: "30",
          actualSpeedNoted: "",
          overSpeedCalculated: "",
        },
        witnesses: [],
        selectedWitness: null,
        offenderDetails: {},
        offenderPeople: [],
      },
    });
  }

  else if (mode === "mp") {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport",
      value: {
        reportDetails: {
          reportNo: "",
          command: "",
          firNo: "",
          firFile: null,
        },
        mpParticulars: {
          armyNo: "",
          rank: "",
          name: "",
          unit: "",
          fmn: "",
          command: "",
          address: "",
          icard: "",
        },
        occurrenceDetails: {
          offenceType: "",
          place: "",
          date: "",
          time: "",
          description: "",
        },
        individualDetails: {
          vehicleInvolved: "",
          vehicleData: {},
          driverType: "",
          offenderList: [],
          tempOffender: {},
        },
        witnesses: [],
        witnessVehicleStatus: "",
        evidence: {
          attachEvidence: null,
          eyeSketch: null,
          photos: [],
          videos: [],
        },
        documents: [],
        additionalIndividual: {
          vehicleInvolved: "",
          vehicleData: {},
          driverType: "",
          tempOffender: {},
        },
        detailedReport: "",
        investigationPoints: "",
        opinion: "",
        remarks: {
          analysis: "",
          recommendation: "",
        },
      },
    });
  }
};


  /* ================= PREVIEW COMPONENT ================= */
  const renderPreviewReport = () => {
    if (mode === "traffic") {
      return (
        <MilitaryPoliceReport
          {...mapTrafficToReport(state.formData.traffic)}
        />
      );
    }

    if (mode === "static") {
      return (
        <StaticSpeedReport
          {...mapTrafficToReport(state.formData.staticSpeed)}
        />
      );
    }
      if (mode === "mp") {
    return (
      <MpOccurrenceReport
        {...mapMpToReport(state.formData.mpReport)}
      />
    );
  }

    return <p>No Preview Available</p>;
  };

  return (
    <div className="flex-1 h-full p-3 sm:p-5 lg:p-8 flex flex-col w-full overflow-hidden">
      <div className="border rounded-lg w-full h-full flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between px-4 py-3 border-b bg-white">
          <h3 className="font-bold text-lg">{current?.title || "Step"}</h3>

          {!state.preview && (
            <div className="flex gap-2">
              {/* CLEAR */}
              <Button
                size="sm"
                className="text-xs bg-gray-100 cursor-pointer text-black"
                onClick={clearForm}
              >
                <CiEraser size={16} /> Clear Form
              </Button>

              {/* PREVIEW */}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch({ type: "SET_PREVIEW", payload: true })
                }
                className="bg-black text-white"
              >
                <Eye/>
              </Button>
            </div>
          )}
        </div>

        {/* ================= BODY ================= */}
        <div className="flex-1 overflow-y-auto px-4 py-4">

          {/* ==== FORM MODE ==== */}
          {!state.preview && (current?.component || <p>Step Coming…</p>)}

          {/* ==== PREVIEW MODE ==== */}
          {state.preview && (
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-between mb-3">
                <h2 className="text-xl font-bold">REPORT PREVIEW</h2>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.print()}>
                    🖨 Print
                  </Button>

                  <Button
                    size="sm"
                    className="bg-black text-white"
                    onClick={() =>
                      dispatch({ type: "SET_PREVIEW", payload: false })
                    }
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="border bg-white shadow-lg rounded-md p-4">
                {renderPreviewReport()}
              </div>
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        {!state.preview && (
          <div className="border-t px-4 py-3 bg-white flex justify-between gap-2">
            {/* BACK */}
            <Button
              className="bg-black text-white"
              disabled={step === 1}
              onClick={onPrev}
            >
              <FaArrowLeftLong className="mr-2" />
              Back
            </Button>

            {/* NOT LAST STEP */}
            {!isLastStep && (
              <Button
                onClick={onNext}
                disabled={isNextDisabled()}
                className="bg-blue-500 text-white"
              >
                Save & Next
                <ChevronRight className="ml-2" />
              </Button>
            )}

            {/* LAST STEP → OPEN PREVIEW */}
            {isLastStep && (
              <Button
                className="bg-blue-500 text-white"
                onClick={() => dispatch({ type: "SET_PREVIEW", payload: true })}
              >
                Preview Report
                <ChevronRight className="ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
