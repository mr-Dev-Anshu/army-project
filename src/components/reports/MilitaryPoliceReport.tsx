// import React from "react";

// export interface MilitaryPoliceReportProps {
//   reportNo: string;
//   reportDate: string;
//   particulars: {
//     primary: PersonDetails;
//     secondary?: PersonDetails; // For (1.2) - optional
//     vehicle?: VehicleDetails; // For (1.3)
//   };
//   occurrence: {
//     dateOfDuty: string;
//     dutyTime: string;
//     dutyLocation: string;
//     witnessingMps: { name: string; rank: string }[]; // 2.4 - Dynamic List
//     timeOfOffence: string;
//     locationOfOffence: string;
//     statement: string; // 2.5
//   };
//   offence: {
//     types: string[]; // 3.1 - Dynamic List
//     refs: string[]; // Dynamic References
//     description: string;
//   };
//   witnessSig: SignatureDetails;
//   mpSig: SignatureDetails;
//   remarks: {
//     text: string;
//     station: string;
//     dated: string;
//   };
//   className?: string;
// }

// interface PersonDetails {
//   aadharCardNo: string;
//   name: string;
//   so: string;
//   relation: string;
//   armyNo: string;
//   rank: string;
//   unit: string;
//   command: string;
//   fmn: string;
//   address: string;
//   iCardNo: string;
// }

// interface VehicleDetails {
//   baNo: string;
//   makeAndTake: string;
//   vehicleNumber: string;
// }

// interface SignatureDetails {
//   armyNo: string;
//   rank: string;
//   name: string;
//   unit: string;
// }

// const DataField = ({
//   label,
//   value,
//   className = "grid-cols-[110px_1fr]",
// }: {
//   label: React.ReactNode;
//   value?: string;
//   className?: string;
// }) => {
//   if (!value || value === "N/A") return null;
//   return (
//     <div className={`grid ${className}`}>
//       <span className="font-bold text-xs flex items-center">{label}</span>
//       <span className="text-xs flex items-center">{value}</span>
//     </div>
//   );
// };

// const MilitaryPoliceReport: React.FC<MilitaryPoliceReportProps> = ({
//   reportNo,
//   reportDate,
//   particulars,
//   occurrence,
//   offence,
//   witnessSig,
//   mpSig,
//   remarks,
//   className,
// }) => {
//   // ✅ SAFETY NORMALIZATION (edit + normal dono support)
//   const primary =
//     (particulars as any)?.primary || (particulars as any)?.persons?.[0] || {};

//   const secondary =
//     (particulars as any)?.secondary || (particulars as any)?.persons?.[1];

//   const vehicle = (particulars as any)?.vehicle;

//   return (
//     <div
//       id="mp-report"
//       className={`font-[Arial] text-[#0A0A0A] flex flex-col gap-8 items-center print:block print:gap-0 ${className || ""}`}
//     >
//       {/* ==================== PAGE 1 ==================== */}
//       <div
//         className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col print:justify-between print:p-[48px]"
//         style={{ pageBreakAfter: "always" }}
//       >
//         {/* Page 1 Content Wrapper */}
//         <div>
//           {/* Header */}
//           <div className="flex flex-col mb-8">
//             <div className="text-right font-bold text-xs mb-4 underline">
//               In Lieu Of IAFP-1479
//             </div>
//             <h1 className="text-center font-bold text-sm text-[#0A0A0A] mb-1">
//               MILITARY POLICE REPORT
//             </h1>
//             <h1 className="text-center font-bold text-sm text-[#0A0A0A] mb-8">
//               (GEN AND TRAFFIC OFFENCE)
//             </h1>
//             <div className="flex justify-between items-end">
//               <div className="text-xs">Report No- {reportNo}</div>
//               <div className="text-xs">Report Date- {reportDate}</div>
//             </div>
//           </div>

//           {/* 1. PARTICULARS */}
//           {(Object.values(primary).some((val) => val) ||
//             secondary ||
//             vehicle) && (
//             <div className="mb-6">
//               <h2 className="font-bold text-xs mb-4">
//                 1. &nbsp;&nbsp; <span className="underline">PARTICULARS:</span>
//               </h2>

//               {/* 1.1 Primary Person */}
//               <div className="border border-gray-300 mb-4">
//                 <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
//                   <div className="text-xs">(1.1)</div>
//                   <div className="grid grid-cols-2 gap-x-12 gap-y-1">
//                     <DataField
//                       label="Aadhar Card No."
//                       value={particulars.primary.aadharCardNo}
//                     />
//                     <DataField
//                       label="S/O"
//                       value={particulars.primary.so}
//                       className="grid-cols-[120px_1fr]"
//                     />
//                     <DataField
//                       label="Driver Name"
//                       value={particulars.primary.name}
//                     />
//                     <DataField
//                       label="Name the Relation"
//                       value={particulars.primary.relation}
//                       className="grid-cols-[120px_1fr]"
//                     />
//                   </div>
//                 </div>

//                 <div className="border-t border-gray-100 mx-4"></div>

//                 <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
//                   <div className="text-xs">(1.1.1)</div>
//                   <div className="grid grid-cols-2 gap-x-12 gap-y-1">
//                     <DataField
//                       label="Army No."
//                       value={particulars.primary.armyNo}
//                     />
//                     <DataField
//                       label="Rank"
//                       value={particulars.primary.rank}
//                       className="grid-cols-[120px_1fr]"
//                     />
//                     <DataField label="Name" value={particulars.primary.name} />
//                     <DataField
//                       label="Unit"
//                       value={particulars.primary.unit}
//                       className="grid-cols-[120px_1fr]"
//                     />
//                     <DataField label="FMN" value={particulars.primary.fmn} />
//                     <DataField
//                       label="Command"
//                       value={particulars.primary.command}
//                       className="grid-cols-[120px_1fr]"
//                     />
//                     <DataField
//                       label="Address"
//                       value={particulars.primary.address}
//                     />
//                     <DataField
//                       label="I Card No."
//                       value={particulars.primary.iCardNo}
//                       className="grid-cols-[120px_1fr]"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* 1.2 Secondary Person */}
//               {particulars.secondary && (
//                 <div className="border border-gray-300 mb-4">
//                   <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
//                     <div className="text-xs">(1.2)</div>
//                     <div className="grid grid-cols-2 gap-x-12 gap-y-1">
//                       <DataField
//                         label="Aadhar Card No."
//                         value={particulars.secondary.aadharCardNo}
//                       />
//                       <DataField
//                         label="S/O"
//                         value={particulars.secondary.so}
//                         className="grid-cols-[120px_1fr]"
//                       />
//                       <DataField
//                         label="Co-Driver Name"
//                         value={particulars.secondary.name}
//                       />
//                       <DataField
//                         label="Name the Relation"
//                         value={particulars.secondary.relation}
//                         className="grid-cols-[120px_1fr]"
//                       />
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-100 mx-4"></div>

