// import { initialState, useForm } from "@/context/FormContext";

// import { toast } from "react-toastify";
// import Step1ReportDetails from "./steps/Step1ReportingDetails";
// import Step2 from "./steps/Step2Particulars";
// import Step3OccurrenceDetails from "./steps/Step3OccurenceDetails";
// import { LeftStepper } from "../multi-step-form/LeftStepper";
// import { RightPanel } from "../multi-step-form/RightPanel";
// import Step4IndividualDetails from "./steps/Step4IndividualDetails";
// import Step5WitnessList from "./steps/Step5WitnessList";
// import Step6Evidence from "./steps/Step6Evidence";
// import Step7Documents from "./steps/Step7Document";
// import Step8DetailedOccurrence from "./steps/Step8DetailedOccurance";
// import Step9InvestigationPoints from "./steps/Step9InvestigationPoints";
// import Step10Opinion from "./steps/Step10Opinion";
// import Step11Remarks from "./steps/Step11Remarks";
// import { useCreateMPReport } from "@/features/mpReports/hooks";
// import { createOffender } from "@/apis";
// import { OffenderType } from "@/apis/offender/types";
// import { useState } from "react";

// export default function MultiFormReport({
//   onCancel,
// }: {
//   onCancel: () => void;
// }) {
//   const { state, dispatch } = useForm();
//   const [mode, setMode] = useState("");
//   // ================= MP STEPPER STEPS =================
//   const steps = [
//     { id: 1, label: "Report Details", icon: "1" },
//     { id: 2, label: "MP Particulars", icon: "2" },
//     { id: 3, label: "Occurrence Details", icon: "3" },
//     { id: 4, label: "Details of Individual", icon: "4" },
//     { id: 5, label: "Witness", icon: "5" },
//     { id: 6, label: "Evidence", icon: "6" },
//     { id: 7, label: "Documents", icon: "7" },
//     { id: 8, label: "Detailed Occurrence Report", icon: "8" },
//     { id: 9, label: "Points found during investigation", icon: "9" },
//     { id: 10, label: "Opinion", icon: "10" },
//     { id: 11, label: "Remarks of CO/21C Provost Unit", icon: "11" },
//   ];

//   const { mutate: createReport, isPending } = useCreateMPReport();

//   const mapMpToReport = (mp: any) => {
//     const offenders = mp.individualDetails?.offenderList || [];
//     const witnessList = mp.witnesses || [];

//     return {
//       reportNo: mp.reportDetails.reportNo || "N/A",
//       command: mp.reportDetails.command || "N/A",
//       firNo: mp.reportDetails.firNo || "N/A",

//       mpDetails: {
//         armyNo: mp.mpParticulars.armyNo || "N/A",
//         rank: mp.mpParticulars.rank || "N/A",
//         name: mp.mpParticulars.name || "N/A",
//         unit: mp.mpParticulars.unit || "N/A",
//         fmn: mp.mpParticulars.fmn || "N/A",
//         command: mp.mpParticulars.command || "N/A",
//       },

//       occurrence: {
//         offenceType: mp.occurrenceDetails.offenceType || "N/A",
//         place: mp.occurrenceDetails.place || "N/A",
//         date: mp.occurrenceDetails.date || "N/A",
//         time: mp.occurrenceDetails.time || "N/A",
//       },

//       /* ---------- VICTIMS / OFFENDERS TABLE ---------- */
//       people: offenders.map((p: any, i: number) => ({
//         sno: i + 1,
//         armyNo: p.armyNumber || "N/A",
//         rank: p.rank || "N/A",
//         name: p.name || "N/A",
//         identityCard: p.iCardNumber || "N/A",
//         unitName: p.unit || "N/A",
//         fmn: p.fmn || "N/A",
//         address: p.address || "N/A",
//         remark: p.remark || "--",
//         role: "Offender",
//       })),

//       briefOfOccurrence: mp.occurrenceDetails.description || "N/A",

//       /* ---------- WITNESS TABLE ---------- */
//       witnesses: witnessList.map((p: any, i: number) => ({
//         sno: i + 1,
//         armyNo: p.armyNumber || "N/A",
//         rank: p.rank || "N/A",
//         name: p.name || "N/A",
//         identityCard: p.iCardNumber || "N/A",
//         unitName: p.unit || "N/A",
//         fmn: p.fmn || "N/A",
//         address: p.address || "N/A",
//         remark: p.remark || "--",
//       })),

//       evidence: {
//         eyeSketch: mp.evidence.eyeSketch || "",
//         photos: mp.evidence.photos?.length ? "Attached" : "",
//         videos: mp.evidence.videos?.length ? "Attached" : "",
//       },

//       documents: (mp.documents || []).map((d: any) => d.statement),

//       detailedReport: {
//         statement: mp.detailedReport || "",
//         findings: mp.investigationPoints
//           ? mp.investigationPoints.split("\n")
//           : [],
//         opinion: mp.opinion || "",
//       },

