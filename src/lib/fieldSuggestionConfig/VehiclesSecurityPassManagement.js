export const VEHICLES_SECURITY_PASS_SUGGESTION_CONFIG = {
    fields: [
        'remark'
    ],

    nestedFields: {
        // Vehicle Identification
        'vehicleIdentification.color': 'vehicleColor',
        'vehicleIdentification.category': 'vehicleCategory',
        'vehicleIdentification.type': 'vehicleType',
        'vehicleIdentification.registrationNumber': 'registrationNumber',


        // Owner Information
        'ownerInformation.name': 'ownerName',
        'ownerInformation.mobileNumber': 'mobileNumber',
        'ownerInformation.ownerDetails.armyNo': 'armyNo',
        'ownerInformation.ownerDetails.rank': 'rank',
        'ownerInformation.ownerDetails.unit': 'unit',
        'ownerInformation.ownerDetails.fmn': 'fmn',
        'ownerInformation.ownerDetails.command': 'command',
        'ownerInformation.ownerDetails.address': 'address',
        'ownerInformation.ownerDetails.serviceNumber': 'serviceNumber',
        'ownerInformation.ownerDetails.iCardNumber': 'iCardNumber',
        'ownerInformation.ownerDetails.aadharCardNumber': 'aadharCardNumber',
        'ownerInformation.ownerDetails.fathersName': 'fathersName',
        'ownerInformation.ownerDetails.maidFathersName': 'fathersName',
        'ownerInformation.ownerDetails.relationName': 'relationName',
        'ownerInformation.ownerDetails.relativeDetails.armyNo': 'armyNo',
        'ownerInformation.ownerDetails.relativeDetails.rank': 'rank',
        'ownerInformation.ownerDetails.relativeDetails.unit': 'unit',
        'ownerInformation.ownerDetails.relativeDetails.fmn': 'fmn',
        'ownerInformation.ownerDetails.relativeDetails.command': 'command',
        'ownerInformation.ownerDetails.maidPassNumber': 'maidPassNumber',
        'ownerInformation.ownerDetails.passID': 'passID',
        'ownerInformation.ownerDetails.maidPassID': 'passID',
        'ownerInformation.ownerDetails.trade': 'trade',
        'ownerInformation.ownerDetails.maidTrade': 'trade',
        'ownerInformation.ownerDetails.quarterNumber': 'quarterNumber',
        'ownerInformation.ownerDetails.maidQuarterNumber': 'quarterNumber',
        'ownerInformation.ownerDetails.officersEnclaveRank': 'rank',
        'ownerInformation.ownerDetails.officersEnclaveName': 'ownerName',
        'ownerInformation.ownerDetails.placeOfQtr': 'placeOfQtr',
        'ownerInformation.ownerDetails.maidPlaceOfQtr': 'placeOfQtr',
        'ownerInformation.ownerDetails.maidICardNumber': 'iCardNumber',
        'ownerInformation.ownerDetails.maidUnit': 'unit',
        'ownerInformation.ownerDetails.maidFmn': 'fmn',
        'ownerInformation.ownerDetails.maidCommand': 'command',

        'ownerInformation.ownerDetails.employeeRank': 'rank',
        'ownerInformation.ownerDetails.employeeUnit': 'unit',
        'ownerInformation.ownerDetails.employeeFmn': 'fmn',
        'ownerInformation.ownerDetails.employeeCommand': 'command',
        'ownerInformation.ownerDetails.employeeICardNumber': 'iCardNumber',

        'ownerInformation.ownerDetails.shopOwnerName': 'ownerName',
        'ownerInformation.ownerDetails.shopAddress': 'address',
        'ownerInformation.ownerDetails.shopName': 'shopName',
        'ownerInformation.ownerDetails.shopUnit': 'unit',
        'ownerInformation.ownerDetails.shopPassNo': 'passNumber',
        'ownerInformation.ownerDetails.tempWorkerName': 'ownerName',
        'ownerInformation.ownerDetails.placeOfStay': 'address',
        'ownerInformation.ownerDetails.placeOfWork': 'address',
        'ownerInformation.ownerDetails.typeOfWork': 'trade',
        'ownerInformation.ownerDetails.tempWorkerPassNo': 'passNumber',

        // Vehicle Pass Details
        'vehiclePassDetails.issuingAuthority': 'issuingAuthority',
        'vehiclePassDetails.passNumber': 'passNumber',

        // Authentication
        'authentication.initialsMPCPNCO': 'initialsMPCPNCO',
        'authentication.initialsQMSJCO': 'initialsQMSJCO',
        'authentication.initials2IC': 'initials2IC',
    },

    trackCustomFields: 'specific',
};