//                   <div className="p-4 grid grid-cols-[40px_1fr] gap-4">
//                     <div className="text-xs">(1.2.1)</div>
//                     <div className="grid grid-cols-2 gap-x-12 gap-y-1">
//                       <DataField
//                         label="Army No."
//                         value={particulars.secondary.armyNo}
//                       />
//                       <DataField
//                         label="Rank"
//                         value={particulars.secondary.rank}
//                         className="grid-cols-[120px_1fr]"
//                       />
//                       <DataField
//                         label="Name"
//                         value={particulars.secondary.name}
//                       />
//                       <DataField
//                         label="Unit"
//                         value={particulars.secondary.unit}
//                         className="grid-cols-[120px_1fr]"
//                       />
//                       <DataField
//                         label="FMN"
//                         value={particulars.secondary.fmn}
//                       />
//                       <DataField
//                         label="Command"
//                         value={particulars.secondary.command}
//                         className="grid-cols-[120px_1fr]"
//                       />
//                       <DataField
//                         label="Address"
//                         value={particulars.secondary.address}
//                       />
//                       <DataField
//                         label="I Card No."
//                         value={particulars.secondary.iCardNo}
//                         className="grid-cols-[120px_1fr]"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* 1.3 Vehicle */}
//               {particulars.vehicle && (
//                 <div className="border border-gray-300 p-4 mb-4 grid grid-cols-[40px_1fr] gap-4">
//                   <div className="text-xs">(1.3)</div>
//                   <div className="grid grid-cols-2 gap-x-12">
//                     <DataField
//                       label={particulars.vehicle.vehicleNumber}
//                       value={particulars.vehicle.baNo}
//                     />
//                     <DataField
//                       label="Make & Take"
//                       value={particulars.vehicle.makeAndTake}
//                       className="grid-cols-[120px_1fr]"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
//           <div className="mb-6">
//             <h2 className="font-bold text-xs mb-4">
//               2. &nbsp;&nbsp;{" "}
//               <span className="underline">
//                 STATEMENT OF EVIDENCE/OCCURRENCE:
//               </span>
//             </h2>

//             <div className="border border-gray-300 mb-6">
//               {/* Row 2.1 */}
//               <div className="grid grid-cols-2">
//                 <div className="p-2 pl-4 grid grid-cols-[45px_1fr]">
//                   <div className="grid grid-cols-[45px_140px_1fr] items-center">
//                     <span className="text-xs">(2.1)</span>
//                     <div className="col-span-2">
//                       <DataField
//                         label="Date of Duty"
//                         value={occurrence.dateOfDuty}
//                         className="grid-cols-[140px_1fr]"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-2 pl-4">
//                   <DataField
//                     label="Duty Time"
//                     value={occurrence.dutyTime}
//                     className="grid-cols-[130px_1fr]"
//                   />
//                 </div>
//               </div>

//               {/* Row Duty Location */}
//               <div
//                 className={`grid grid-cols-2 border-b border-gray-300 ${!occurrence.dutyLocation || occurrence.dutyLocation === "N/A" ? "hidden" : ""}`}
//               >
//                 <div className="p-2 pl-4 grid grid-cols-[45px_1fr]">
//                   <div className="grid grid-cols-[45px_140px_1fr] items-center">
//                     <span className="text-xs"></span>
//                     <div className="col-span-2">
//                       <DataField
//                         label="Duty Location"
//                         value={occurrence.dutyLocation}
//                         className="grid-cols-[140px_1fr]"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-2 pl-4"></div>
//               </div>

//               {/* Row 2.2 */}
//               {/* Dynamic Witness Rows */}
//               {occurrence.witnessingMps &&
//               occurrence.witnessingMps.length > 0 ? (
//                 occurrence.witnessingMps.map((mp, index) => (
//                   <div
//                     key={index}
//                     className="grid grid-cols-2 border-b border-gray-300"
//                   >
//                     <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
//                       <span className="text-xs">
//                         {index === 0 ? "(2.2)" : `(2.2.${index})`}
//                       </span>
//                       <span className="text-xs font-bold">
//                         Name of MP <br />
//                         Witnessing
//                       </span>
//                       <span className="text-xs">{mp.name}</span>
//                     </div>
//                     <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
//                       <span className="text-xs font-bold">Rank</span>
//                       <span className="text-xs">{mp.rank}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="grid grid-cols-2 border-b border-gray-300">
//                   <div className="p-2 pl-4 grid grid-cols-[45px_140px_1fr] items-center">
//                     <span className="text-xs">(2.2)</span>
//                     <span className="text-xs font-bold">
//                       Name of MP <br />
//                       Witnessing
//                     </span>
//                     <span className="text-xs">N/A</span>
//                   </div>
//                   <div className="p-2 pl-4 grid grid-cols-[130px_1fr] items-center">
//                     <span className="text-xs font-bold">Rank</span>
//                     <span className="text-xs">N/A</span>
//                   </div>
//                 </div>
//               )}