//       remarks: {
//         analysis: mp.remarks.analysis || "",
//         recommendation: mp.remarks.recommendation || "",
//       },

//       station: mp.reportDetails.command || "N/A",
//       reportDate: new Date().toLocaleDateString("en-GB"),
//     };
//   };

//   const onSubmitFinal = async () => {
//     try {
//       const mp = state.formData.mpReport;

//       const offenders = (mp?.individualDetails?.offenderList || []).filter(
//         (p: any) =>
//           p && Object.values(p).some((v) => v && String(v).trim() !== "")
//       );

//       const witnessList = (mp?.witnesses || []).filter(
//         (p: any) =>
//           p && Object.values(p).some((v) => v && String(v).trim() !== "")
//       );

//       const payload = {
//         reportDetails: {
//           reportNumber: mp.reportDetails.reportNo,
//           command: mp.reportDetails.command,
//           firNumber: mp.reportDetails.firNo,
//           ...(mp.reportDetails.firFile
//             ? { firFileUrl: mp.reportDetails.firFile }
//             : {}),
//         },

//         investigationHead: {
//           armyNumber: mp.mpParticulars.armyNo,
//           rank: mp.mpParticulars.rank,
//           name: mp.mpParticulars.name,
//           unit: mp.mpParticulars.unit,
//           fmn: mp.mpParticulars.fmn,
//           command: mp.mpParticulars.command,
//           address: mp.mpParticulars.address,
//           iCardNumber: mp.mpParticulars.icard,
//         },

//         occurrenceDetails: {
//           offenceType: mp.occurrenceDetails.offenceType,
//           placeOfOccurrence: mp.occurrenceDetails.place,
//           dateOfOccurrence: mp.occurrenceDetails.date,
//           timeOfOccurrence: new Date(
//             `${mp.occurrenceDetails.date}T${mp.occurrenceDetails.time}:00`
//           ).toISOString(),
//           description: mp.occurrenceDetails.description,
//         },

//         individuals: offenders.map((p: any) => {
//           const type = p?.driverType || p?.offenderType || "Civilian";

//           if (type === "Military Person") {
//             return {
//               armyNumber:
//                 p["Army Rider / Driver Number"] ||
//                 p["Army Number"] ||
//                 p.armyNumber ||
//                 p.armyNo ||
//                 "",
//               name: p["Name"] || p.name || "",
//               rank: p["Rank"] || p.rank || "",
//               unit: p["Unit"] || p.unit || "",
//               fmn: p["FMN"] || p.fmn || "",
//               command: p["Command"] || p.command || "",
//               address: p["Address"] || p.address || "",
//               identityCard:
//                 p["ID Card Number"] ||
//                 p["I Card Number"] ||
//                 p.icard ||
//                 p.iCardNumber ||
//                 "",
//               role: "offender",
//               isVehicleInvolved:
//                 mp?.individualDetails?.vehicleInvolved === "yes",
//               vehicleCategory:
//                 p?.vehicleCategory || p?.vehicleDetails?.vehicleType || "",
//               vehicleNumber:
//                 p?.vehicleDetails?.vehicleNumber || p?.vehicleNumber || "",
//             };
//           }

//           if (type === "Civilian") {
//             return {
//               name:
//                 p["Full Name"] || p["FullName"] || p["Name"] || p.name || "",
//               fatherOrHusbandName:
//                 p["Father / Husband Name"] ||
//                 p["Father’s Name (Son of)"] ||
//                 p["Father Name"] ||
//                 p.fatherName ||
//                 "",
//               address:
//                 p["Address"] ||
//                 p["Shop Address"] ||
//                 p["Place of Stay"] ||
//                 p.address ||
//                 "",
//               identityCard:
//                 p["Aadhar Card Number"] ||
//                 p["Aadhaar Card Number"] ||
//                 p["Aadhar Number"] ||
//                 p["Aadhaar Number"] ||
//                 p.icard ||
//                 "",
//               rank: "",
//               unit: "",
//               fmn: "",
//               command: "",
//               role: "offender",
//               isVehicleInvolved: false,
//               vehicleCategory: "",
//               vehicleNumber: "",
//             };
//           }

//           if (type === "Employee") {
//             return {
//               serviceNumber: p["Service Number"] || p.serviceNumber || "",
//               name: p["Name"] || p.name || "",
//               rank: p["Rank"] || p.rank || "",
//               unit: p["Unit"] || p.unit || "",
//               fmn: p["FMN"] || p.fmn || "",
//               command: p["Command"] || p.command || "",
//               address: p["Address"] || p.address || "",
//               identityCard:
//                 p["I Card Number"] || p["ID Card Number"] || p.icard || "",
//               role: "offender",
//               isVehicleInvolved: false,
//               vehicleCategory: "",
//               vehicleNumber: "",
//             };
//           }

