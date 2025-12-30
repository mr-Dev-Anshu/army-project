export const GENERAL_TRAFFIC_OFFENCE_SUGGESTION_CONFIG = {
  fields: [
    'vehicleCategory',
    'vehicleType',
    'vehicleNumber',
    'vehicleName',
  ],

  nestedFields: {
    'onDutyDetails.dutyLocation': 'dutyLocation',
    'onDutyDetails.dutyType': 'dutyType',
    'onDutyDetailsMPReporting.nameReportingMP': 'reportingMPName',
    'onDutyDetailsMPReporting.rank': 'rank',
    'onDutyDetailsMPReporting.unit': 'unit',
    'onDutyDetailsMPReporting.armyNumber': 'reportingMPArmyNo',
    'offenceOccurenceDetails.incidentLocation': 'incidentLocation',
    'offenceOccurenceDetails.description': 'description',
  },

  arrayFields: {
    'offenceTypes': 'offenceType',
    'offenceTypeReference': 'offenceTypeReference',
  },

  // YEH LINE CHANGE KAR LENA APNE HISAAB SE
  trackCustomFields: 'specific',  // ← Recommended: relevant suggestions
  // trackCustomFields: 'generic', // ← Agar sab mix karna hai toh ye use kar
};