//               {/* Row 2.3 */}
//               <div className="grid grid-cols-2">
//                 <div className="p-2 pl-4 grid grid-cols-[45px_1fr]">
//                   <div className="grid grid-cols-[45px_140px_1fr] items-center">
//                     <span className="text-xs">(2.3)</span>
//                     <div className="col-span-2">
//                       <DataField
//                         label={
//                           <>
//                             Time of <br />
//                             Offence
//                           </>
//                         }
//                         value={occurrence.timeOfOffence}
//                         className="grid-cols-[140px_1fr]"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-2 pl-4">
//                   <DataField
//                     label={
//                       <>
//                         Location of <br />
//                         Offence
//                       </>
//                     }
//                     value={occurrence.locationOfOffence}
//                     className="grid-cols-[130px_1fr]"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-4 mb-4">
//               <div className="text-xs min-w-[30px]">(2.4)</div>
//               <div className="text-xs text-justify leading-relaxed">
//                 {occurrence.statement}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Page 1 Footer */}
//         <div className="text-center absolute bottom-0 left-1/2 -translate-x-1/2 font-bold text-xs mb-8">
//           {" "}
//           RESTRICTED
//         </div>
//       </div>

//       {/* ==================== PAGE 2 ==================== */}
//       <div
//         className="max-w-[210mm] w-full mx-auto bg-white p-[48px] min-h-[297mm] shadow-lg print:shadow-none print:min-h-[297mm] relative flex flex-col print:justify-between print:p-[48px]"
//         style={{ pageBreakBefore: "always" }}
//       >
//         {/* Page 2 Content Wrapper */}
//         <div>
//           {/* Page 2 Header */}
//           <div className="text-center font-bold text-xs mb-1">-2-</div>
//           <div className="text-center font-bold text-xs mb-8">RESTRICTED</div>

//           {/* 3. OFFENCE COMMITTED */}
//           <div className="mb-8 pl-2">
//             <h2 className="font-bold text-xs mb-4">
//               3. &nbsp;&nbsp;{" "}
//               <span className="underline">
//                 OFFENCE COMMITTED/ORDERS CONTRAVENED:
//               </span>
//             </h2>

//             <div className="grid grid-cols-[40px_1fr] gap-y-2 mb-4">
//               {/* 3.1 - Types */}
//               <div className="text-xs">(3.1)</div>
//               <div className="text-xs">
//                 <span className="font-bold">Offence Type</span> &nbsp;
//                 <span className="leading-relaxed">
//                   {offence.types
//                     ? offence.types.filter(Boolean).join(", ")
//                     : "N/A"}
//                 </span>
//                 {/* References List */}
//                 <div className="flex mt-1">
//                   <span className="font-bold mr-2 whitespace-nowrap">
//                     Ref :-
//                   </span>
//                   <div className="flex flex-col gap-1 w-full">
//                     {offence.refs && offence.refs.length > 0 ? (
//                       offence.refs.map((ref, i) => (
//                         <div className="flex" key={i}>
//                           <span className="mr-2 min-w-[20px]">{`${i + 1}.`}</span>
//                           <span className="leading-tight">{ref}</span>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="flex">
//                         <span className="mr-2">(i.)</span>
//                         <span>N/A</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* 3.2 - Description */}
//               <div className="text-xs">(3.2)</div>
//               <div className="text-xs text-justify leading-relaxed">
//                 {offence.description}
//               </div>
//             </div>
//           </div>

//           {/* Signatures */}
//           <div className="flex justify-between items-start mb-8 gap-4">
//             {/* Witness Signature */}
//             <div className="">
//               {" "}
//               {}
//               <div className="flex items-end mb-2">
//                 <span className="font-bold text-xs mr-2">Sig of Witness</span>
//                 <div className="border-b border-black w-32"></div>
//               </div>
//               <div className="space-y-1">
//                 <div className="flex">
//                   <span className="font-bold text-xs w-[60px]">Army No.</span>
//                   <span className="text-xs">{witnessSig.armyNo}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="font-bold text-xs w-[60px]">Rank</span>
//                   <span className="text-xs">{witnessSig.rank}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="font-bold text-xs w-[60px]">Name</span>
//                   <span className="text-xs">{witnessSig.name}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="font-bold text-xs w-[60px]">Unit</span>
//                   <span className="text-xs">{witnessSig.unit}</span>
//                 </div>
//               </div>
//             </div>

//             {/* MP Signature */}
//             <div className="">
//               <div className="mb-2">
//                 <span className="font-bold text-xs">Sig of MP JCO/NCO</span>
//               </div>
//               <div className="space-y-1">
//                 <div className="flex">
//                   <span className="font-bold text-xs w-[60px]">Army No.</span>
//                   <span className="text-xs">{mpSig.armyNo}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="font-bold text-xs w-[60px]">Rank</span>
//                   <span className="text-xs">{mpSig.rank}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="font-bold text-xs w-[60px]">Name</span>
//                   <span className="text-xs">{mpSig.name}</span>
//                 </div>
//                 <div className="flex">
//                   <span className="font-bold text-xs w-[60px]">Unit</span>
//                   <span className="text-xs">{mpSig.unit}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Remarks Footer */}
//           <div className="mt-8">
//             <h3 className="text-center font-bold underline mb-4 text-xs">
//               REMARKS OF CO/2IC PROVOST UNIT
//             </h3>
//             {remarks.text && (
//               <p className="text-justify text-xs mb-8 indent-8 leading-relaxed">
//                 {remarks.text}
//               </p>
//             )}

//             <div className="flex flex-col gap-1">
//               <div className="flex">
//                 <span className="font-bold text-xs w-[60px]">Station:</span>
//                 <span className="text-xs">{remarks.station}</span>
//               </div>
//               <div className="flex">
//                 <span className="font-bold text-xs w-[60px]">Dated:</span>
//                 <span className="text-xs">{remarks.dated}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Page 2 Footer */}
//         <div className="text-center absolute bottom-0 left-1/2 -translate-x-1/2 font-bold text-xs mb-8">
//           {" "}
//           RESTRICTED
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MilitaryPoliceReport;




// import React from "react";

// export interface MilitaryPoliceReportProps {
//   reportNo: string;
//   reportDate: string;
//   // We allow either the structured legacy data OR a fully dynamic blocks array for specific sections
//   particulars: {
//     // Legacy structured data (optional if blocks are provided)
//     primary?: PersonDetails;
//     secondary?: PersonDetails;
//     vehicle?: VehicleDetails;

