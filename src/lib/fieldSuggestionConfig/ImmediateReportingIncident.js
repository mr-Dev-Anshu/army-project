export const IMMEDIATE_REPORTING_INCIDENT_SUGGESTION_CONFIG = {
    fields: [
        'incidentPlace',
        'incidentBrief',
        'coordinationWithPolice',
        'incidentCoveredBy',
    ],
    nestedFields: {},
    arrayObjectFields: {
        'individuals': {
            'armyNo': 'armyNo',
            'name': 'name',
            'rank': 'rank',
            'age': 'age',
            'totalServiceDuration': 'totalServiceDuration',
            'unit': 'unit',
            'unitLocation': 'unitLocation',
            'fmn': 'fmn'
        }
    },
    trackCustomFields: 'specific',
};
