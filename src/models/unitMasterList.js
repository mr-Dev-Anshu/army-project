import mongoose from "mongoose";

const unitIdentifierSchema = new mongoose.Schema({
    unitType: {
        type: String,
        required: true
    },
    unitName: {
        type: String,
        required: true
    },
    unitShortForm: {
        type: String,
        required: true
    },
    serviceArm: {
        type: String,
        required: true
    },
    locationStation: {
        type: String,
        required: true
    },
});

const unitHierarchyAndControlSchema = new mongoose.Schema({
    command: {
        type: String,
        required: true,
    },
    corps: {
        type: String,
        required: true,
    },
    brigade: {
        type: String,
        required: true,
    },
    division: {
        type: String,
        required: true,
    },
    seniorityOrder: {
        type: String,
        required: true,
    },
});

const unitClassificationSchema = new mongoose.Schema({
    unitStatus: {
        type: String,
        enum: ["permanent", "attached", "visiting", "detached", "onTemporaryDuty",],
        required: true,
    },
    attachmentValidFrom: {
        type: Date,
        required: function () {
            return this.unitStatus && this.unitStatus !== 'permanent';
        }
    },
    attachmentValidTo: {
        type: Date,
        required: function () {
            return this.unitStatus && this.unitStatus !== 'permanent';
        }
    },
    attachedTo: {
        type: String,
        required: function () {
            return this.unitStatus && this.unitStatus !== 'permanent';
        }
    },

});

const unitMasterListSchema = new mongoose.Schema({
    unitIdentifier: {
        type: unitIdentifierSchema,
        required: true
    },
    unitHierarchyAndControl: {
        type: unitHierarchyAndControlSchema,
        required: true
    },
    unitClassification: {
        type: unitClassificationSchema,
        required: true
    },
    unitActiveStatus: {
        type: Boolean,
        required: true,
        default: false,
    },
    remarks: {
        type: String,
    }
}, { timestamps: true })

export default mongoose.models.UnitMasterList || mongoose.model("UnitMasterList", unitMasterListSchema);

