export const GENERAL_TRAFFIC_OFFENCE_SUGGESTION_CONFIG = {
  fields: [
    'vehicleCategory',
    'vehicleType',
    'vehicleNumber',
    'vehicleName',
  ],

  nestedFields: {
    'onDutyDetails.dutyLocation': 'placeOfOffence',
    'onDutyDetails.dutyType': 'dutyType',
    'onDutyDetailsMPReporting.nameReportingMP': 'reportingMPName',
    'onDutyDetailsMPReporting.rank': 'rank',
    'onDutyDetailsMPReporting.unit': 'unit',
    'onDutyDetailsMPReporting.armyNumber': 'reportingMPArmyNo',
    'offenceOccurenceDetails.incidentLocation': 'placeOfOffence',
    'offenceOccurenceDetails.description': 'description',
  },

  arrayFields: {
    'offenceTypes': 'offenceType',
    'offenceTypeReference': 'offenceTypeReference',
  },

  arrayObjectFields: {
    'offenderPeople': {
      'details.rank': 'select rank',
      'details.unit': 'unit',
      'details.fmn': 'fmn',
      'details.command': 'command',
      'details.address': 'address',
      'details.iCardNumber': 'id card number',
      'details.armyNumber': 'army rider / driver number',
    }
  },

  // YEH LINE CHANGE KAR LENA APNE HISAAB SE
  trackCustomFields: 'specific',  // ← Recommended: relevant suggestions
  // trackCustomFields: 'generic', // ← Agar sab mix karna hai toh ye use kar
};