import mongoose from "mongoose";
const { Schema } = mongoose;

// Vehicle Identification Schema
const vehicleIdentificationSchema = new Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    color: { type: String },
    category: { type: String },
    type: { type: String },
}, { _id: false });

// Owner Information Schema
const ownerInformationSchema = new Schema({
    name: { type: String },
    mobileNumber: { type: String },
    ownerType: {
        type: String,
        enum: [
            "militaryPersonnel", "employee", "civilian", "servantMaid",
            "shopKeeper", "tempHiredWorker",
        ]
    },
    ownerDetails: {
        type: Schema.Types.Mixed,
        default: {}
    },
}, { _id: false });

// Vehicle Pass Details Schema
const vehiclePassDetailsSchema = new Schema({
    isAvailable: {
        type: Boolean,
        default: false
    },
    passNumber: {
        type: String,
        required: function () { return this.isAvailable; }
    },
    issuedDate: {
        type: Date,
        required: function () { return this.isAvailable; }
    },
    validFrom: {
        type: Date,
        required: function () { return this.isAvailable; }
    },
    validTo: {
        type: Date,
        required: function () { return this.isAvailable; }
    },
    issuingAuthority: {
        type: String,
        required: function () { return this.isAvailable; }
    },
}, { _id: false });

// Authentication Schema
const authenticationSchema = new Schema({
    initialsMPCPNCO: { type: String },
    initialsQMSJCO: { type: String },
    initials2IC: { type: String },
}, { _id: false });

// Main Schema
const vehiclesSecurityPassManagementSchema = new Schema({
    vehicleIdentification: {
        type: vehicleIdentificationSchema,
        required: true
    },
    ownerInformation: {
        type: ownerInformationSchema,
        required: true
    },
    vehiclePassDetails: {
        type: vehiclePassDetailsSchema,
        default: {}
    },
    authentication: {
        type: authenticationSchema,
        default: {}
    },

    remark: { type: String },
    customFields: {
        type: Schema.Types.Mixed,
        default: {},
    },
}, {
    timestamps: true,
});

export const VehiclesSecurityPassManagement = mongoose.models.VehiclesSecurityPassManagement || mongoose.model("VehiclesSecurityPassManagement", vehiclesSecurityPassManagementSchema);