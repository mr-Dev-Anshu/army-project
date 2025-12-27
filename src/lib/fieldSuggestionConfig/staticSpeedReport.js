export const STATIC_SPEED_REPORT_SUGGESTION_CONFIG = {
    // 1. Top-level simple string fields
    fields: [
        'vehicleType',
        'vehicleCategory',
        'vehicleNumber',
        'vehicleName',
        'remark',
    ],

    // 2. Nested object fields
    nestedFields: {
        // On duty details
        'onDutyDetails.dutyLocation': 'dutyLocation',
        'onDutyDetails.dutyType': 'dutyType',

        // Reporting MP details
        'onDutyDetailsMPReporting.nameReportingMP': 'reportingMPName',
        'onDutyDetailsMPReporting.rank': 'reportingMPRank',
        'onDutyDetailsMPReporting.unit': 'reportingMPUnit',
        'onDutyDetailsMPReporting.armyNumber': 'reportingMPArmyNo',

        // Offence occurrence details
        'offenceOccurenceDetails.incidentLocation': 'incidentLocation',
        'offenceOccurenceDetails.actualSpeedNoted': 'actualSpeedNoted',
        'offenceOccurenceDetails.authSpeed': 'authorizedSpeed',
        'offenceOccurenceDetails.overSpeedCalculated': 'overSpeedValue',
        'offenceOccurenceDetails.description': 'offenceDescription',
    },

    // 3. No array fields in static speed report
    arrayFields: {},

    // 4. Custom fields handling
    trackCustomFields: 'specific', // recommended
};
