export const IMMEDIATE_REPORTING_INCIDENT_SUGGESTION_CONFIG = {
    fields: [
        'reportHeading',
        'vehicleType',
        'vehicleNumber',
        'vehicleName',
        'placeOfOccurrence',
        'description',
        'coordWith',
        'incidentCoveredBy',
    ],
    nestedFields: {},
    arrayObjectFields: {
        'individuals': {
            'individualDetails.armyNo': 'armyNo',
            'individualDetails.name': 'name',
            'individualDetails.rank': 'rank',
            'age': 'age',
            'totalServiceDuration': 'totalServiceDuration',
            'individualDetails.unit': 'unit',
            'unitLocation': 'unitLocation',
            'individualDetails.fmn': 'fmn'
        }
    },
    trackCustomFields: 'specific',
};
