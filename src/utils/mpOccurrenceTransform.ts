// src/utils/mpOccurrenceTransform.ts
// Transforms MP Occurrence report input (JSON import, API responses) to backend/display format

const safe = (val: any, fallback = "") =>
  val !== undefined && val !== null && val !== "" ? val : fallback;

/** Combine date and time into ISO-compatible string */
const formatDateTime = (dateStr: string, timeStr?: string) => {
  if (!dateStr) return undefined;
  try {
    const baseDate = String(dateStr).split("T")[0];
    const timePart = timeStr ? String(timeStr) : "00:00";
    // Keep as date string for consistency with backend (YYYY-MM-DD or YYYY-MM-DDTHH:mm)
    return timeStr ? `${baseDate}T${timePart}` : baseDate;
  } catch {
    return dateStr;
  }
};

/**
 * Maps offenders array to individuals with proper schema (armyNo, rank, customFields.offenderType)
 */
const mapOffendersToIndividuals = (offenders: any[], reportContext?: any) => {
  if (!Array.isArray(offenders)) return [];
  return offenders.map((o: any) => {
    let type = "Military Person";
    if (o.offenderType === "servantMaid") type = "Maid";
    else if (o.offenderType === "civilian") type = "Civilian";
    else if (o.offenderType) type = o.offenderType;
    return {
      role: "Offender",
      name: o.name || o.personName || "Unknown",
      rank: o.rank || o.selectRank || "",
      armyNo: o.armyNumber || o.serviceNumber || o.armyNo,
      iCardNumber: o["I Card Number"] || o.iCardNumber || o["Pass ID"] || o.passNo || o.icard,
      unit: o.unit || o.unitName,
      fmn: o.fmn || o.fmnName,
      command: o.command || reportContext?.command,
      address: o.address || o["Place of QTR."],
      trade: o.Trade,
      fatherName: o.fatherName,
      caste: o.caste,
      age: o.age,
      customFields: { offenderType: type },
    };
  });
};

/**
 * Maps existing individuals (e.g. re-import) to normalized structure
 */
const mapExistingIndividuals = (individuals: any[]) => {
  if (!Array.isArray(individuals) || individuals.length === 0) return null;
  return individuals.map((ind: any) => ({
    role: ind.role || "Offender",
    name: ind.name || ind.personName || "Unknown",
    rank: ind.rank || ind.selectRank || "",
    armyNo: ind.armyNo || ind.armyNumber || ind.serviceNumber,
    iCardNumber: ind.iCardNumber || ind.icard || ind.passNo,
    unit: ind.unit || ind.unitName,
    fmn: ind.fmn || ind.fmnName,
    address: ind.address,
    customFields: ind.customFields || {},
    ...ind,
  }));
};

/**
 * Transform a single MP occurrence report (from JSON import with { report: {...} } or flat object)
 * to backend payload shape with individuals, customFields, etc.
 */
export const transformMPOccurrenceToBackend = (inputReport: any) => {
  const r = inputReport.report ?? inputReport;

  // Use existing individuals (re-import) or build from offenders
  const existingIndividuals = mapExistingIndividuals(r.individuals);
  const offenderIndividuals =
    existingIndividuals ??
    mapOffendersToIndividuals(r.offenders ?? [], r);

  const victim = {
    role: "Victim",
    name: r.victimName || r.victim?.name || "Unknown",
    age: r.age,
    totalServiceDuration: r.totalServiceDuration,
    unit: r.unit,
    fmn: r.fmn,
    command: r.command,
    address: r.address,
  };

  const allIndividuals = [...offenderIndividuals];
  if (r.age || r.totalServiceDuration || r.unit || r.victimName || r.victim?.name) {
    allIndividuals.push(victim);
  }

  const dateVal = r.dateOfOccurrence;
  const timeVal = r.timeOfOccurrence;
  const timeOfOccurrenceCombined =
    dateVal && timeVal
      ? formatDateTime(dateVal, timeVal) ?? `${dateVal}T${timeVal}`
      : dateVal ?? undefined;

  return {
    reportDetails: {
      reportNumber: safe(r.reportNumber) || safe(r.id) || "Auto-Generated",
      firNumber: safe(r.firNumber) || safe(r.firNo),
      command: safe(r.command),
    },
    investigationHead: {
      name:
        r.investigationHead?.name ??
        r.incidentCoveredBy ??
        r.coordWith ??
        "Imported Report",
      rank: safe(r.investigationHead?.rank) || safe(r.rank),
      armyNumber: safe(r.investigationHead?.armyNumber) || safe(r.armyNo),
      unit: safe(r.investigationHead?.unit) || safe(r.unit),
      fmn: safe(r.investigationHead?.fmn) || safe(r.fmn),
    },
    occurrenceDetails: {
      dateOfOccurrence: dateVal,
      timeOfOccurrence: timeOfOccurrenceCombined ?? dateVal,
      placeOfOccurrence: safe(r.placeOfOccurrence) || safe(r.place),
      offenceType: safe(r.reportHeading) || safe(r.offenceType) || "General Offence",
      description: safe(r.description) || safe(r.brief),
    },
    customFields: {
      vehicleNumber: r.vehicleNumber,
      vehicleType: r.vehicleType,
      vehicleName: r.vehicleName,
      leaveOrDuty: r["leave / duty"] ?? r.leaveOrDuty,
    },
    individuals: allIndividuals,
    rawOffenders: r.offenders,
  };
};

/**
 * Normalize JSON input: supports { reports: [...] }, { data: [...] }, or raw array.
 * Uses transformMPOccurrenceToBackend for items with report wrapper; falls back to mapFn for flat items.
 */
export const normalizeMPOccurrenceJSON = (
  json: any,
  mapFlatItem?: (item: any) => any
): any[] => {
  const transform = (item: any) =>
    item.report != null
      ? transformMPOccurrenceToBackend(item)
      : mapFlatItem?.(item) ?? transformMPOccurrenceToBackend(item);

  if (json?.reports && Array.isArray(json.reports)) {
    return json.reports.map(transform);
  }
  if (Array.isArray(json)) {
    return json.map(transform);
  }
  if (json?.data && Array.isArray(json.data)) {
    return json.data.map(transform);
  }
  return [transformMPOccurrenceToBackend(json)];
};