//           if (type === "Servant/Maid") {
//             return {
//               passNumber:
//                 p["Maid/Servant Pass Number*"] || p["Pass Number"] || "",
//               fatherOrHusbandName: p["Father’s Name (Son of)"] || "",
//               identityCard: p["Pass ID"] || p["I Card Number"] || p.icard || "",
//               name: p["Name"] || p.name || "",
//               rank: p["C/O Rank"] || p.rank || "",
//               unit: p["Unit"] || p.unit || "",
//               fmn: p["FMN"] || p.fmn || "",
//               command: p["Command"] || p.command || "",
//               address: p["Address"] || p.address || "",
//               role: "offender",
//               isVehicleInvolved: false,
//               vehicleCategory: "",
//               vehicleNumber: "",
//             };
//           }

//           if (type === "Shop Keeper") {
//             return {
//               name: p["Rider/Driver Name"] || p.name || "",
//               shopName: p["Shop Name"] || "",
//               unit: p["Unit"] || p.unit || "",
//               address: p["Shop Address"] || p.address || "",
//               identityCard: p["Pass No."] || p.passNo || "",
//               role: "offender",
//               rank: "",
//               fmn: "",
//               command: "",
//               isVehicleInvolved: false,
//               vehicleCategory: "",
//               vehicleNumber: "",
//             };
//           }

//           if (type === "Temporary Hired Worker") {
//             return {
//               name: p["Rider/Driver Name"] || p.name || "",
//               address: p["Place of Stay"] || p.address || "",
//               identityCard: p["Pass No."] || p.passNo || "",
//               placeOfWork: p["Place Of Work"] || "",
//               workType: p["Type of Work"] || "",
//               role: "offender",
//               rank: "",
//               unit: "",
//               fmn: "",
//               command: "",
//               isVehicleInvolved: false,
//               vehicleCategory: "",
//               vehicleNumber: "",
//             };
//           }

//           return {};
//         }),

//         witnesses: witnessList.map((p: any) => ({
//           armyNumber:
//             p.armyNumber ||
//             p.armyNo ||
//             p["Army Rider / Driver Number"] ||
//             p["Army Number"] ||
//             "",
//           rank: p.rank || p["Rank"] || "",
//           name: p.name || p["Name"] || "",
//           unit: p.unit || p["Unit"] || "",
//           fmn: p.fmn || p["FMN"] || "",
//           address: p.address || p["Address"] || "",
//           identityCard:
//             p.iCardNumber ||
//             p.icard ||
//             p["ID Card Number"] ||
//             p["Identity Card Number"] ||
//             "",
//           isVehicleInvolved: p?.vehicleInvolved === "yes",
//         })),

//         documents: (mp.documents || [])
//           .filter((d) => d.url)
//           .map((d) => ({
//             statement: d.statement,
//             url: d.url,
//           })),

//         evidences: [],

//         detailedOccurrenceReport: mp.detailedReport,
//         pointsFindOutDuringInvestigation: mp.investigationPoints,
//         opinion: mp.opinion,

//         remarks: {
//           analysis: mp.remarks.analysis,
//           recommendation: mp.remarks.recommendation,
//         },
//       };

//       createReport(payload, {
//         onSuccess: async (res: any) => {
//           toast.success("MP Investigation Report Created Successfully 🎉");

//           const reportId = res?._id;

//           try {
//             for (const offender of offenders) {
//               await createOffender({
//                 offenceId: reportId,
//                 offenderType:
//                   (offender.driverType as OffenderType) || "Civilian",
//                 category: "investigation",
//                 offenderDetails: [
//                   {
//                     type: "Driver",
//                     details: offender,
//                   },
//                 ],
//               });
//             }
//           } catch (err) {
//             toast.error("Offender creation failed ❌");
//           }

//           dispatch({
//             type: "SET_PATH",
//             path: "mpReport.createdId",
//             value: reportId,
//           });

//           // ⭐⭐ RESET COMPLETE FORM ⭐⭐
//           dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
//           dispatch({ type: "SET_STEP", payload: 1 });
//           dispatch({
//             type: "SET_PATH",
//             path: "completedSteps",
//             value: [],
//           });
//         },

//         onError: (err: any) => {
//           toast.error(
//             err?.response?.data?.message || "Failed to create report"
//           );
//         },
//       });
//     } catch (err) {
//       toast.error("Invalid form data");
//     }
//   };

//   // const onSubmitFinal = async () => {
//   //   try {
//   //     const mp = state.formData.mpReport;

//   //     // ⭐ FILTER EMPTY OFFENDERS
//   //     const offenders = (mp?.individualDetails?.offenderList || []).filter(
//   //       (p: any) =>
//   //         p && Object.values(p).some((v) => v && String(v).trim() !== "")
//   //     );

