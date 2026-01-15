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

        // Military Personnel Owner
        'ownerInformation.ownerDetails.armyNo': 'armyNo',
        'ownerInformation.ownerDetails.rank': 'rank',
        'ownerInformation.ownerDetails.unit': 'unit',
        'ownerInformation.ownerDetails.fmn': 'fmn',
        'ownerInformation.ownerDetails.command': 'command',
        'ownerInformation.ownerDetails.address': 'address',

        // Employee Owner
        'ownerInformation.ownerDetails.serviceNumber': 'serviceNumber',
        'ownerInformation.ownerDetails.employeeRank': 'rank',
        'ownerInformation.ownerDetails.employeeUnit': 'unit',
        'ownerInformation.ownerDetails.employeeFmn': 'fmn',
        'ownerInformation.ownerDetails.employeeCommand': 'command',
        'ownerInformation.ownerDetails.employeeICardNumber': 'iCardNumber',

        // Civilian Owner
        'ownerInformation.ownerDetails.aadharCardNumber': 'aadharCardNumber',
        'ownerInformation.ownerDetails.fathersName': 'fathersName',
        'ownerInformation.ownerDetails.relationName': 'relationName',

        // -- Relative Details (Military Personnel)
        'ownerInformation.ownerDetails.relativeDetails.armyNo': 'armyNo',
        'ownerInformation.ownerDetails.relativeDetails.rank': 'rank',
        'ownerInformation.ownerDetails.relativeDetails.unit': 'unit',
        'ownerInformation.ownerDetails.relativeDetails.fmn': 'fmn',
        'ownerInformation.ownerDetails.relativeDetails.command': 'command',

        // -- Relative Details (Servant / Maid)
        'ownerInformation.ownerDetails.relativeDetails.maidPassNumber': 'maidPassNumber',
        'ownerInformation.ownerDetails.relativeDetails.maidFathersName': 'fathersName',
        'ownerInformation.ownerDetails.relativeDetails.maidPassID': 'passID',
        'ownerInformation.ownerDetails.relativeDetails.relativeName': 'ownerName',
        'ownerInformation.ownerDetails.relativeDetails.maidTrade': 'trade',
        'ownerInformation.ownerDetails.relativeDetails.maidQuarterNumber': 'quarterNumber',
        'ownerInformation.ownerDetails.relativeDetails.officersEnclaveRank': 'rank',
        'ownerInformation.ownerDetails.relativeDetails.officersEnclaveName': 'ownerName',
        'ownerInformation.ownerDetails.relativeDetails.maidPlaceOfQtr': 'placeOfQtr',
        'ownerInformation.ownerDetails.relativeDetails.maidUnit': 'unit',
        'ownerInformation.ownerDetails.relativeDetails.maidFmn': 'fmn',
        'ownerInformation.ownerDetails.relativeDetails.maidCommand': 'command',
        'ownerInformation.ownerDetails.relativeDetails.relativeAddress': 'address',
        'ownerInformation.ownerDetails.relativeDetails.maidICardNumber': 'iCardNumber',

        // -- Relative Details (Shop Keeper)
        'ownerInformation.ownerDetails.relativeDetails.shopOwnerName': 'ownerName',
        'ownerInformation.ownerDetails.relativeDetails.shopAddress': 'address',
        'ownerInformation.ownerDetails.relativeDetails.shopName': 'shopName',
        'ownerInformation.ownerDetails.relativeDetails.shopUnit': 'unit',
        'ownerInformation.ownerDetails.relativeDetails.shopPassNo': 'passNumber',

        // -- Relative Details (Temp Hired Worker)
        'ownerInformation.ownerDetails.relativeDetails.tempWorkerName': 'ownerName',
        'ownerInformation.ownerDetails.relativeDetails.tempWorkerPlaceOfStay': 'address',
        'ownerInformation.ownerDetails.relativeDetails.tempWorkerPlaceOfWork': 'address',
        'ownerInformation.ownerDetails.relativeDetails.tempWorkerTypeOfWork': 'trade',
        'ownerInformation.ownerDetails.relativeDetails.tempWorkerPassNo': 'passNumber',
        // Note: Dates usually don't need suggestions, but keeping consistency if previously present
        'ownerInformation.ownerDetails.relativeDetails.tempWorkerPassIssueDate': 'date',
        'ownerInformation.ownerDetails.relativeDetails.tempWorkerPassExpireDate': 'date',


        // Servant / Maid Owner
        'ownerInformation.ownerDetails.maidPassNumber': 'maidPassNumber',
        'ownerInformation.ownerDetails.maidFathersName': 'fathersName',
        'ownerInformation.ownerDetails.maidPassID': 'passID',
        'ownerInformation.ownerDetails.maidTrade': 'trade',
        'ownerInformation.ownerDetails.maidQuarterNumber': 'quarterNumber',
        'ownerInformation.ownerDetails.officersEnclaveRank': 'rank',
        'ownerInformation.ownerDetails.officersEnclaveName': 'ownerName',
        'ownerInformation.ownerDetails.maidPlaceOfQtr': 'placeOfQtr',
        'ownerInformation.ownerDetails.maidUnit': 'unit',
        'ownerInformation.ownerDetails.maidFmn': 'fmn',
        'ownerInformation.ownerDetails.maidCommand': 'command',
        'ownerInformation.ownerDetails.maidICardNumber': 'iCardNumber',

        // Shop Keeper Owner
        'ownerInformation.ownerDetails.shopOwnerName': 'ownerName',
        'ownerInformation.ownerDetails.shopAddress': 'address',
        'ownerInformation.ownerDetails.shopName': 'shopName',
        'ownerInformation.ownerDetails.shopUnit': 'unit',
        'ownerInformation.ownerDetails.shopPassNo': 'passNumber',

        // Temp Hired Worker Owner
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
