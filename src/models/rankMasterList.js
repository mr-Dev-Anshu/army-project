import mongoose from "mongoose";

const rankMasterListSchema = new mongoose.Schema({
    rankCategory: {
        type: String,
        required: true,
    },
    rank: {
        type: String,
        required: true
    },
    rankShortForm: {
        type: String,
        required: true
    },
    rankSeniorityOrder: {
        type: String,
        required: true
    },
    rankActiveStatus: {
        type: Boolean,
        required: true,
        default: false,
    },
    serviceArm: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
    }
}, {
    timestamps: true
})

export default mongoose.models.RankMasterList || mongoose.model("RankMasterList", rankMasterListSchema);