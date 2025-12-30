export const TEMPORARY_HIRED_WORKER_SUGGESTION_CONFIG = {
    fields: [
        'workerName',
        'workerMobile',
        'workerAadhar',
        'permanentAddressLine',
        'permanentCityDistrict',
        'permanentState',
        'permanentPincode',
        'placeOfStay',
        'placeOfDuty',
        'passNumber',
        'validFrom',
        'validTill',
    ],

    arrayObjectFields: {
        'subWorkers': {
            'name': 'subWorkerName',
            'mobile': 'subWorkerMobile',
            'aadhar': 'subWorkerAadhar',
        },
    },

    trackCustomFields: 'specific',
};