//   //     // ⭐ FILTER EMPTY WITNESSES (safety)
//   //     const witnessList = (mp?.witnesses || []).filter(
//   //       (p: any) =>
//   //         p && Object.values(p).some((v) => v && String(v).trim() !== "")
//   //     );

//   //     const payload = {
//   //       reportDetails: {
//   //         reportNumber: mp.reportDetails.reportNo,
//   //         command: mp.reportDetails.command,
//   //         firNumber: mp.reportDetails.firNo,
//   //         ...(mp.reportDetails.firFile
//   //           ? { firFileUrl: mp.reportDetails.firFile }
//   //           : {}),
//   //       },

//   //       investigationHead: {
//   //         armyNumber: mp.mpParticulars.armyNo,
//   //         rank: mp.mpParticulars.rank,
//   //         name: mp.mpParticulars.name,
//   //         unit: mp.mpParticulars.unit,
//   //         fmn: mp.mpParticulars.fmn,
//   //         command: mp.mpParticulars.command,
//   //         address: mp.mpParticulars.address,
//   //         iCardNumber: mp.mpParticulars.icard,
//   //       },

//   //       occurrenceDetails: {
//   //         offenceType: mp.occurrenceDetails.offenceType,
//   //         placeOfOccurrence: mp.occurrenceDetails.place,
//   //         dateOfOccurrence: mp.occurrenceDetails.date,
//   //         timeOfOccurrence: new Date(
//   //           `${mp.occurrenceDetails.date}T${mp.occurrenceDetails.time}:00`
//   //         ).toISOString(),
//   //         description: mp.occurrenceDetails.description,
//   //       },

//   //       individuals: offenders.map((p: any) => {
//   //         const type = p?.driverType || p?.offenderType || "Civilian";

//   //         /* ================= MILITARY ================= */
//   //         if (type === "Military Person") {
//   //           return {
//   //             armyNumber:
//   //               p["Army Rider / Driver Number"] ||
//   //               p["Army Number"] ||
//   //               p.armyNumber ||
//   //               p.armyNo ||
//   //               "",

//   //             name: p["Name"] || p.name || "",

//   //             rank: p["Rank"] || p.rank || "",
//   //             unit: p["Unit"] || p.unit || "",
//   //             fmn: p["FMN"] || p.fmn || "",
//   //             command: p["Command"] || p.command || "",

//   //             address: p["Address"] || p.address || "",

//   //             identityCard:
//   //               p["ID Card Number"] ||
//   //               p["I Card Number"] ||
//   //               p.icard ||
//   //               p.iCardNumber ||
//   //               "",

//   //             role: "offender",

//   //             isVehicleInvolved:
//   //               mp?.individualDetails?.vehicleInvolved === "yes",

//   //             vehicleCategory:
//   //               p?.vehicleCategory || p?.vehicleDetails?.vehicleType || "",

//   //             vehicleNumber:
//   //               p?.vehicleDetails?.vehicleNumber || p?.vehicleNumber || "",
//   //           };
//   //         }

//   //         /* ================= CIVILIAN ================= */
//   //         if (type === "Civilian") {
//   //           return {
//   //             name:
//   //               p["Full Name"] || p["FullName"] || p["Name"] || p.name || "",

//   //             fatherOrHusbandName:
//   //               p["Father / Husband Name"] ||
//   //               p["Father’s Name (Son of)"] ||
//   //               p["Father Name"] ||
//   //               p.fatherName ||
//   //               "",

//   //             address:
//   //               p["Address"] ||
//   //               p["Shop Address"] ||
//   //               p["Place of Stay"] ||
//   //               p.address ||
//   //               "",

//   //             identityCard:
//   //               p["Aadhar Card Number"] ||
//   //               p["Aadhaar Card Number"] ||
//   //               p["Aadhar Number"] ||
//   //               p["Aadhaar Number"] ||
//   //               p.icard ||
//   //               "",

//   //             rank: "",
//   //             unit: "",
//   //             fmn: "",
//   //             command: "",

//   //             role: "offender",
//   //             isVehicleInvolved: false,
//   //             vehicleCategory: "",
//   //             vehicleNumber: "",
//   //           };
//   //         }

//   //         /* ================= EMPLOYEE ================= */
//   //         if (type === "Employee") {
//   //           return {
//   //             serviceNumber: p["Service Number"] || p.serviceNumber || "",

//   //             name: p["Name"] || p.name || "",
//   //             rank: p["Rank"] || p.rank || "",
//   //             unit: p["Unit"] || p.unit || "",
//   //             fmn: p["FMN"] || p.fmn || "",
//   //             command: p["Command"] || p.command || "",

//   //             address: p["Address"] || p.address || "",

//   //             identityCard:
//   //               p["I Card Number"] || p["ID Card Number"] || p.icard || "",