//     // New Dynamic Data Driven Approach
//     blocks?: ParticularsBlock[];
//   };
//   occurrence: {
//     dateOfDuty: string;
//     dutyTime: string;
//     dutyLocation: string;
//     witnessingMps: { name: string; rank: string }[];
//     timeOfOffence: string;
//     locationOfOffence: string;
//     statement: string; // 2.4
//   };
//   offence: {
//     types: string[]; // 3.1
//     refs: string[];
//     description: string; // 3.2
//   };
//   witnessSig: SignatureDetails;
//   mpSig: SignatureDetails;
//   remarks: {
//     text: string;
//     station: string;
//     dated: string;
//   };
//   className?: string;
// }

// export interface ParticularsBlock {
//   index: string; // e.g. "(1.1)", "(1.1.1)"
//   fields: {
//     label: string;
//     value: string;
//     className?: string;
//     labelWidth?: string;
//   }[];
//   type?: "person" | "vehicle" | "other";
// }

// interface PersonDetails {
//   aadharCardNo: string;
//   name: string;
//   so: string;
//   relation: string;
//   armyNo: string;
//   rank: string;
//   unit: string;
//   command: string;
//   fmn: string;
//   address: string;
//   iCardNo: string;
//   driverType?: string;
// }

// interface VehicleDetails {
//   baNo: string;
//   makeAndTake: string;
//   vehicleNumber: string;
// }

// interface SignatureDetails {
//   armyNo: string;
//   rank: string;
//   name: string;
//   unit: string;
// }

// const DataField = ({
//   label,
//   value,
//   className = "",
//   labelWidth = "w-[120px]",
// }: {
//   label: React.ReactNode;
//   value?: string;
//   className?: string;
//   labelWidth?: string;
// }) => {
//   const safeValue = value && typeof value === "string" ? value.trim() : value;
//   if (!safeValue || safeValue === "N/A" || safeValue === "") return null;

//   return (
//     <div className={`flex items-start ${className}`}>
//       <span className={`font-bold text-xs ${labelWidth} flex-shrink-0`}>
//         {label}
//       </span>
//       <span className="text-xs break-words flex-1">{safeValue}</span>
//     </div>
//   );
// };
// const hasContent = (val?: any) => {
//   if (val === null || val === undefined) return false;

//   const str = String(val);

//   return str !== "N/A" && str.trim() !== "";
// };

// const hasAnyContent = (obj: any, keys: string[]) => {
//   if (!obj) return false;
//   return keys.some((key) => hasContent(obj[key]));
// };
// const hasArrayContent = (arr?: string[]) =>
//   arr && arr.length > 0 && arr.some((item) => hasContent(item));

// // Helper to normalize legacy props into dynamic blocks
// export const normalizeParticulars = (
//   particulars: MilitaryPoliceReportProps["particulars"],
// ): ParticularsBlock[] => {
//   if (particulars.blocks && particulars.blocks.length > 0) {
//     return particulars.blocks;
//   }

//   const blocks: ParticularsBlock[] = [];
//   const p = particulars.primary;
//   const s = particulars.secondary;
//   const v = particulars.vehicle;
//   const gridItemClass = "w-[calc(50%-1rem)]";

//   let sectionCounter = 1;

//   const processPerson = (person: any, isPrimary: boolean) => {
//     if (!person) return;

//     const hasAadhar = hasContent(person.aadharCardNo);
//     const hasArmyNo = hasContent(person.armyNo);
//     const isDependent = hasAadhar && hasArmyNo;

//     // Determine effective type
//     let type = person.driverType;
//     if (!type) {
//       if (hasArmyNo && !hasAadhar) type = "Military Person";
//       else type = "Civilian";
//     }

//     const currentIndex = `(1.${sectionCounter})`;

//     // --- LOGIC BY TYPE ---

//     if (type === "Shop Keeper") {
//       // Shop Keeper: Address primarily
//       const fields = [{ label: "Address", value: person.address }];
//       if (hasAnyContent(person, ["address"])) {
//         blocks.push({
//           index: currentIndex,
//           fields: fields.map((f) => ({
//             ...f,
//             className: gridItemClass,
//             labelWidth: "w-[100px]",
//           })),
//         });
//       }
//       sectionCounter++;
//     } else if (type === "Military Person") {
//       // Military Person
//       const armyLabel = isPrimary ? "DD veh rider no." : "Army No.";
//       const fields = [
//         { label: armyLabel, value: person.armyNo },
//         { label: "Rank", value: person.rank },
//         { label: "Name", value: person.name },
//         { label: "Unit", value: person.unit },
//         { label: "FMN", value: person.fmn },
//         { label: "Command", value: person.command },
//         { label: "Address", value: person.address },
//         { label: "I Card No.", value: person.iCardNo },
//       ];

//       if (hasAnyContent(person, ["armyNo"])) {
//         blocks.push({
//           index: currentIndex,
//           fields: fields.map((f) => ({
//             ...f,
//             className: gridItemClass,
//             labelWidth: "w-[130px]",
//           })), // labelWidth slightly larger for "DD veh rider no."
//         });
//       }
//       sectionCounter++;
//     } else if (
//       ["Employee", "Servant/Maid", "Temporary Hired Worker"].includes(type)
//     ) {
//       // Other Workers: Name, Address, Aadhar (Civ Subset)
//       const fields = [
//         { label: "Name", value: person.name },
//         { label: "Address", value: person.address },
//         { label: "Aadhar No.", value: person.aadharCardNo },
//         // Include other stats if available
//         { label: "S/O", value: person.so },
//       ];

//       if (hasAnyContent(person, ["name", "address", "aadharCardNo"])) {
//         blocks.push({
//           index: currentIndex,
//           fields: fields.map((f) => ({
//             ...f,
//             className: gridItemClass,
//             labelWidth: "w-[100px]",
//           })),
//         });
//       }
//       sectionCounter++;
//     } else {
//       // Civilian / Dependent (Default Fallback)
//       if (isDependent) {
//         // Dependent: Split 1.X (Civ) and 1.X.1 (Army)
//         const civFields = [
//           { label: "Aadhar No.", value: person.aadharCardNo },
//           { label: "S/O", value: person.so },
//           { label: isPrimary ? "Driver Name" : "Name", value: person.name },
//           { label: "Name the Relation", value: person.relation },
//         ];

