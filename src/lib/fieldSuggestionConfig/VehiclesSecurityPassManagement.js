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
        'ownerInformation.ownerDetails.relationName': 'relationName',
        'ownerInformation.ownerDetails.relativeDetails.armyNo': 'armyNo',
        'ownerInformation.ownerDetails.relativeDetails.rank': 'rank',
        'ownerInformation.ownerDetails.relativeDetails.unit': 'unit',
        'ownerInformation.ownerDetails.relativeDetails.fmn': 'fmn',
        'ownerInformation.ownerDetails.relativeDetails.command': 'command',
        'ownerInformation.ownerDetails.maidPassNumber': 'maidPassNumber',
        'ownerInformation.ownerDetails.passID': 'passID',
        'ownerInformation.ownerDetails.trade': 'trade',
        'ownerInformation.ownerDetails.quarterNumber': 'quarterNumber',
        'ownerInformation.ownerDetails.officersEnclaveRank': 'rank',
        'ownerInformation.ownerDetails.placeOfQtr': 'placeOfQtr',
        'ownerInformation.ownerDetails.shopOwnerName': 'ownerName',
        'ownerInformation.ownerDetails.shopAddress': 'address',
        'ownerInformation.ownerDetails.shopName': 'shopName',
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
