export function mapMTAccidentPayload(formData: any) {
  const r = formData.mtAccidentReport;

  return {
    /* ===== REQUIRED BY JOI ===== */
    station: "MP Station",

    date: r.dateOfAccident ? new Date(r.dateOfAccident) : new Date(),
    time: r.timeOfAccident || "00:00",
    place: r.placeOfAccident || "NA",

    vehicleNo: r.vehicleNumber || "NA",
    vehicleType: "LMV",
    vehicleMake: r.makeAndModel || "NA",

    /* ===== DRIVER (MUST NOT BE EMPTY) ===== */
    driverName: r.individualDetails?.name || "UNKNOWN",
    driverRank: r.individualDetails?.rank || "",
    driverUnit: r.individualDetails?.unit || "",
    driverArmyNo: r.individualDetails?.armyNumber || "",

    casualties: {
      fatal: Number(r.diedCivil || 0) + Number(r.diedMilitary || 0),
      nonFatal: Number(r.injuredCivil || 0) + Number(r.injuredMilitary || 0),
    },

    brief: r.probableCause || "NA",

    /* ===== BOOLEAN ONLY ===== */
    actionStatus: r.actionStatus === true,
    actionStatusRemark: r.remark || "",

    /* ===== OPTIONAL / EXTRA ===== */
    individualType: r.individualType,
    individualDetails: r.individualDetails,
    coDriverType: r.coDriverType,
    coDriverDetails: r.coDriverDetails,
  };
}
