import { useForm } from "@/context/FormContext";
import { LeftStepper } from "./LeftStepper";
import { RightPanel } from "./RightPanel";
import { useCreateTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { toast } from "react-toastify";
import Step1Particulars from "./steps/Step1Particulars";
import Step2Statement from "./steps/Step2Statement";
import Step3Offence from "./steps/Step3Offence";
import Step4Remarks from "./steps/Step4Remarks";
import { useCreateOffender } from "@/features/offender/Hooks";
import { useCreateOnDutyWitnessingMp } from "@/features/MpWitnessing/hooks";

export default function MultiStepForm() {
  const { state, dispatch } = useForm();

  const { mutateAsync } = useCreateTrafficOffence();
  const { mutateAsync: createOffenderMutate } = useCreateOffender();
  const { mutateAsync: createWitnessMutate } = useCreateOnDutyWitnessingMp();

  const steps = [
    { id: 1, label: "Particulars", icon: "1" },
    { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
    { id: 3, label: "Offence Committed\n/Orders Contravened", icon: "3" },
    { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
  ];

  // ===================== FINAL SUBMIT =====================
  const onSubmitFinal = async () => {
    const traffic = state.formData.traffic;

    const date = traffic.onDutyDetails.dateOfDuty;

    // SAFE DATE → ISO CONVERTER
    const toISO = (time: string) => {
      if (!date || !time) return undefined; // ❗ important
      return new Date(`${date}T${time}`).toISOString();
    };

    const payload = {
      isVehicleInvolved: traffic.vehicleInvolved === "yes",

      onDutyDetails: {
        ...traffic.onDutyDetails,
        startTime: toISO(traffic.onDutyDetails.startTime),
        endTime: toISO(traffic.onDutyDetails.endTime),
      },

      onDutyDetailsMPReporting: traffic.onDutyDetailsMPReporting,

      offenceOccurenceDetails: {
        ...traffic.offenceOccurenceDetails,
        timeOfOffence: toISO(traffic.offenceOccurenceDetails.timeOfOffence),

        //  empty string backend ko pasand nahi, undefined bhejo
        incidentLocation:
          traffic.offenceOccurenceDetails.incidentLocation?.trim() || undefined,
      },

      offenceTypes: traffic.offenceTypes,
      offenceTypeReference: traffic.offenceCode,
    };

    try {
      toast.info("Creating Offence...");

      const offence = await mutateAsync(payload);
      toast.success("Offence Created Successfully!");

      const offenceId = offence?._id;
      if (!offenceId) {
        toast.error("Offence ID missing!");
        return;
      }

      const offenderType =
        traffic.vehicleInvolved === "yes"
          ? traffic?.vehicleDetails?.driverType
          : traffic?.offenderWithoutVehicle?.offenderType;

      const offenderPayload = {
        offenceId,
        offenderType: offenderType as any,
        offenderDetails:
          traffic.offenderPeople && traffic.offenderPeople.length > 0
            ? traffic.offenderPeople
            : [],
      };

      console.log("👮 TRAFFIC OFFENDER PAYLOAD ===>", offenderPayload);


      await createOffenderMutate(offenderPayload);
      toast.success("Offender Created Successfully!");

      // ================== WITNESS ==================
      if (traffic.witnesses?.length > 0) {
        await Promise.all(
          traffic.witnesses.map((w) =>
            createWitnessMutate({
              offenceId,
              rank: w.reportingBlock.rank,
              unit: w.reportingBlock.unit,
              ArmyNo: w.reportingBlock.armyNumber,
              name: w.reportingBlock.nameReportingMP,
            })
          )
        );

        toast.success("All Witnesses Saved Successfully!");
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

  // ================== STEP CONFIG ==================
  const stepsConfig = {
    1: {
      title: "1. PARTICULARS:",
     component: (
  <Step1Particulars
    value={state.formData.traffic.vehicleInvolved}
    onChange={(v: string) =>
      dispatch({
        type: "SET_PATH",
        path: "formData.traffic.vehicleInvolved",
        value: v,
      })
    }
  />
),

    },

    2: {
      title: "2. STATEMENT OF EVIDENCE / OCCURRENCE:",
      component: <Step2Statement />,
    },

    3: {
      title: "3. OFFENCE COMMITTED / ORDERS CONTRAVENED:",
      component: <Step3Offence />,
    },

    4: {
      title: "4. REMARKS OF CO/2IC PROVOST UNIT:",
      component: <Step4Remarks />,
    },
  };

  return (
    <div className="h-[calc(100vh-40px)] bg-gray-100 w-full px-6">
      <div className="w-full bg-white rounded-lg overflow-hidden h-full">
        <div className="flex h-full">
          <LeftStepper
            steps={steps}
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            title="Create New General & Traffic Offence Record"
            reportNo="PRO/21 CPU/00042/106/25"
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(data) =>
              dispatch({ type: "SET_FORM_DATA", payload: data })
            }
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onSubmitFinal={onSubmitFinal} // <<=== IMPORTANT!!!
            stepsConfig={stepsConfig}
            mode="traffic"
          />
        </div>
      </div>
    </div>
  );
}
