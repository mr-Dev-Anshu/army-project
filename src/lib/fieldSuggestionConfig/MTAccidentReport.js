export const MT_ACCIDENT_REPORT_SUGGESTION_CONFIG = {
    fields: [
        'remark',
        'actionStatusRemark',
    ],

    nestedFields: {
        'accidentDetails.placeOfAccident': 'placeOfAccident',
        'accidentDetails.causeOfAccident': 'causeOfAccident',
        'vehicleDetails.vehicleNumber': 'vehicleNumber',
        'vehicleDetails.vehicleModel': 'vehicleModel',
        'firMactDetails.firPoliceStation': 'policeStation',
        'firMactDetails.firMactNumber': 'firMactNumber',
    },

    // Since individualDetails is Mixed, we might not be able to easily map it unless we know the structure.
    // Assuming standard individual fields if they appear in the payload.
    // For now, I'll stick to the defined schema fields.

    trackCustomFields: 'specific',
};
