import { useForm as useGlobalForm } from "@/context/FormContext";
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
import { CreateOffenderData, OffenderType } from "@/apis/offender/types";
import { useForm as useRHF, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generalTrafficOffenceSchema,
  GeneralTrafficOffenceFormValues,
} from "@/validators/generalTrafficOffence.schema";

export default function MultiStepForm() {
  const { state, dispatch } = useGlobalForm();

  const methods = useRHF<GeneralTrafficOffenceFormValues>({
    resolver: zodResolver(generalTrafficOffenceSchema),
    defaultValues: state.formData.traffic as any,
    mode: "onChange",
  });

  const { handleSubmit, trigger, watch, setValue } = methods;

  const { mutateAsync } = useCreateTrafficOffence();
  const { mutateAsync: createOffenderMutate } = useCreateOffender();
  const { mutateAsync: createWitnessMutate } = useCreateOnDutyWitnessingMp();

  const steps = [
    { id: 1, label: "Particulars", icon: "1" },
    { id: 2, label: "Statement of Evidence\n/Occurrence", icon: "2" },
    { id: 3, label: "Offence Committed\n/Orders Contravened", icon: "3" },
    { id: 4, label: "Remarks of CO/2IC Provost Unit", icon: "4" },
  ];

  // ===================== STEP VALIDATION =====================
  const handleNext = async () => {
    let isValid = false;
    const currentStep = state.currentStep;
    console.log("Validating Step:", currentStep);
    console.log("Current Values:", methods.getValues());

    if (currentStep === 1) {
      // Validate Vehicle Involved + Details + Driver Details + CoDriver Details
      // We explicitly list fields to avoid validating later steps
      isValid = await trigger([
        "vehicleInvolved",
        "vehicleDetails",
        "driverDetails",
        "coDriverDetails",
        "offenderWithoutVehicle" as any
      ]);
    } else if (currentStep === 2) {
      isValid = await trigger([
        "onDutyDetails",
        "onDutyDetailsMPReporting",
        "witnesses",
        "offenceOccurenceDetails",
      ]);
    } else if (currentStep === 3) {
      isValid = await trigger([
        "offenceTypes",
        "offenceCode",
        "offenceOccurenceDetails.description" as any
      ]);
    } else {
      isValid = true;
    }

    console.log("Step Is Valid?", isValid);

    if (!isValid) {
      console.log("Validation Errors:", methods.formState.errors);
      const errorFields = Object.keys(methods.formState.errors);
      if (errorFields.length > 0) {
        toast.error(`Fix errors in: ${errorFields.join(", ")}`);
      } else {
        toast.error("Please fill all required fields");
      }
    }

    if (isValid) {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  // ===================== FINAL SUBMIT =====================
  const onSubmit = async (data: GeneralTrafficOffenceFormValues) => {
    const traffic = data;

    const date = traffic.onDutyDetails.dateOfDuty;

    // SAFE DATE → ISO CONVERTER
    const toISO = (time: string) => {
      if (!date || !time) return undefined;
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

      // Calculate Offender People from RHF "virtual" fields
      const offenderPeople: any[] = [];

      const vehicleInvolved = traffic.vehicleInvolved === "yes";

      // Driver / Offender Logic (from driverDetails)
      if (traffic.driverDetails) {
        const type = vehicleInvolved
          ? traffic.vehicleDetails?.driverType
          : (traffic as any).offenderWithoutVehicle?.offenderType;

        if (type) {
          offenderPeople.push({
            type: type,
            details: traffic.driverDetails
          });
        }
      }

      // Co-Driver Logic
      if (traffic.coDriverDetails && traffic.coDriverType) {
        offenderPeople.push({
          type: traffic.coDriverType,
          details: traffic.coDriverDetails
        });
      }

      const offenderType = vehicleInvolved
        ? traffic?.vehicleDetails?.driverType
        : (traffic as any)?.offenderWithoutVehicle?.offenderType;

      const offenderPayload: CreateOffenderData = {
        offenceId,
        offenderType: (offenderType as OffenderType) ?? "Civilian",
        offenderDetails: offenderPeople,
      };

      await createOffenderMutate(offenderPayload);
      toast.success("Offender Created Successfully!");

      // ================== WITNESS ==================
      if (traffic.witnesses && traffic.witnesses.length > 0) {
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
          value={watch("vehicleInvolved")}
          onChange={(v: string) =>
            setValue("vehicleInvolved", v as "yes" | "no", { shouldValidate: true })
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
        <FormProvider {...methods}>
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
              onNext={handleNext}
              onSubmitFinal={handleSubmit(onSubmit)}
              stepsConfig={stepsConfig}
              mode="traffic"
            />
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