//         if (hasAnyContent(person, ["aadharCardNo", "so", "name", "relation"])) {
//           blocks.push({
//             index: currentIndex,
//             fields: civFields.map((f) => ({
//               ...f,
//               className: gridItemClass,
//               labelWidth: "w-[100px]",
//             })),
//           });
//         }

//         const armyFields = [
//           { label: "Army No.", value: person.armyNo },
//           { label: "Rank", value: person.rank },
//           { label: "Name", value: person.name },
//           { label: "Unit", value: person.unit },
//           { label: "FMN", value: person.fmn },
//           { label: "Command", value: person.command },
//           { label: "Address", value: person.address },
//           { label: "I Card No.", value: person.iCardNo },
//         ];

//         if (hasAnyContent(person, ["armyNo"])) {
//           blocks.push({
//             index: `(1.${sectionCounter}.1)`,
//             fields: armyFields.map((f) => ({
//               ...f,
//               className: gridItemClass,
//               labelWidth: "w-[100px]",
//             })),
//           });
//         }
//         sectionCounter++;
//       } else {
//         // Pure Civilian
//         const fields = [
//           { label: "Aadhar No.", value: person.aadharCardNo },
//           { label: "S/O", value: person.so },
//           { label: isPrimary ? "Driver Name" : "Name", value: person.name },
//           { label: "Name the Relation", value: person.relation },
//           { label: "Address", value: person.address },
//         ];
//         if (
//           hasAnyContent(person, [
//             "aadharCardNo",
//             "so",
//             "name",
//             "relation",
//             "address",
//           ])
//         ) {
//           blocks.push({
//             index: currentIndex,
//             fields: fields.map((f) => ({
//               ...f,
//               className: gridItemClass,
//               labelWidth: "w-[100px]",
//             })),
//           });
//         }
//         sectionCounter++;
//       }
//     }
//   };

//   processPerson(p, true);
//   processPerson(s, false);

//   // --- Vehicle ---
//   if (v) {
//     const currentIndex = `(1.${sectionCounter})`;
//     const vehFields = [
//       { label: "DD Veh. BA No.", value: v.baNo },
//       { label: "Make & Take", value: v.makeAndTake },
//     ];
//     if (hasAnyContent(v, ["baNo", "makeAndTake"])) {
//       blocks.push({
//         index: currentIndex,
//         fields: vehFields.map((f) => ({
//           ...f,
//           className: gridItemClass,
//           labelWidth: "w-[100px]",
//         })),
//       });
//     }
//     sectionCounter++;
//   }

//   return blocks;
// };

// const MilitaryPoliceReport: React.FC<MilitaryPoliceReportProps> = (props) => {
//   const {
//     reportNo,
//     reportDate,
//     particulars, // Now processed via normalizeParticulars
//     occurrence,
//     offence,
//     witnessSig,
//     mpSig,
//     remarks,
//     className,
//   } = props;

//   const gridItemClass = "w-[calc(50%-1rem)]";

//   // Calculate Blocks
//   const particularBlocks = normalizeParticulars(particulars);
//   const showSection1 = particularBlocks.length > 0;

//   // 2. Occurrence Logic
//   const show2_1 = hasAnyContent(occurrence, [
//     "dateOfDuty",
//     "dutyTime",
//     "dutyLocation",
//   ]);
//   const show2_2 =
//     occurrence.witnessingMps && occurrence.witnessingMps.length > 0;
//   const show2_3 = hasAnyContent(occurrence, [
//     "timeOfOffence",
//     "locationOfOffence",
//   ]);
//   const show2_4 = hasContent(occurrence.statement);
//   const showSection2 = show2_1 || show2_2 || show2_3 || show2_4;

//   // 3. Offence Logic
//   const show3_1 =
//     hasArrayContent(offence.types) || hasArrayContent(offence.refs);
//   const show3_2 = hasContent(offence.description);
//   const showSection3 = show3_1 || show3_2;

//   return (
//     <div
//       id="mp-report"
//       className={`font-[Arial] text-[#0A0A0A] flex flex-col items-center print:block ${className || ""}`}
//     >
//       {/* ==================== SINGLE CONTINUOUS PAGE ==================== */}
//       <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] shadow-lg print:shadow-none relative flex flex-col print:p-[48px]">
//         {/* Header */}
//         <div className="flex flex-col mb-8 relative">
//           <div className="absolute top-0 right-0 font-bold text-xs underline">
//             In Lieu Of IAFP-1479
//           </div>

//           <div className="mt-6 mb-6 text-center">
//             <h1 className="font-bold text-sm text-[#0A0A0A] uppercase">
//               MILITARY POLICE REPORT
//             </h1>
//             <h1 className="font-bold text-sm text-[#0A0A0A] uppercase">
//               (GEN AND TRAFFIC OFFENCE)
//             </h1>
//           </div>

//           <div className="flex justify-between items-end text-xs font-bold">
//             <div>
//               Report No- <span className="font-normal">{reportNo}</span>
//             </div>
//             <div>
//               Report Date- <span className="font-normal">{reportDate}</span>
//             </div>
//           </div>
//         </div>

//         {/* 1. PARTICULARS - DYNAMIC RENDERING */}
//         {showSection1 && (
//           <div className="mb-6">
//             <h2 className="font-bold text-xs mb-4">
//               1. &nbsp;&nbsp; <span className="underline">PARTICULARS:</span>
//             </h2>

