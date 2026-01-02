/**
 * Map form data to backend schema structure
 * Converts UI-label-based data to API-compliant payload
 */

// 🔹 LABEL → SCHEMA KEY MAP
const LABEL_KEY_MAP: Record<string, string> = {
  "Army Rider / Driver Number": "armyNumber",
  "Army Number": "armyNumber",
  "Name": "name",
  "Select Rank": "rank",
  "Rank": "rank",
  "Unit": "unit",
  "FMN": "fmn",
  "Command": "command",
  "ID Card Number": "iCardNumber",
  "I Card Number": "iCardNumber",
  "Aadhar Card Number": "aadharNumber",
  "Mobile Number": "phone",
  "Employee ID": "employeeId",
  "Department": "department",
  "Address": "address",
};

// 🔹 Normalize object keys (LABEL → KEY)
function normalizeDetails(details: any = {}) {
  const normalized: any = {};

  Object.entries(details).forEach(([key, value]) => {
    if (!value) return;

    if (key === "coDriver") {
      normalized.coDriver = normalizeDetails(value);
      return;
    }

    const mappedKey = LABEL_KEY_MAP[key] || key;
    normalized[mappedKey] = value;
  });

  return normalized;
}

/**
 * MAIN MAPPER
 */
export function mapMTAccidentPayload(formData: any) {
  console.log("📥 mapMTAccidentPayload input:", formData);

  let {
    individualType,
    individualDetails,
    driverType,
    driverDetails,
    unit,
    fmn,
    dateOfAccident,
    timeOfAccident,
    placeOfAccident,
    typeOfAccident,
    probableCause,
    vehicleNumber,
    makeAndModel,
    injuredCivil = 0,
    injuredMilitary = 0,
    diedCivil = 0,
    diedMilitary = 0,
    firCaseNumber,
    firDate,
    firPoliceStation,
    actionStatus = false,
    remark,
  } = formData;

  // 🔹 Normalize legacy naming
  if (individualType === "Military Person") {
    individualType = "Military Personnel";
  }

  // 🔹 Normalize details
  const normalizedIndividualDetails = normalizeDetails(individualDetails);
  const normalizedDriverDetails = normalizeDetails(driverDetails);
  const normalizedCoDriver = normalizeDetails(driverDetails?.coDriver);

  // 🔹 Resolve driver type SAFELY
  const resolvedDriverType =
    driverType || individualType || "Driver";

  // 🔹 BUILD OFFENDERS ARRAY (AUTHORITATIVE SOURCE)
  const offenders: any[] = [];

  if (Object.keys(normalizedDriverDetails).length > 0) {
    offenders.push({
      offenderType: resolvedDriverType,
      offenderDetails: normalizedDriverDetails,
      category: "Driver",
    });
  }

  if (Object.keys(normalizedCoDriver).length > 0) {
    offenders.push({
      offenderType: "Co-Driver",
      offenderDetails: normalizedCoDriver,
      category: "Co-Driver",
    });
  }

  console.log("✅ FINAL offenders array:", offenders);

  return {
    // Individual
    individualType,
    individualDetails: normalizedIndividualDetails,

    // Driver / Co-Driver
    driverDetails: normalizedDriverDetails,
    coDriverDetails: normalizedCoDriver,
    offenders, // ✅ ALWAYS USE THIS

    // Unit
    unit: unit || "",
    fmn: fmn || "",

    // Accident
    dateOfAccident: dateOfAccident ? new Date(dateOfAccident) : null,
    timeOfAccident: timeOfAccident || "",
    placeOfAccident: placeOfAccident || "",
    typeOfAccident: typeOfAccident || "",
    probableCause: probableCause || "",

    // Vehicle
    vehicleNumber: vehicleNumber || "",
    makeAndModel: makeAndModel || "",

    // Casualties
    injuredCivil: Number(injuredCivil) || 0,
    injuredMilitary: Number(injuredMilitary) || 0,
    diedCivil: Number(diedCivil) || 0,
    diedMilitary: Number(diedMilitary) || 0,

    // FIR
    firCaseNumber: firCaseNumber || "",
    firDate: firDate ? new Date(firDate) : null,
    firPoliceStation: firPoliceStation || "",

    // Action
    actionStatus: Boolean(actionStatus),
    remark: remark || "",
  };
}

/**
 * Clean payload – removes null / undefined (keeps empty strings)
 */
export function cleanPayload(payload: any) {
  return Object.entries(payload).reduce((acc: any, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
