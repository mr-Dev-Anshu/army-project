export const OFFENDER_SUGGESTION_CONFIG = {
    fields: [
        'offenderType',
        'category',
    ],

    nestedFields: {
        // Military Personnel (Using standard fields if they exist at root of offenderDetails or explicitly mapped)
        'offenderDetails.armyNo': 'armyNo',
        'offenderDetails.rank': 'rank',
        'offenderDetails.name': 'name',
        'offenderDetails.unit': 'unit',
        'offenderDetails.fmn': 'fmn',
        'offenderDetails.command': 'command',

        // Civilian
        'offenderDetails.civilianName': 'name',
        'offenderDetails.civilianAadharCardNumber': 'aadharCardNumber',
        'offenderDetails.civilianFathersName': 'fathersName',
        'offenderDetails.civilianAddress': 'address',

        // Employee
        'offenderDetails.employeeServiceNumber': 'serviceNumber',
        'offenderDetails.employeeName': 'name',
        'offenderDetails.employeeRank': 'rank',
        'offenderDetails.employeeUnit': 'unit',
        'offenderDetails.employeeFMN': 'fmn',
        'offenderDetails.employeeCommand': 'command',
        'offenderDetails.employeeAddress': 'address',
        'offenderDetails.employeeICardNumber': 'iCardNumber',

        // Servant/Maid
        'offenderDetails.maidName': 'name',
        'offenderDetails.maidPassNumber': 'passNumber',
        'offenderDetails.maidFathersName': 'fathersName',
        'offenderDetails.maidPassID': 'passID',
        'offenderDetails.maidTrade': 'trade',
        'offenderDetails.maidQuarterNumber': 'quarterNumber',
        'offenderDetails.officersEnclave.officersEnclaveRank': 'rank',
        'offenderDetails.officersEnclave.officersEnclaveName': 'name',
        'offenderDetails.officersEnclave.placeOfQtr': 'placeOfQtr',
        'offenderDetails.officersEnclave.unit': 'unit',
        'offenderDetails.officersEnclave.fmn': 'fmn',
        'offenderDetails.officersEnclave.command': 'command',

        // Shop Keeper
        'offenderDetails.shopOwnerName': 'name', // or ownerName
        'offenderDetails.shopName': 'shopName',
        'offenderDetails.shopPassNo': 'passNumber',
        'offenderDetails.shopAddress': 'address',

        // Temp Hired Worker
        'offenderDetails.tempWorkerName': 'name',
        'offenderDetails.tempWorkerPassNo': 'passNumber',
        'offenderDetails.tempWorkerPlaceOfStay': 'address',
        'offenderDetails.tempWorkerPlaceOfWork': 'address',
        'offenderDetails.tempWorkerTypeOfWork': 'trade',
    },

    arrayFields: {},

    trackCustomFields: 'specific',
};