//   //             role: "offender",
//   //             isVehicleInvolved: false,
//   //             vehicleCategory: "",
//   //             vehicleNumber: "",
//   //           };
//   //         }

//   //         /* ================= SERVANT / MAID ================= */
//   //         if (type === "Servant/Maid") {
//   //           return {
//   //             passNumber:
//   //               p["Maid/Servant Pass Number*"] || p["Pass Number"] || "",

//   //             fatherOrHusbandName: p["Father’s Name (Son of)"] || "",

//   //             identityCard: p["Pass ID"] || p["I Card Number"] || p.icard || "",

//   //             name: p["Name"] || p.name || "",
//   //             rank: p["C/O Rank"] || p.rank || "",
//   //             unit: p["Unit"] || p.unit || "",
//   //             fmn: p["FMN"] || p.fmn || "",
//   //             command: p["Command"] || p.command || "",
//   //             address: p["Address"] || p.address || "",

//   //             role: "offender",
//   //             isVehicleInvolved: false,
//   //             vehicleCategory: "",
//   //             vehicleNumber: "",
//   //           };
//   //         }

//   //         /* ================= SHOPKEEPER ================= */
//   //         if (type === "Shop Keeper") {
//   //           return {
//   //             name: p["Rider/Driver Name"] || p.name || "",
//   //             shopName: p["Shop Name"] || "",

//   //             unit: p["Unit"] || p.unit || "",
//   //             address: p["Shop Address"] || p.address || "",

//   //             identityCard: p["Pass No."] || p.passNo || "",

//   //             role: "offender",
//   //             rank: "",
//   //             fmn: "",
//   //             command: "",
//   //             isVehicleInvolved: false,
//   //             vehicleCategory: "",
//   //             vehicleNumber: "",
//   //           };
//   //         }

//   //         /* ================= TEMP WORKER ================= */
//   //         if (type === "Temporary Hired Worker") {
//   //           return {
//   //             name: p["Rider/Driver Name"] || p.name || "",

//   //             address: p["Place of Stay"] || p.address || "",

//   //             identityCard: p["Pass No."] || p.passNo || "",

//   //             placeOfWork: p["Place Of Work"] || "",
//   //             workType: p["Type of Work"] || "",

//   //             role: "offender",
//   //             rank: "",
//   //             unit: "",
//   //             fmn: "",
//   //             command: "",
//   //             isVehicleInvolved: false,
//   //             vehicleCategory: "",
//   //             vehicleNumber: "",
//   //           };
//   //         }

//   //         return {};
//   //       }),

//   //       witnesses: witnessList.map((p: any) => ({
//   //         armyNumber:
//   //           p.armyNumber ||
//   //           p.armyNo ||
//   //           p["Army Rider / Driver Number"] ||
//   //           p["Army Number"] ||
//   //           "",

//   //         rank: p.rank || p["Rank"] || "",
//   //         name: p.name || p["Name"] || "",
//   //         unit: p.unit || p["Unit"] || "",
//   //         fmn: p.fmn || p["FMN"] || "",
//   //         address: p.address || p["Address"] || "",

//   //         identityCard:
//   //           p.iCardNumber ||
//   //           p.icard ||
//   //           p["ID Card Number"] ||
//   //           p["Identity Card Number"] ||
//   //           "",

//   //         isVehicleInvolved: p?.vehicleInvolved === "yes",
//   //       })),

//   //       documents: (mp.documents || [])
//   //         .filter((d) => d.url)
//   //         .map((d) => ({
//   //           statement: d.statement,
//   //           url: d.url,
//   //         })),

//   //       evidences: [],

//   //       detailedOccurrenceReport: mp.detailedReport,
//   //       pointsFindOutDuringInvestigation: mp.investigationPoints,
//   //       opinion: mp.opinion,

//   //       remarks: {
//   //         analysis: mp.remarks.analysis,
//   //         recommendation: mp.remarks.recommendation,
//   //       },
//   //     };

//   //     console.log("🔥 CLEAN FINAL OFFENDER LIST ===>", offenders);
//   //     console.log("🔥 CLEAN FINAL WITNESS LIST ===>", witnessList);
//   //     console.log("🔥 FINAL MP REPORT PAYLOAD ===>", payload);

//   //     createReport(payload, {
//   //       onSuccess: async (res: any) => {
//   //         toast.success("MP Investigation Report Created Successfully 🎉");

//   //         const reportId = res?._id;

//   //         try {
//   //           for (const offender of offenders) {
//   //             const offenderPayload = {
//   //               offenceId: reportId,
//   //               offenderType:
//   //                 (offender.driverType as OffenderType) || "Civilian",
//   //               category: "investigation",

//   //               offenderDetails: [
//   //                 {
//   //                   type: "Driver",
//   //                   details: offender,
//   //                 },
//   //               ],
//   //             };

