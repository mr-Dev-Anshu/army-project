export const INVESTIGATION_REPORT_SUGGESTION_CONFIG = {
    // 1. Top-level simple string fields and nested simple fields mappings
    fields: [
        'detailedOccurrenceReport',
        'pointsFindOutDuringInvestigation',
        'opinion',
    ],

    nestedFields: {
        // Report Details
        'reportDetails.command': 'reportCommand',
        'reportDetails.firNumber': 'firNumber',

        // Investigation Head
        'investigationHead.rank': 'investigationHeadRank',
        'investigationHead.name': 'investigationHeadName',
        'investigationHead.unit': 'investigationHeadUnit',
        'investigationHead.fmn': 'investigationHeadFmn',
        'investigationHead.command': 'investigationHeadCommand',
        'investigationHead.address': 'investigationHeadAddress',

        // Occurrence Details
        'occurrenceDetails.offenceType': 'investigationOffenceType',
        'occurrenceDetails.placeOfOccurrence': 'investigationPlace',
        'occurrenceDetails.description': 'investigationDescription',

        // Remarks
        'remarks.analysis': 'investigationAnalysis',
        'remarks.recommendation': 'investigationRecommendation',
    },

    arrayFields: {},

    trackCustomFields: 'specific',
};