//             <div className="border border-gray-300 p-4">
//               {particularBlocks.map((block, index) => (
//                 <React.Fragment key={index}>
//                   {index > 0 && (
//                     <div className="border-t border-gray-300 my-4"></div>
//                   )}
//                   <div className="flex gap-4">
//                     <div className="text-xs font-bold w-[30px] flex-shrink-0">
//                       {block.index}
//                     </div>
//                     <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2 content-start">
//                       {block.fields.map((field, fIndex) => (
//                         <DataField
//                           key={fIndex}
//                           label={field.label}
//                           value={field.value}
//                           labelWidth={field.labelWidth || "w-[100px]"}
//                           className={field.className || gridItemClass}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* 2. STATEMENT OF EVIDENCE/OCCURRENCE */}
//         {showSection2 && (
//           <div className="mb-6">
//             <h2 className="font-bold text-xs mb-4">
//               2. &nbsp;&nbsp;{" "}
//               <span className="underline">
//                 STATEMENT OF EVIDENCE/OCCURRENCE:
//               </span>
//             </h2>

//             <div className="border border-gray-300 p-4 mb-6">
//               {/* 2.1 */}
//               {show2_1 && (
//                 <div className="flex gap-4 mb-3 border-b border-gray-100 pb-2">
//                   <div className="text-xs font-bold w-[30px] flex-shrink-0">
//                     (2.1)
//                   </div>
//                   <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2 content-start">
//                     <DataField
//                       label="Date of Duty"
//                       value={occurrence.dateOfDuty}
//                       labelWidth="w-[90px]"
//                       className={gridItemClass}
//                     />
//                     <DataField
//                       label="Duty Time"
//                       value={occurrence.dutyTime}
//                       labelWidth="w-[70px]"
//                       className={gridItemClass}
//                     />
//                     <DataField
//                       label="Duty Location"
//                       value={occurrence.dutyLocation}
//                       labelWidth="w-[90px]"
//                       className={gridItemClass}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* 2.2 - Witnesses */}
//               {show2_2 &&
//                 occurrence.witnessingMps.map((mp, index) => (
//                   <div
//                     key={index}
//                     className="flex gap-4 mb-3 border-b border-gray-100 pb-2 last:border-0 last:pb-0"
//                   >
//                     <div className="text-xs font-bold w-[30px] flex-shrink-0">
//                       {index === 0 ? "(2.2)" : `(2.2.${index})`}
//                     </div>
//                     <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2 content-start items-center">
//                       <DataField
//                         label="Name of MP Witnessing"
//                         value={mp.name}
//                         labelWidth="w-[130px]"
//                         className="flex-grow min-w-[50%]"
//                       />
//                       <DataField
//                         label="Rank"
//                         value={mp.rank}
//                         labelWidth="w-[50px]"
//                         className="w-[150px]"
//                       />
//                     </div>
//                   </div>
//                 ))}

//               {/* 2.3 - Time/Location of Offence */}
//               {show2_3 && (
//                 <div className="border-t border-gray-100 pt-2 flex gap-4">
//                   <div className="text-xs font-bold w-[30px] flex-shrink-0">
//                     (2.3)
//                   </div>
//                   <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2 content-start">
//                     <DataField
//                       label="Time of Offence"
//                       value={occurrence.timeOfOffence}
//                       labelWidth="w-[90px]"
//                       className={gridItemClass}
//                     />
//                     <DataField
//                       label="Location of Offence"
//                       value={occurrence.locationOfOffence}
//                       labelWidth="w-[110px]"
//                       className={gridItemClass}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* 2.4 Statement/Narrative */}
//             {show2_4 && (
//               <div className="flex gap-4 mb-4">
//                 <div className="text-xs min-w-[30px] font-bold">(2.4)</div>
//                 <div className="text-xs text-justify leading-relaxed whitespace-pre-line">
//                   {occurrence.statement}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* 3. OFFENCE COMMITTED */}
//         {showSection3 && (
//           <div className="mb-0 pl-0">
//             <h2 className="font-bold text-xs mb-4">
//               3. &nbsp;&nbsp;{" "}
//               <span className="underline">
//                 OFFENCE COMMITTED/ORDERS CONTRAVENED:
//               </span>
//             </h2>

//             <div className="grid grid-cols-[40px_1fr] gap-y-2 mb-4">
//               {/* 3.1 - Types & Refs */}
//               {show3_1 && (
//                 <>
//                   <div className="text-xs">(3.1)</div>
//                   <div className="text-xs">
//                     {hasArrayContent(offence.types) && (
//                       <DataField
//                         label="Offence Type"
//                         value={offence.types.filter(Boolean).join(", ")}
//                         labelWidth="w-[80px]"
//                         className="mb-2"
//                       />
//                     )}

//                     {/* References List */}
//                     {hasArrayContent(offence.refs) && (
//                       <div className="flex mt-1">
//                         <span className="font-bold mr-2 whitespace-nowrap">
//                           Ref :-
//                         </span>
//                         <div className="flex flex-col gap-1 w-full">
//                           {offence.refs.map((ref, i) => (
//                             <div className="flex" key={i}>
//                               <span className="mr-2 min-w-[20px]">{`(${["i", "ii", "iii", "iv", "v"][i] || i + 1}.)`}</span>
//                               <span className="leading-tight">{ref}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* 3.2 - Description */}
//               {show3_2 && (
//                 <>
//                   <div className="text-xs">(3.2)</div>
//                   <div className="text-xs text-justify leading-relaxed">
//                     {offence.description}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {/* 4. WITNESS / Signatures */}
//         <div className="mb-0 text-sm mt-8">
//           <div className="flex justify-between items-start px-0">
//             {/* Witness Signature */}
//             <div className="w-fit">
//               <div className="flex items-end mb-4">
//                 <span className="font-bold text-xs mr-2 whitespace-nowrap">
//                   Sig of Witness
//                 </span>
//                 <div className="border-b border-black w-32"></div>
//               </div>
//               <div className="space-y-1">
//                 <DataField
//                   label="Army No."
//                   value={witnessSig.armyNo}
//                   labelWidth="w-[60px]"
//                 />
//                 <DataField
//                   label="Rank"
//                   value={witnessSig.rank}
//                   labelWidth="w-[60px]"
//                 />
//                 <DataField
//                   label="Name"
//                   value={witnessSig.name}
//                   labelWidth="w-[60px]"
//                 />
//                 <DataField
//                   label="Unit"
//                   value={witnessSig.unit}
//                   labelWidth="w-[60px]"
//                 />
//               </div>
//             </div>