//   //             console.log("🔥 FINAL OFFENDER PAYLOAD ===>", offenderPayload);
//   //             await createOffender(offenderPayload);
//   //           }
//   //         } catch (err: any) {
//   //           console.log("OFFENDER CREATE ERROR ===>", err?.response || err);
//   //           toast.error("Offender creation failed ❌");
//   //         }

//   //         dispatch({
//   //           type: "SET_PATH",
//   //           path: "mpReport.createdId",
//   //           value: reportId,
//   //         });
//   //       },

//   //       onError: (err: any) => {
//   //         console.log(" RAW ERROR ===>", err);
//   //         toast.error(
//   //           err?.response?.data?.message || "Failed to create report"
//   //         );
//   //       },
//   //     });
//   //   } catch (err) {
//   //     console.log("SUBMIT TRY/CATCH ERROR ===>", err);
//   //     toast.error("Invalid form data");
//   //   }
//   // };

//   // ================= RIGHT PANEL STEP CONFIG =================
//   const stepsConfig = {
//     1: { title: " 1. REPORT DETAILS :", component: <Step1ReportDetails /> },

//     2: { title: "2. MP PARTICULARS :", component: <Step2 /> },

//     3: {
//       title: "3. OCCURENCE DETAILS : ",
//       component: <Step3OccurrenceDetails />,
//     },
//     4: {
//       title: "4. DETAILS OF INDIVIDUALS :",
//       component: <Step4IndividualDetails />,
//     },
//     5: {
//       title: "5. WITNESS LIST :",
//       component: <Step5WitnessList />,
//     },
//     6: {
//       title: "6. EVIDENCE :",
//       component: <Step6Evidence />,
//     },
//     7: {
//       title: "7. DOCUMENTS :",
//       component: <Step7Documents />,
//     },
//     8: {
//       title: "8. DETAILED OCCURRENCE REPORT :",
//       component: <Step8DetailedOccurrence />,
//     },
//     9: {
//       title: "9. POINTS FIND OUT DURING INVESTIGATION :",
//       component: <Step9InvestigationPoints />,
//     },
//     10: {
//       title: "10. OPINION :",
//       component: <Step10Opinion />,
//     },
//     11: {
//       title: "11. REMARKS OF CO/21C PROVOST UNIT :",
//       component: <Step11Remarks />,
//     },
//   };
//   return (
//     <div className="h-[calc(100vh-40px)] bg-gray-100 w-full px-6">
//       <div className="w-full bg-white rounded-lg overflow-hidden h-full">
//         <div className="flex h-full">
//           {/* LEFT SIDE STEPPER */}
//           <LeftStepper
//             steps={steps}
//             currentStep={state.currentStep}
//             completedSteps={state.completedSteps}
//             title="Create New MP Occurrence & Investigation Report"
//             reportNo="PRO/21 CPU/00042/106/25"
//             hideReportNo // ⭐⭐ THIS LINE ONLY ⭐⭐
//             onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
//             onCreate={onSubmitFinal}
//             onCancel={() => {
//               dispatch({ type: "SET_STEP", payload: 1 });
//               onCancel();
//             }}
//           />

//           {/* RIGHT SIDE DYNAMIC CONTENT */}
//           <RightPanel
//             step={state.currentStep}
//             formData={state.formData}
//             setFormData={(path: string, value: unknown) =>
//               dispatch({ type: "SET_PATH", path, value })
//             }
//             onNext={() => dispatch({ type: "NEXT_STEP" })}
//             onSubmitFinal={onSubmitFinal}
//             stepsConfig={stepsConfig}
//             mode="mp"
//             mapMpToReport={mapMpToReport}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { initialState, useForm } from "@/context/FormContext";
import { toast } from "react-toastify";
import { useState } from "react";

import Step1ReportDetails from "./steps/Step1ReportingDetails";
import Step2 from "./steps/Step2Particulars";
import Step3OccurrenceDetails from "./steps/Step3OccurenceDetails";
import Step4IndividualDetails from "./steps/Step4IndividualDetails";
import Step5WitnessList from "./steps/Step5WitnessList";
import Step6Evidence from "./steps/Step6Evidence";
import Step7Documents from "./steps/Step7Document";
import Step8DetailedOccurrence from "./steps/Step8DetailedOccurance";
import Step9InvestigationPoints from "./steps/Step9InvestigationPoints";
import Step10Opinion from "./steps/Step10Opinion";
import Step11Remarks from "./steps/Step11Remarks";

import { LeftStepper } from "../multi-step-form/LeftStepper";
import { RightPanel } from "../multi-step-form/RightPanel";

import { useCreateMPReport } from "@/features/mpReports/hooks";
import { createOffender } from "@/apis";
import { OffenderType } from "@/apis/offender/types";

