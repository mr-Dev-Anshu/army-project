export const OFFENDER_SUGGESTION_CONFIG = {
    fields: [
        'offenderType',
        'category',
    ],

    nestedFields: {
        // Mapping common military offender details that might be present in the Mixed type
        'offenderDetails.rank': 'rank',
        'offenderDetails.name': 'offenderName',
        'offenderDetails.unit': 'unit',
        'offenderDetails.fmn': 'fmn',
        'offenderDetails.command': 'command',
        'offenderDetails.address': 'address',
        'offenderDetails.fatherName': 'offenderFatherName',
        'offenderDetails.caste': 'offenderCaste',
        'offenderDetails.religion': 'offenderReligion',
    },

    arrayFields: {},

    trackCustomFields: 'specific',
};
