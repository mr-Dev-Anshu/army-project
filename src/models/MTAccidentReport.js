import mongoose from "mongoose";

const individualSchema = new mongoose.Schema(
    {
        individualType: {
            type: String,
            enum: [
                "militaryPersonnel", "employee", "civilian", "servantMaid",
                "shopKeeper", "tempHiredWorker",
            ]
        },
        individualDetails: {
            type: Schema.Types.Mixed,
            default: {}
        },
    }, { _id: false }
);

const accidentSchema = new mongoose.Schema(
    {
        accidentTime: Date,
        accidentDate: Date,
        placeOfAccident: String,
        accidentType: {
            type: String,
            enum: [
                "normal", "serious", "fatal", "verySerious"
            ]
        },
        causeOfAccident: String,
    }, { _id: false }
);

const vehicleSchema = new mongoose.Schema(
    {
        vehicleNumber: String,
        vehicleModel: String,
    }, { _id: false }
);

const casualtySchema = new mongoose.Schema(
    {
        injuredCivil: { type: Number, default: 0 },
        injuredMilitary: { type: Number, default: 0 },
        diedCivil: { type: Number, default: 0 },
        diedMilitary: { type: Number, default: 0 },
    }, { _id: false }
);
const firMactSchema = new mongoose.Schema(
    {
        firMactNumber: String,
        firDate: Date,
        firPoliceStation: String,
    }, { _id: false }
);
const mtAccidentReportSchema = new mongoose.Schema(
    {
        individualDetails: {
            type: individualSchema,
            default: {},
        },
        accidentDetails: {
            type: accidentSchema,
            default: {},
        },
        vehicleDetails: { type: vehicleSchema, default: {} },
        casualtyDetails: { type: casualtySchema, default: {} },
        firMactDetails: { type: firMactSchema, default: {} },
        actionStatus: {
            type: String,
            enum: [
                "pending", "taken"
            ],
            default: "pending"
        },
        actionStatusRemark: String,
        remark: String,
        customFields: {
            type: Schema.Types.Mixed,
            default: {}
        },
    },

    {
        timestamps: true,
    }
);

export const MTAccidentReport =
    mongoose.models.MTAccidentReport ||
    mongoose.model("MTAccidentReport", mtAccidentReportSchema);