export const INVESTIGATION_REPORT_SUGGESTION_CONFIG = {
    // 1. Top-level simple string fields and nested simple fields mappings
    fields: [
        'detailedOccurrenceReport',
        'pointsFindOutDuringInvestigation',
        'opinion',
    ],

    nestedFields: {
        // Report Details
        'reportDetails.command': 'command',
        'reportDetails.firNumber': 'firNumber',

        // Investigation Head
        'investigationHead.rank': 'rank',
        'investigationHead.name': 'name',
        'investigationHead.unit': 'unit',
        'investigationHead.fmn': 'fmn',
        'investigationHead.command': 'command',
        'investigationHead.address': 'address',

        // Occurrence Details
        'occurrenceDetails.offenceType': 'offenceType',
        'occurrenceDetails.placeOfOccurrence': 'placeOfOffence',
        'occurrenceDetails.description': 'description',

        // Remarks
        'remarks.analysis': 'analysis',
        'remarks.recommendation': 'recommendation',
    },

    arrayFields: {},

    arrayObjectFields: {
        'individuals': {
            'rank': 'rank',
            'name': 'name',
            'unit': 'unit',
            'fmn': 'fmn',
            'address': 'address',
            'role': 'role',
            'vehicleCategory': 'vehicleCategory',
            'typeOfVehicle': 'typeOfVehicle',
            'vehicleName': 'vehicleName',
        },
        'witnesses': {
            'rank': 'rank',
            'name': 'name',
            'unit': 'unit',
            'fmn': 'fmn',
            'address': 'address',
            'vehicleCategory': 'vehicleCategory',
            'typeOfVehicle': 'typeOfVehicle',
            'vehicleName': 'vehicleName',
        },
    },

    trackCustomFields: 'specific',
};
