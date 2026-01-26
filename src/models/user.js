import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false }, 
    role: { type: String, default: "Admin" },
    email: { type: String, trim: true, lowercase: true },
    armyNo: { type: String, trim: true },
    unit: { type: String },
    rank: { type: String },
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
    console.log("this is getting called , mongo middleware")
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  
  } catch (err) {
     throw new Error(err?.message || "Something went wrong while Hashing the password" )
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);