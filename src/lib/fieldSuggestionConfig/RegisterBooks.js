export const REGISTER_BOOKS_SUGGESTION_CONFIG = {
    fields: [
        // Vehicle common fields
        'vehicleBaNumber',
        'typeOfVehicle',
        'mobileNumber', // For Mobile Phone Register
        'keyNumber',    // For Key Register
        'weaponType',   // For Arms Register
        'buttNumber',   // For Arms Register
    ],

    nestedFields: {
        // Individual Details (assuming mapped to details.individual in form/payload)
        'details.individual.rank': 'rank',
        'details.individual.unit': 'unit',
        'details.individual.fmn': 'fmn',
        'details.individual.command': 'command',
        'details.individual.unitLocation': 'unitLocation',

        // Duty Details
        'duty.natureOfDuty': 'natureOfDuty',
        'duty.place': 'place',
        'duty.location': 'location',
        'duty.from': 'location', // Suggest locations
        'duty.to': 'location',   // Suggest locations

        // General Duty Diary Fields
        'details.placeOfDuty': 'placeOfDuty',
        'details.typeOfDuty': 'typeOfDuty',
        'details.briefOfDuty': 'briefOfDuty',
        'details.offenceType': 'offenceType',
        'details.placeOfOffence': 'placeOfOffence',
        'details.occurrenceBrief': 'occurrenceBrief',

        // Offender / Victim Details
        'details.offenderDetails.rank': 'rank',
        'details.offenderDetails.unit': 'unit',
        'details.offenderDetails.fmn': 'fmn',
        'details.offenderDetails.command': 'command',
        'details.offenderDetails.serviceNumber': 'serviceNumber',
        'details.offenderDetails.iCardNumber': 'iCardNumber',
        'details.offenderDetails.fathersName': 'fathersName',
        'details.offenderDetails.maidPassNumber': 'maidPassNumber',
        'details.offenderDetails.trade': 'trade',
        'details.offenderDetails.quarterNumber': 'quarterNumber',
        'details.offenderDetails.shopOwnerName': 'ownerName',
        'details.offenderDetails.shopAddress': 'address',
        'details.offenderDetails.shopName': 'shopName',
        'details.offenderDetails.passNo': 'passNumber',
        'details.offenderDetails.placeOfStay': 'address',
        'details.offenderDetails.placeOfWork': 'address',
        'details.offenderDetails.typeOfWork': 'trade',
        'details.offenderDetails.name': 'name',
        'details.offenderDetails.address': 'address',
        'details.offenderDetails.aadharCardNumber': 'aadharCardNumber',
        'details.offenderDetails.relationName': 'relationName',

        // Relative Details (Nested in offenderDetails)
        'details.offenderDetails.relativeDetails.armyNo': 'armyNo',
        'details.offenderDetails.relativeDetails.rank': 'rank',
        'details.offenderDetails.relativeDetails.unit': 'unit',
        'details.offenderDetails.relativeDetails.fmn': 'fmn',
        'details.offenderDetails.relativeDetails.command': 'command',
        'details.offenderDetails.relativeDetails.iCardNumber': 'iCardNumber',

        'details.offenderDetails.relativeDetails.maidPassNumber': 'maidPassNumber',
        'details.offenderDetails.relativeDetails.maidFathersName': 'fathersName',
        'details.offenderDetails.relativeDetails.maidPassID': 'passID',
        'details.offenderDetails.relativeDetails.relativeName': 'name',
        'details.offenderDetails.relativeDetails.maidTrade': 'trade',
        'details.offenderDetails.relativeDetails.maidQuarterNumber': 'quarterNumber',
        'details.offenderDetails.relativeDetails.officersEnclaveRank': 'rank',
        'details.offenderDetails.relativeDetails.officersEnclaveName': 'name', // Using 'name' generally
        'details.offenderDetails.relativeDetails.maidPlaceOfQtr': 'placeOfQtr', // or 'address'
        'details.offenderDetails.relativeDetails.maidUnit': 'unit',
        'details.offenderDetails.relativeDetails.maidFmn': 'fmn',
        'details.offenderDetails.relativeDetails.maidCommand': 'command',
        'details.offenderDetails.relativeDetails.relativeAddress': 'address',
        'details.offenderDetails.relativeDetails.maidICardNumber': 'iCardNumber',

        'details.offenderDetails.relativeDetails.shopOwnerName': 'ownerName',
        'details.offenderDetails.relativeDetails.shopAddress': 'address',
        'details.offenderDetails.relativeDetails.shopName': 'shopName',
        'details.offenderDetails.relativeDetails.shopUnit': 'unit',
        'details.offenderDetails.relativeDetails.shopPassNo': 'passNumber',

        'details.offenderDetails.relativeDetails.tempWorkerName': 'name',
        'details.offenderDetails.relativeDetails.tempWorkerPlaceOfStay': 'address',
        'details.offenderDetails.relativeDetails.tempWorkerPlaceOfWork': 'address',
        'details.offenderDetails.relativeDetails.tempWorkerTypeOfWork': 'trade',
        'details.offenderDetails.relativeDetails.tempWorkerPassNo': 'passNumber',


        // Other specific fields that might arise
        'details.remarks': 'remarks',
    },

    trackCustomFields: 'specific',
};
