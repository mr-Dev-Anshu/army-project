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
        'ownerInformation.armyNo': 'armyNo',
        'ownerInformation.rank': 'rank',
        'ownerInformation.unit': 'unit',
        'ownerInformation.fmn': 'fmn',
        'ownerInformation.command': 'command',
        'ownerInformation.address': 'address',

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
