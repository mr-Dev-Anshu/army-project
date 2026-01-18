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

export default mongoose.models.Individual || mongoose.model('Individual', individualSchema);
