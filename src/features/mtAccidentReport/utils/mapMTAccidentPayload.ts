/**
 * Map form data to backend schema structure
 * Converts form-specific format to API-compliant payload
 */
export function mapMTAccidentPayload(formData: any) {
  // Extract core fields
  let {
    individualType,
    individualDetails,
    driverType,
    driverDetails,
    offenders,
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

  // Normalize individualType - handle legacy "Military Person" → "Military Personnel"
  if (individualType === "Military Person") {
    individualType = "Military Personnel";
  }

  // Build offenders array from driver details
  const offendersArray = [];
  if (driverDetails && Object.keys(driverDetails).length > 0) {
    offendersArray.push({
      offenderType: driverType || "Unknown",
      offenderDetails: driverDetails,
      category: "Driver",
    });

    // Include co-driver if present
    if (driverDetails.coDriver && Object.keys(driverDetails.coDriver).length > 0) {
      offendersArray.push({
        offenderType: driverDetails.coDriver.type || "Unknown",
        offenderDetails: driverDetails.coDriver,
        category: "Co-Driver",
      });
    }
  }

  return {
    // Individual Details
    individualType: individualType || null,
    individualDetails: individualDetails || {},
    driverDetails: driverDetails || {},
    coDriverDetails: driverDetails?.coDriver || {},
    offenders: offendersArray.length > 0 ? offendersArray : (Array.isArray(offenders) ? offenders : []),
    unit: unit || "",
    fmn: fmn || "",

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
