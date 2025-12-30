export const MAID_SERVANT_SUGGESTION_CONFIG = {
    fields: [
        'ownerRank',
        'ownerUnit',
        'permanentAddressLine',
        'permanentCityDistrict',
        'permanentState',
    ],

    arrayObjectFields: {
        'familyMembers': {
            'relationship': 'relationship',
        },
    },

    trackCustomFields: 'specific',
};
