import mongoose from "mongoose";

const individualSchema = new mongoose.Schema({
    armyNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    rank: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    unit: {
        type: String,
        trim: true
    },
    fmn: {
        type: String,
        trim: true
    },
    command: {
        type: String,
        trim: true
    },
    // Additional fields that might be useful based on other forms
    unitLocation: {
        type: String,
        trim: true
    },
    age: {
        type: String,
        trim: true
    },
    totalServiceDuration: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Force model recompilation if it exists to pick up schema changes
if (mongoose.models.Individual) {
    delete mongoose.models.Individual;
}

export default mongoose.model('Individual', individualSchema);
