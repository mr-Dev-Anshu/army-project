import { useForm } from "@/context/FormContext";
import { LeftStepper } from "./LeftStepper";
import { RightPanel } from "./RightPanel";
import { useCreateTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { createOffender } from "@/apis/offender/create";

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

  const toISO = (time: string) =>
    time ? `${date}T${time}:00.000Z` : "";

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
    
    // 1️⃣ WAIT HERE
    const offence = await mutateAsync(payload);

    console.log("✅ OFFENCE CREATED ===>", offence);

    const offenceId = offence?._id;
    if (!offenceId) {
      console.log("❌ offenceId missing, aborting offender creation");
      return;
    }

    console.log("🆔 USING OFFENCE ID ===>", offenceId);

    // 2️⃣ CREATE OFFENDER
    const offenderPayload = {
      offenceId,
      offenderType: state.formData.vehicleDetails.driverType || "Civilian",

      offenderDetails: {
        name: state.formData.offenderDetails?.["Full Name"] || "",
        fatherNameOrHusbandName:
          state.formData.offenderDetails?.["Father Name"] || "",
        address: state.formData.offenderDetails?.["Address"] || "",
        aadharNumber:
          state.formData.offenderDetails?.["ID Proof"] || "",
      },
    };

    console.log("📤 Sending Offender Payload ===>", offenderPayload);

    const offenderRes = await createOffender(offenderPayload);

    console.log("🎯 OFFENDER CREATED ===>", offenderRes);

  } catch (err: any) {
    console.log("❌ FINAL ERROR ===>", err?.response?.data || err);
  }
};

  //  const onSubmitFinal = () => {
  //   const date = state.formData.onDutyDetails.dateOfDuty;

  //   // Helper — convert "HH:MM" → ISO
  //   const toISO = (time: string) =>
  //     time ? `${date}T${time}:00.000Z` : "";

  //   const payload = {
  //     isVehicleInvolved: state.formData.vehicleInvolved === "yes",

  //     onDutyDetails: {
  //       ...state.formData.onDutyDetails,
  //       startTime: toISO(state.formData.onDutyDetails.startTime),
  //       endTime: toISO(state.formData.onDutyDetails.endTime),
  //     },

  //     onDutyDetailsMPReporting: {
  //       ...state.formData.onDutyDetailsMPReporting,
  //     },

  //     offenceOccurenceDetails: {
  //       ...state.formData.offenceOccurenceDetails,
  //       timeOfOffence: toISO(
  //         state.formData.offenceOccurenceDetails.timeOfOffence
  //       ),
  //     },

  //     offenceTypes: state.formData.offenceTypes,
  //     offenceTypeReference: state.formData.offenceCode,
  //   };

  //   console.log("FINAL SUBMIT PAYLOAD ===>", payload);

  //   mutate(payload, {
  //     onSuccess: (res: any) => {
  //       console.log("✅ API SUCCESS ===>", res);
  //       console.log("🆔 Created ID ===>", res?._id);
  //     },

  //     onError: (err: any) => {
  //       console.log("❌ API ERROR ===>", err?.response?.data);
  //       console.log("❌ STATUS ===>", err?.response?.status);
  //       console.log("❌ FULL ERROR ===>", err);
  //     },
  //   });
  // };

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 p-6">
      <div className="max-w-full mx-auto bg-white rounded-lg overflow-hidden h-full">
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
