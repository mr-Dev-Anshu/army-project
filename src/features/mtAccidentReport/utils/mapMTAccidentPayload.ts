/**
 * Map form data to backend schema structure
 * Converts form-specific format to API-compliant payload
 */
export function mapMTAccidentPayload(formData: any) {
  // Extract core fields
  let {
    individualType,
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

  // Normalize individualType - handle legacy "Military Person" → "Military Personnel"
  if (individualType === "Military Person") {
    individualType = "Military Personnel";
  }

  return {
    // Individual Details
    individualType: individualType || null,

    // Accident Details
    dateOfAccident: dateOfAccident ? new Date(dateOfAccident) : null,
    timeOfAccident: (timeOfAccident && timeOfAccident.trim()) ? timeOfAccident.trim() : "",
    placeOfAccident: placeOfAccident || "",
    typeOfAccident: typeOfAccident || null,
    probableCause: probableCause || "",

    // Vehicle Details
    vehicleNumber: vehicleNumber || "",
    makeAndModel: makeAndModel || "",

    // Casualty Details
    injuredCivil: Number(injuredCivil) || 0,
    injuredMilitary: Number(injuredMilitary) || 0,
    diedCivil: Number(diedCivil) || 0,
    diedMilitary: Number(diedMilitary) || 0,

    // FIR Details
    firCaseNumber: firCaseNumber || "",
    firDate: firDate ? new Date(firDate) : null,
    firPoliceStation: firPoliceStation || "",

    // Action Details
    actionStatus: Boolean(actionStatus),
    remark: remark || "",
  };
}

/**
 * Clean payload - removes null values (but keeps empty strings for validation)
 */
export function cleanPayload(payload: any) {
  return Object.entries(payload).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);
}
