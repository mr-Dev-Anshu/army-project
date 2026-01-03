export const MAID_SERVANT_SUGGESTION_CONFIG = {
    fields: [
        'qtrNumber',
        'ownerName',
        'ownerRank',
        'ownerUnit',
        'servantName',
        'servantMobile',
        'servantAadhar',
        'permanentAddressLine',
        'permanentCityDistrict',
        'permanentState',
        'permanentPincode',
        'passNumber',
        'validFrom',
        'validTill',
    ],

    arrayObjectFields: {
        'familyMembers': {
            'name': 'familyMemberName',
            'relationship': 'relationship',
            'age': 'age',
        },
    },

    trackCustomFields: 'specific',
};
