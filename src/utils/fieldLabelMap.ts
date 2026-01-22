export const FIELD_LABEL_MAP: Record<string, string> = {
    // Common
    "remarks": "Remarks",
    "reportId": "Report Number",

    // Custom Fields
    "customFields.remarks": "Remarks",
    "customFields.selectedWitness": "Selected Witness",

    // Driver/Vehicle
    "driverType": "Driver Type",
    "isVehicleInvolved": "Is Vehicle Involved?",
    "vehicleDetails.category": "Vehicle Category",
    "vehicleDetails.vehicleCategory": "Vehicle Category",
    "vehicleDetails.vehicleName": "Vehicle Name",
    "vehicleDetails.vehicleNumber": "Vehicle Number",
    "vehicleDetails.vehicleType": "Vehicle Type",

    // Offence Occurrence
    "offenceOccurenceDetails.briefDescription": "Brief Description",
    "offenceOccurenceDetails.description": "Detailed Description",
    "offenceOccurenceDetails.incidentLocation": "Incident Location",
    // "offenceOccurenceDetails.time": "Time",
    "offenceOccurenceDetails.timeOfOffence": "Time of Offence",
    "offenceTypeReference": "Offence Type Reference",
    // Duty Details
    "onDutyDetails.dateOfDuty": "Date of Duty",
    "onDutyDetails.dutyLocation": "Duty Location",
    "onDutyDetails.dutyType": "Duty Type",
    "onDutyDetails.endTime": "Duty End Time",
    "onDutyDetails.startTime": "Duty Start Time",

    // Reporting MP
    "onDutyDetailsMPReporting.armyNumber": "Reporting MP Army No",
    "onDutyDetailsMPReporting.contactNumber": "Reporting MP Contact No",
    "onDutyDetailsMPReporting.nameReportingMP": "Reporting MP Name",
    "onDutyDetailsMPReporting.rank": "Reporting MP Rank",
    "onDutyDetailsMPReporting.unit": "Reporting MP Unit",

    // Witness / Offender
    "selectedWitness": "Selected Witness",
    "offenderWithoutVehicle.offenderType": "Offender Type",
};

export const getFieldLabel = (key: string): string => {
    // 1. Check exact match in map
    if (FIELD_LABEL_MAP[key]) return FIELD_LABEL_MAP[key];

    // 2. Try to format automatically
    // Remove parent objects (e.g. "onDutyDetails.dateOfDuty" -> "dateOfDuty")
    const parts = key.split(".");
    const lastPart = parts[parts.length - 1];

    // Convert camelCase to Title Case (e.g. "dateOfDuty" -> "Date Of Duty")
    const titleCase = lastPart
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
        .trim();

    return titleCase;
};
