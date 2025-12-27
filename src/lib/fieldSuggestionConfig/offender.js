export const OFFENDER_SUGGESTION_CONFIG = {
    fields: [
        'offenderType',
        'category',
    ],

    nestedFields: {
        // Mapping common military offender details that might be present in the Mixed type
        'offenderDetails.rank': 'offenderRank',
        'offenderDetails.name': 'offenderName',
        'offenderDetails.unit': 'offenderUnit',
        'offenderDetails.fmn': 'offenderFmn',
        'offenderDetails.command': 'offenderCommand',
        'offenderDetails.address': 'offenderAddress',
        'offenderDetails.fatherName': 'offenderFatherName',
        'offenderDetails.caste': 'offenderCaste',
        'offenderDetails.religion': 'offenderReligion',
    },

    arrayFields: {},

    trackCustomFields: 'specific',
};
