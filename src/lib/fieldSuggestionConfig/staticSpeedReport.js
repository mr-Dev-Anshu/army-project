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
        'onDutyDetails.dutyLocation': 'placeOfOffence',
        'onDutyDetails.dutyType': 'dutyType',

        // Reporting MP details
        'onDutyDetailsMPReporting.nameReportingMP': 'reportingMPName',
        'onDutyDetailsMPReporting.rank': 'rank',
        'onDutyDetailsMPReporting.unit': 'unit',
        'onDutyDetailsMPReporting.armyNumber': 'reportingMPArmyNo',

        // Offence occurrence details
        'offenceOccurenceDetails.incidentLocation': 'placeOfOffence',
        'offenceOccurenceDetails.actualSpeedNoted': 'actualSpeedNoted',
        'offenceOccurenceDetails.authSpeed': 'authSpeed',
        'offenceOccurenceDetails.overSpeedCalculated': 'overSpeedCalculated',
        'offenceOccurenceDetails.description': 'description',
    },

    // 3. No array fields in static speed report
    arrayFields: {},

    // 4. Custom fields handling
    trackCustomFields: 'specific', // recommended
};