export default function MultiFormReport({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const { state, dispatch } = useForm();
  const [mode] = useState("mp");
const { mutateAsync: createReportAsync } = useCreateMPReport();


  /* ================= STEPS ================= */
  const steps = [
    { id: 1, label: "Report Details", icon: "1" },
    { id: 2, label: "MP Particulars", icon: "2" },
    { id: 3, label: "Occurrence Details", icon: "3" },
    { id: 4, label: "Details of Individual", icon: "4" },
    { id: 5, label: "Witness", icon: "5" },
    { id: 6, label: "Evidence", icon: "6" },
    { id: 7, label: "Documents", icon: "7" },
    { id: 8, label: "Detailed Occurrence Report", icon: "8" },
    { id: 9, label: "Points found during investigation", icon: "9" },
    { id: 10, label: "Opinion", icon: "10" },
    { id: 11, label: "Remarks of CO/21C Provost Unit", icon: "11" },
  ];

  const toISODateTime = (date?: string, time?: string) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}`).toISOString();
  };

  /* ================= PREVIEW MAPPER ================= */
  const mapMpToReport = (mp: any) => {
    const individuals = mp?.individualDetails?.offenderList || [];
    const rawWitnesses = mp?.witnesses || [];
    const ev = mp?.evidence || {};

    const people = individuals.map((p: any, i: number) => ({
      sno: i + 1,
      armyNo: p.armyNumber || p.armyNo || "N/A",
      rank: p.rank || "N/A",
      name: p.name || "N/A",
      identityCard: p.iCardNumber || p.icard || "N/A",
      unitName: p.unit || "N/A",
      fmn: p.fmn || "N/A",
      address: p.address || "N/A",
      remark: p.remark || "--",
      role: "Offender",
    }));

    const witnesses = rawWitnesses.map((p: any, i: number) => ({
      sno: i + 1,
      armyNo: p.armyNumber || p.armyNo || "N/A",
      rank: p.rank || "N/A",
      name: p.name || "N/A",
      identityCard: p.iCardNumber || p.icard || "N/A",
      unitName: p.unit || "N/A",
      fmn: p.fmn || "N/A",
      address: p.address || "N/A",
      remark: p.remark || "--",
    }));

    const evidence = {
      eyeSketch: ev?.eyeSketch || "",
      photos: Array.isArray(ev?.photos) && ev.photos.length ? "Attached" : "",
      videos: Array.isArray(ev?.videos) && ev.videos.length ? "Attached" : "",
    };

    return {
      reportNo: mp?.reportDetails?.reportNo || "N/A",
      reportDate: new Date().toLocaleDateString("en-GB"),

      mpDetails: {
        armyNo: mp?.mpParticulars?.armyNo || "N/A",
        rank: mp?.mpParticulars?.rank || "N/A",
        name: mp?.mpParticulars?.name || "N/A",
        unit: mp?.mpParticulars?.unit || "N/A",
        fmn: mp?.mpParticulars?.fmn || "N/A",
        command: mp?.mpParticulars?.command || "N/A",
      },

      occurrence: {
        offenceType: mp?.occurrenceDetails?.offenceType || "N/A",
        place: mp?.occurrenceDetails?.place || "N/A",
        date: mp?.occurrenceDetails?.date || "N/A",
        time: mp?.occurrenceDetails?.time || "N/A",
        description: mp?.occurrenceDetails?.description || "N/A",
      },

      people,
      witnesses,
      evidence,

      documents: (mp?.documents || []).map((d: any) => d.statement || ""),
      detailedReport: {
        findings: Array.isArray(mp?.investigationPoints)
          ? mp.investigationPoints
          : mp?.investigationPoints
          ? [mp.investigationPoints]
          : [],
      },

      investigationPoints: mp?.investigationPoints || "",
      opinion: mp?.opinion || "",

      remarks: {
        analysis: mp?.remarks?.analysis || "",
        recommendation: mp?.remarks?.recommendation || "",
      },
    };
  };

 const createIndividualsAndWitnessesSequentially = async (
  offenceId: string,
  individuals: any[],
  witnesses: any[]
) => {
  /* ===== INDIVIDUALS ===== */
  for (const ind of individuals) {
    await createOffender({
      offenceId,
      offenderType:
        (ind.driverType as OffenderType) ||
        (ind.offenderType as OffenderType) ||
        "Civilian",
      category: "mp-reporting",
      offenderDetails: {
        type: "Person",
        details: ind,
      },
    });
  }

  /* ===== WITNESSES ===== */
  for (const wit of witnesses) {
    await createOffender({
      offenceId,
      offenderType: "Civilian",
      category: "mp-reporting",
      offenderDetails: {
        type: "Person",
        details: wit,
      },
    });
  }
};

const onSubmitFinal = async () => {
  try {
    const mp = state.formData.mpReport;

    const individuals = (mp?.individualDetails?.offenderList || []).filter(
      (p: any) =>
        p && Object.values(p).some((v) => v && String(v).trim() !== "")
    );

    const witnesses = (mp?.witnesses || []).filter(
      (p: any) =>
        p && Object.values(p).some((v) => v && String(v).trim() !== "")
    );

    /* ✅ DEFINE PAYLOAD FIRST */
    const payload = {
      reportDetails: {
        reportNumber: mp.reportDetails.reportNo,
        command: mp.reportDetails.command,
        firNumber: mp.reportDetails.firNo,
        firFileUrl: mp.reportDetails.firFile || "",
        customFields: {},
      },

      investigationHead: {
        armyNumber: mp.mpParticulars.armyNo,
        rank: mp.mpParticulars.rank,
        name: mp.mpParticulars.name,
        unit: mp.mpParticulars.unit,
        fmn: mp.mpParticulars.fmn,
        command: mp.mpParticulars.command,
        address: mp.mpParticulars.address,
        iCardNumber: mp.mpParticulars.icard,
        customFields: {},
      },

      occurrenceDetails: {
        offenceType: mp.occurrenceDetails.offenceType,
        placeOfOccurrence: mp.occurrenceDetails.place,
        dateOfOccurrence: toISODateTime(mp.occurrenceDetails.date, "00:00"),
        timeOfOccurrence: toISODateTime(
          mp.occurrenceDetails.date,
          mp.occurrenceDetails.time
        ),
        description: mp.occurrenceDetails.description,
        customFields: {},
      },

      documents: (mp.documents || []).map((d: any) => ({
        statement: d.statement,
        url: d.url || "",
        customFields: {},
      })),

      detailedOccurrenceReport: mp.detailedReport,
      pointsFindOutDuringInvestigation: mp.investigationPoints,
      opinion: mp.opinion,

      remarks: {
        analysis: mp.remarks.analysis,
        recommendation: mp.remarks.recommendation,
        customFields: {},
      },

      customFields: {},
    };

    console.log("📦 MP REPORT PAYLOAD", payload);

    /* 🔹 CREATE MP REPORT */
    const res: any = await createReportAsync(payload);

    toast.success("MP Investigation Report Created 🎉");

    const offenceId = res?._id;
    if (!offenceId) return;

    console.log("🚀 MP REPORT CREATED, NOW CREATING OFFENDERS");

    /* 🔹 CREATE OFFENDERS SEQUENTIALLY */
    await createIndividualsAndWitnessesSequentially(
      offenceId,
      individuals,
      witnesses
    );

    console.log("✅ ALL OFFENDERS CREATED");

    dispatch({ type: "SET_FORM_DATA", payload: initialState.formData });
    dispatch({ type: "SET_STEP", payload: 1 });
    dispatch({
      type: "SET_PATH",
      path: "completedSteps",
      value: [],
    });
  } catch (err: any) {
    console.error("❌ FINAL SUBMIT ERROR", err?.response?.data || err);
    toast.error("Failed to create report");
  }
};


  /* ================= RIGHT PANEL CONFIG ================= */
  const stepsConfig = {
    1: { title: "1. REPORT DETAILS :", component: <Step1ReportDetails /> },
    2: { title: "2. MP PARTICULARS :", component: <Step2 /> },
    3: {
      title: "3. OCCURRENCE DETAILS :",
      component: <Step3OccurrenceDetails />,
    },
    4: {
      title: "4. DETAILS OF INDIVIDUALS :",
      component: <Step4IndividualDetails />,
    },
    5: { title: "5. WITNESS LIST :", component: <Step5WitnessList /> },
    6: { title: "6. EVIDENCE :", component: <Step6Evidence /> },
    7: { title: "7. DOCUMENTS :", component: <Step7Documents /> },
    8: {
      title: "8. DETAILED OCCURRENCE REPORT :",
      component: <Step8DetailedOccurrence />,
    },
    9: {
      title: "9. POINTS FOUND DURING INVESTIGATION :",
      component: <Step9InvestigationPoints />,
    },
    10: { title: "10. OPINION :", component: <Step10Opinion /> },
    11: {
      title: "11. REMARKS OF CO/21C PROVOST UNIT :",
      component: <Step11Remarks />,
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
            title="Create New MP Occurrence & Investigation Report"
            hideReportNo
            onStepClick={(id) => dispatch({ type: "SET_STEP", payload: id })}
            onCreate={onSubmitFinal}
            onCancel={() => {
              dispatch({ type: "SET_STEP", payload: 1 });
              onCancel();
            }}
          />

          <RightPanel
            step={state.currentStep}
            formData={state.formData}
            setFormData={(path: string, value: unknown) =>
              dispatch({ type: "SET_PATH", path, value })
            }
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onSubmitFinal={onSubmitFinal}
            stepsConfig={stepsConfig}
            mode={mode}
            mapMpToReport={mapMpToReport}
          />
        </div>
      </div>
    </div>
  );
}