//             {/* MP Signature */}
//             <div className="w-fit">
//               <div className="mb-4">
//                 <span className="font-bold text-xs">Sig of MP JCO/NCO</span>
//               </div>
//               <div className="space-y-1">
//                 <DataField
//                   label="Army No."
//                   value={mpSig.armyNo}
//                   labelWidth="w-[60px]"
//                 />
//                 <DataField
//                   label="Rank"
//                   value={mpSig.rank}
//                   labelWidth="w-[60px]"
//                 />
//                 <DataField
//                   label="Name"
//                   value={mpSig.name}
//                   labelWidth="w-[60px]"
//                 />
//                 <DataField
//                   label="Unit"
//                   value={mpSig.unit}
//                   labelWidth="w-[60px]"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Remarks Footer */}
//         <div className="mt-12 mb-8">
//           <h3 className="text-center font-bold underline mb-4 text-xs">
//             REMARKS OF CO/2IC PROVOST UNIT
//           </h3>
//           {remarks.text && (
//             <p className="text-justify text-xs mb-8 indent-8 leading-relaxed">
//               {remarks.text}
//             </p>
//           )}

//           <div className="flex flex-col gap-1">
//             <DataField
//               label="Station:"
//               value={remarks.station}
//               labelWidth="w-[60px]"
//             />
//             <DataField
//               label="Dated:"
//               value={remarks.dated}
//               labelWidth="w-[60px]"
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center font-bold text-xs mt-8">RESTRICTED</div>
//       </div>
//     </div>
//   );
// };

// export default MilitaryPoliceReport;





import React from "react";

/* ================= TYPES ================= */

export interface MilitaryPoliceReportProps {
  reportNo: string;
  reportDate: string;
  particulars: {
    primary?: PersonDetails;
    secondary?: PersonDetails;
    vehicle?: VehicleDetails;
    blocks?: ParticularsBlock[];
  };
  occurrence: {
    dateOfDuty: string;
    dutyTime: string;
    dutyLocation: string;
    witnessingMps: { name: string; rank: string }[];
    timeOfOffence: string;
    locationOfOffence: string;
    statement: string;
  };
  offence: {
    types: any[];
    refs: any[];
    description: string;
  };
  witnessSig: SignatureDetails;
  mpSig: SignatureDetails;
  remarks: {
    text: string;
    station: string;
    dated: string;
  };
  className?: string;
}

export interface ParticularsBlock {
  index: string;
  fields: {
    label: string;
    value: string;
    className?: string;
    labelWidth?: string;
  }[];
}

interface PersonDetails {
  aadharCardNo: string;
  name: string;
  so: string;
  relation: string;
  armyNo: string;
  rank: string;
  unit: string;
  command: string;
  fmn: string;
  address: string;
  iCardNo: string;
  driverType?: string;
}

interface VehicleDetails {
  baNo: string;
  makeAndTake: string;
  vehicleNumber: string;
}

interface SignatureDetails {
  armyNo: string;
  rank: string;
  name: string;
  unit: string;
}

/* ================= SAFE HELPERS ================= */

const normalizeValue = (val: any): string => {
  if (val === null || val === undefined) return "";

  if (typeof val === "object") {
    return val.reference || val.offenceType || val.name || "";
  }

  return String(val);
};

const normalizeArray = (arr?: any[]): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeValue).filter(Boolean);
};

const hasContent = (val?: any) => {
  const str = normalizeValue(val);
  return str !== "" && str !== "N/A";
};

const hasArrayContent = (arr?: any[]) => {
  if (!Array.isArray(arr)) return false;
  return arr.some((item) => hasContent(item));
};

const hasAnyContent = (obj: any, keys: string[]) => {
  if (!obj) return false;
  return keys.some((key) => hasContent(obj[key]));
};

/* ================= DATA FIELD ================= */

const DataField = ({
  label,
  value,
  className = "",
  labelWidth = "w-[120px]",
}: {
  label: React.ReactNode;
  value?: any;
  className?: string;
  labelWidth?: string;
}) => {
  const safeValue = normalizeValue(value).trim();

  if (!safeValue || safeValue === "N/A") return null;

  return (
    <div className={`flex items-start ${className}`}>
      <span className={`font-bold text-xs ${labelWidth} flex-shrink-0`}>
        {label}
      </span>
      <span className="text-xs break-words flex-1">{safeValue}</span>
    </div>
  );
};

/* ================= PARTICULARS NORMALIZER ================= */

export const normalizeParticulars = (
  particulars: MilitaryPoliceReportProps["particulars"],
): ParticularsBlock[] => {
  if (particulars.blocks && particulars.blocks.length > 0) {
    return particulars.blocks;
  }

  const blocks: ParticularsBlock[] = [];
  const p = particulars.primary;
  const s = particulars.secondary;
  const v = particulars.vehicle;

  let sectionCounter = 1;

  const pushPerson = (person: any) => {
    if (!person) return;

    const index = `(1.${sectionCounter})`;

    const fields = [
      { label: "Army No.", value: person.armyNo },
      { label: "Rank", value: person.rank },
      { label: "Name", value: person.name },
      { label: "Unit", value: person.unit },
      { label: "Address", value: person.address },
    ];

    if (hasAnyContent(person, ["armyNo", "name", "address"])) {
      blocks.push({
        index,
        fields,
      });
      sectionCounter++;
    }
  };

  pushPerson(p);
  pushPerson(s);

  if (v && hasAnyContent(v, ["baNo", "makeAndTake"])) {
    blocks.push({
      index: `(1.${sectionCounter})`,
      fields: [
        { label: "BA No.", value: v.baNo },
        { label: "Make & Type", value: v.makeAndTake },
      ],
    });
  }

  return blocks;
};

/* ================= MAIN COMPONENT ================= */

