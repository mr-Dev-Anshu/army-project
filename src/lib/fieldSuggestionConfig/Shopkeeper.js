export const SHOPKEEPER_SUGGESTION_CONFIG = {
    fields: [
        'shopName',
        'shopAddress',
        'unit',
        'ownerName',
    ],

    arrayObjectFields: {
        'workers': {
            'type': 'workerType',
        },
    },

    trackCustomFields: 'specific',
};
