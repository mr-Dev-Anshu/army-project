export const SHOPKEEPER_SUGGESTION_CONFIG = {
    fields: [
        'shopName',
        'shopAddress',
        'unit',
        'ownerName',
        'ownerMobile',
        'ownerAadhar',
        'priceListApproved',
        'priceListEffectiveFrom',
        'passNumber',
        'validFrom',
        'validTill',
    ],

    arrayObjectFields: {
        'workers': {
            'name': 'workerName',
            'aadhar': 'workerAadhar',
            'type': 'workerType',
        },
    },

    trackCustomFields: 'specific',
};
