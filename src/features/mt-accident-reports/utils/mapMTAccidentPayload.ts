export function mapMTAccidentPayload(formData: any) {
  const r = formData.mtAccidentReport;

  return {
    date: r.dateOfAccident ? new Date(r.dateOfAccident) : new Date(),
    time: r.timeOfAccident,
    place: r.placeOfAccident,

    vehicleNo: r.vehicleNumber,
    vehicleMake: r.makeAndModel,

    driverName: r.individualDetails?.name,
    driverRank: r.individualDetails?.rank,
    driverUnit: r.individualDetails?.unit,
    driverArmyNo: r.individualDetails?.armyNumber,

    casualties: {
      fatal: Number(r.diedCivil || 0) + Number(r.diedMilitary || 0),
      nonFatal: Number(r.injuredCivil || 0) + Number(r.injuredMilitary || 0),
    },

    brief: r.probableCause,
    actionStatus: Boolean(r.actionStatus),
    actionStatusRemark: r.remark,

    individualType: r.individualType,
    individualDetails: r.individualDetails,
    coDriverType: r.coDriverType,
    coDriverDetails: r.coDriverDetails,
  };
}
