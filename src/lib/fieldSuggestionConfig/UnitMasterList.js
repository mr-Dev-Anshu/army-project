export const UNIT_MASTER_LIST_SUGGESTION_CONFIG = {
    fields: [
        'remarks'
    ],

    nestedFields: {
        // unitIdentifier
        'unitIdentifier.unitType': 'unitType',
        'unitIdentifier.unit': 'unit',
        'unitIdentifier.unitShortForm': 'unitShortForm',
        'unitIdentifier.serviceArm': 'serviceArm',
        'unitIdentifier.parentFormation': 'parentFormation',
        'unitIdentifier.locationStation': 'locationStation',

        // unitHierarchyAndControl
        'unitHierarchyAndControl.command': 'command',
        'unitHierarchyAndControl.corps': 'corps',
        'unitHierarchyAndControl.brigade': 'brigade',
        'unitHierarchyAndControl.division': 'division',
        'unitHierarchyAndControl.seniorityOrder': 'seniorityOrder',

        // unitClassification (nested but some are explicit)
        'unitClassification.unitStatus': 'unitStatus',
        'unitClassification.attachedTo': 'attachedTo',
    },

    trackCustomFields: 'specific',
};
