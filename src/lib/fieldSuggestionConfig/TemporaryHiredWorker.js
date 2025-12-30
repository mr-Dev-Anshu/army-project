export const TEMPORARY_HIRED_WORKER_SUGGESTION_CONFIG = {
    fields: [
        'permanentAddressLine',
        'permanentCityDistrict',
        'permanentState',
        'placeOfStay',
        'placeOfDuty',
    ],

    // No complex nested or array fields that need suggestions for now?
    // subWorkers has 'name', probably not reusable.

    trackCustomFields: 'specific',
};
