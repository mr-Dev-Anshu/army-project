import { useForm } from "@/context/FormContext";
import { LeftStepper } from "./LeftStepper";
import { RightPanel } from "./RightPanel";
import { useCreateTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { createOffender } from "@/apis/offender/create";
import { createMpWitenessing } from "@/apis/MpWitenessing/create";
import { toast } from "react-toastify";

export default function MultiStepForm() {
  const { state, dispatch } = useForm();

  const steps = [
    { id: 1, label: "Particulars", icon: "1" },
    { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
    { id: 3, label: "Offence Committed\n/Orders Contravened", icon: "3" },
    { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
  ];

  const { mutateAsync, isPending } = useCreateTrafficOffence();

  const onSubmitFinal = async () => {
    const date = state.formData.onDutyDetails.dateOfDuty;

    const toISO = (time: string) => (time ? `${date}T${time}:00.000Z` : "");

    const payload = {
      isVehicleInvolved: state.formData.vehicleInvolved === "yes",

      onDutyDetails: {
        ...state.formData.onDutyDetails,
        startTime: toISO(state.formData.onDutyDetails.startTime),
        endTime: toISO(state.formData.onDutyDetails.endTime),
      },

      onDutyDetailsMPReporting: state.formData.onDutyDetailsMPReporting,

      offenceOccurenceDetails: {
        ...state.formData.offenceOccurenceDetails,
        timeOfOffence: toISO(
          state.formData.offenceOccurenceDetails.timeOfOffence
        ),
      },

      offenceTypes: state.formData.offenceTypes,
      offenceTypeReference: state.formData.offenceCode,
    };

    try {
      console.log("🚀 Creating offence...");
      toast.info("Creating Offence...");

      const offence = await mutateAsync(payload);

      toast.success("Offence Created Successfully!");
      console.log("✅ OFFENCE CREATED ===>", offence);

      const offenceId = offence?._id;
      if (!offenceId) {
        toast.error("Offence ID missing!");
        return;
      }

      // ================= OFFENDER ==================
      const offenderPayload = {
        offenceId,
        offenderType: state.formData.vehicleDetails.driverType || "Civilian",
        offenderDetails: {
          name: state.formData.offenderDetails?.["Full Name"] || "",
          fatherNameOrHusbandName:
            state.formData.offenderDetails?.["Father Name"] || "",
          address: state.formData.offenderDetails?.["Address"] || "",
          aadharNumber: state.formData.offenderDetails?.["ID Proof"] || "",
        },
      };

      console.log(" Sending Offender Payload ===>", offenderPayload);

      const offenderRes = await createOffender(offenderPayload);

      toast.success("Offender Created Successfully!");
      console.log(" OFFENDER CREATED ===>", offenderRes);

      // ================= WITNESS ==================
      if (state.formData.witnesses?.length > 0) {
        const witnessingPayload = state.formData.witnesses.map((w) => ({
          offenceId,
          rank: w.reportingBlock.rank,
          unit: w.reportingBlock.unit,
          ArmyNo: w.reportingBlock.armyNumber,
          name: w.reportingBlock.nameReportingMP,
        }));

        console.log(" Final Witness Payload ===>", witnessingPayload);

        await Promise.all(witnessingPayload.map((w) => createMpWitenessing(w)));

        toast.success("All Witnesses Saved Successfully!");
        console.log("👮‍♂️ All MP Witness Created Successfully");
      }

      toast.success("🎉 Final Submit Completed Successfully!");
    } catch (err: any) {
      console.log(" FINAL ERROR ===>", err?.response?.data || err);

      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Something went wrong!"
      );
    }
  };

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 -mt-4 w-full px-6">
      <div className=" w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">
          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(data) =>
              dispatch({ type: "SET_FORM_DATA", payload: data })
            }
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onSubmitFinal={onSubmitFinal}
          />
        </div>
      </div>
    </div>
  );
}
