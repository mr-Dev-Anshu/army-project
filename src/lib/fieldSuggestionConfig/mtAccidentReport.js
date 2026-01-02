export const MT_ACCIDENT_REPORT_SUGGESTION_CONFIG = {
    // 1. Top-level simple string fields
    fields: [
        'individualType',
        'placeOfAccident',
        'typeOfAccident',
        'probableCause',
        'vehicleNumber',
        'makeAndModel',
        'firPoliceStation',
        'firCaseNumber',
        'remark',
        'unit',
        'fmn',
    ],

    // 2. Nested object fields
    nestedFields: {
        // Individual/Victim details
        'individualDetails.name': 'victimName',
        'individualDetails.rank': 'victimRank',
        'individualDetails.unit': 'victimUnit',
        'individualDetails.armyNumber': 'victimArmyNumber',
    },

    // 3. Array fields
    arrayFields: {
        // Offenders array (driver, co-driver, etc.)
        'offenders': {
            'offenderDetails.name': 'driverName',
            'offenderDetails.rank': 'driverRank',
            'offenderDetails.unit': 'driverUnit',
            'offenderDetails.armyNumber': 'driverArmyNumber',
        }
    },

    // 4. Custom fields handling
    trackCustomFields: 'specific', // recommended
};
