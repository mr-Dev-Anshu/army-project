import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: "user" }, // superadmin, admin, user
        email: { type: String },
        armyNo: { type: String },
        unit: { type: String },
        rank: { type: String },
    },
    { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