const MilitaryPoliceReport: React.FC<MilitaryPoliceReportProps> = (props) => {
  const {
    reportNo,
    reportDate,
    particulars,
    occurrence,
    offence,
    witnessSig,
    mpSig,
    remarks,
    className,
  } = props;

  /* 🔥 SAFE NORMALIZATION FOR TRAFFIC OBJECTS */
  const safeTypes = normalizeArray(offence.types);
  const safeRefs = normalizeArray(offence.refs);

  const particularBlocks = normalizeParticulars(particulars);
  const showSection1 = particularBlocks.length > 0;

  const show2_1 = hasAnyContent(occurrence, [
    "dateOfDuty",
    "dutyTime",
    "dutyLocation",
  ]);

  const show2_2 =
    Array.isArray(occurrence.witnessingMps) &&
    occurrence.witnessingMps.length > 0;

  const show2_3 = hasAnyContent(occurrence, [
    "timeOfOffence",
    "locationOfOffence",
  ]);

  const show2_4 = hasContent(occurrence.statement);

  const showSection2 = show2_1 || show2_2 || show2_3 || show2_4;

  const show3_1 =
    hasArrayContent(safeTypes) || hasArrayContent(safeRefs);

  const show3_2 = hasContent(offence.description);

  const showSection3 = show3_1 || show3_2;

  const gridItemClass = "w-[calc(50%-1rem)]";

  return (
    <div
      id="mp-report"
      className={`font-[Arial] text-[#0A0A0A] flex flex-col items-center print:block ${className || ""}`}
    >
      <div className="max-w-[210mm] w-full mx-auto bg-white p-[48px] shadow-lg print:shadow-none relative flex flex-col">

        {/* HEADER */}
        <div className="flex flex-col mb-8 relative">
          <div className="absolute top-0 right-0 font-bold text-xs underline">
            In Lieu Of IAFP-1479
          </div>

          <div className="mt-6 mb-6 text-center">
            <h1 className="font-bold text-sm uppercase">
              MILITARY POLICE REPORT
            </h1>
            <h1 className="font-bold text-sm uppercase">
              (GEN AND TRAFFIC OFFENCE)
            </h1>
          </div>

          <div className="flex justify-between items-end text-xs font-bold">
            <div>
              Report No- <span className="font-normal">{reportNo}</span>
            </div>
            <div>
              Report Date- <span className="font-normal">{reportDate}</span>
            </div>
          </div>
        </div>

        {/* SECTION 1 */}
        {showSection1 && (
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-4">
              1. <span className="underline">PARTICULARS:</span>
            </h2>

            <div className="border border-gray-300 p-4">
              {particularBlocks.map((block, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div className="border-t border-gray-300 my-4"></div>
                  )}
                  <div className="flex gap-4">
                    <div className="text-xs font-bold w-[30px]">
                      {block.index}
                    </div>
                    <div className="flex-1 flex flex-wrap gap-x-8 gap-y-2">
                      {block.fields.map((field, fIndex) => (
                        <DataField
                          key={fIndex}
                          label={field.label}
                          value={field.value}
                          className={gridItemClass}
                        />
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2 */}
        {showSection2 && (
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-4">
              2. <span className="underline">STATEMENT OF EVIDENCE/OCCURRENCE:</span>
            </h2>

            {show2_1 && (
              <div className="flex gap-4 mb-3">
                <div className="text-xs font-bold">(2.1)</div>
                <div className="flex flex-wrap gap-x-8">
                  <DataField label="Date of Duty" value={occurrence.dateOfDuty} />
                  <DataField label="Duty Time" value={occurrence.dutyTime} />
                  <DataField label="Duty Location" value={occurrence.dutyLocation} />
                </div>
              </div>
            )}

            {show2_2 &&
              occurrence.witnessingMps.map((mp, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <div className="text-xs font-bold">
                    {index === 0 ? "(2.2)" : `(2.2.${index})`}
                  </div>
                  <div className="flex gap-6">
                    <DataField label="Name" value={mp.name} />
                    <DataField label="Rank" value={mp.rank} />
                  </div>
                </div>
              ))}

            {show2_3 && (
              <div className="flex gap-4">
                <div className="text-xs font-bold">(2.3)</div>
                <div className="flex gap-6">
                  <DataField label="Time" value={occurrence.timeOfOffence} />
                  <DataField label="Location" value={occurrence.locationOfOffence} />
                </div>
              </div>
            )}

            {show2_4 && (
              <div className="mt-3 text-xs whitespace-pre-line">
                {normalizeValue(occurrence.statement)}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3 */}
        {showSection3 && (
          <div className="mb-6">
            <h2 className="font-bold text-xs mb-4">
              3. <span className="underline">OFFENCE COMMITTED:</span>
            </h2>

            {hasArrayContent(safeTypes) && (
              <DataField
                label="Offence Type"
                value={safeTypes.join(", ")}
              />
            )}

            {hasArrayContent(safeRefs) && (
              <div className="mt-2 text-xs">
                <b>Ref :-</b>
                {safeRefs.map((ref, i) => (
                  <div key={i}>{ref}</div>
                ))}
              </div>
            )}

            {show3_2 && (
              <div className="mt-2 text-xs">
                {normalizeValue(offence.description)}
              </div>
            )}
          </div>
        )}

        {/* SIGNATURES */}
        <div className="flex justify-between mt-8 text-xs">
          <div>
            <b>Witness</b>
            <DataField label="Army No." value={witnessSig.armyNo} />
            <DataField label="Rank" value={witnessSig.rank} />
            <DataField label="Name" value={witnessSig.name} />
            <DataField label="Unit" value={witnessSig.unit} />
          </div>

          <div>
            <b>MP</b>
            <DataField label="Army No." value={mpSig.armyNo} />
            <DataField label="Rank" value={mpSig.rank} />
            <DataField label="Name" value={mpSig.name} />
            <DataField label="Unit" value={mpSig.unit} />
          </div>
        </div>

        {/* REMARKS */}
        <div className="mt-10 text-xs">
          <h3 className="text-center font-bold underline mb-2">
            REMARKS OF CO/2IC PROVOST UNIT
          </h3>

          {hasContent(remarks.text) && (
            <p className="mb-4">{normalizeValue(remarks.text)}</p>
          )}

          <DataField label="Station:" value={remarks.station} />
          <DataField label="Dated:" value={remarks.dated} />
        </div>

        <div className="text-center font-bold text-xs mt-8">RESTRICTED</div>
      </div>
    </div>
  );
};

export default MilitaryPoliceReport;
