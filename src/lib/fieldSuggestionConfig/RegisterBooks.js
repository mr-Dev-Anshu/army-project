export const REGISTER_BOOKS_SUGGESTION_CONFIG = {
    fields: [
        // Vehicle common fields
        'vehicleBaNumber',
        'typeOfVehicle',
        'mobileNumber', // For Mobile Phone Register
        'keyNumber',    // For Key Register
        'weaponType',   // For Arms Register
        'buttNumber',   // For Arms Register
    ],

    nestedFields: {
        // Individual Details (assuming mapped to details.individual in form/payload)
        'details.individual.rank': 'rank',
        'details.individual.unit': 'unit',
        'details.individual.fmn': 'fmn',
        'details.individual.command': 'command',
        'details.individual.unitLocation': 'unitLocation',

        // Duty Details
        'duty.natureOfDuty': 'natureOfDuty',
        'duty.place': 'place',
        'duty.location': 'location',
        'duty.from': 'location', // Suggest locations
        'duty.to': 'location',   // Suggest locations

        // Other specific fields that might arise
        'details.remarks': 'remarks',
    },

    trackCustomFields: 'specific',
};
