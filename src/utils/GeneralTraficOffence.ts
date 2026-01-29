// /**
//  * Validates imported traffic offence data against the General Traffic Offence schema.
//  * This ensures data integrity before sending to the API.
//  * 
//  * @param data - The array of records to validate
//  * @returns Object containing validity status and array of error messages
//  */
// export function validateTrafficOffenceData(data: any[]): { isValid: boolean; errors: string[] } {
//   const errors: string[] = [];

//   if (!Array.isArray(data)) {
//     return { isValid: false, errors: ["Imported data must be an array of records."] };
//   }

//   data.forEach((record, index) => {
//     const row = index + 1;
//     const missing: string[] = [];
//     const invalid: string[] = [];

//     // --- SCHEMA VALIDATION RULES ---
    
//     // 1. Check for Offence Type (Essential)
//     if (!record.offenceType && !record.currentOffenceType) {
//       missing.push("offenceType");
//     }

//     // 2. Check for Offence Occurrence Details
//     if (!record.offenceOccurenceDetails) {
//       missing.push("offenceOccurenceDetails");
//     } else if (typeof record.offenceOccurenceDetails !== "object") {
//       invalid.push("offenceOccurenceDetails must be an object");
//     } else {
//       if (!record.offenceOccurenceDetails.incidentLocation) missing.push("offenceOccurenceDetails.incidentLocation");
//       if (!record.offenceOccurenceDetails.timeOfOffence) missing.push("offenceOccurenceDetails.timeOfOffence");
//     }

//     // 3. Check for On Duty Details
//     if (!record.onDutyDetails) {
//       missing.push("onDutyDetails");
//     } else if (typeof record.onDutyDetails !== "object") {
//       invalid.push("onDutyDetails must be an object");
//     } else {
//       if (!record.onDutyDetails.dateOfDuty) missing.push("onDutyDetails.dateOfDuty");
//       if (!record.onDutyDetails.dutyLocation) missing.push("onDutyDetails.dutyLocation");
//     }

//     // 4. Conditional Checks (Vehicle)
//     const isVehicle = record.isVehicleInvolved === true || String(record.isVehicleInvolved).toLowerCase() === "true";
//     if (isVehicle) {
//       if (!record.vehicleNumber) {
//         missing.push("vehicleNumber (since vehicle is involved)");
//       }
//     }

//     // 5. Offenders Validation
//     if (record.offenders) {
//       if (!Array.isArray(record.offenders)) {
//         invalid.push("offenders must be an array");
//       } else {
//         record.offenders.forEach((offender: any, i: number) => {
//           if (!offender.offenderDetails) {
//             missing.push(`offenders[${i}].offenderDetails`);
//           } else {
//             if (!offender.offenderDetails.name) missing.push(`offenders[${i}].offenderDetails.name`);
//             if (!offender.offenderDetails.armyNumber && !offender.offenderDetails.armyNo) missing.push(`offenders[${i}].offenderDetails.armyNumber`);
//           }
//         });
//       }
//     }

//     if (missing.length > 0) {
//       errors.push(`Row ${row}: Missing required fields: ${missing.join(", ")}`);
//     }
//     if (invalid.length > 0) {
//       errors.push(`Row ${row}: Invalid format: ${invalid.join(", ")}`);
//     }
//   });

//   return { isValid: errors.length === 0, errors };
// }