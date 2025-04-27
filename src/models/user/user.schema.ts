import { Schema, model, Document } from "mongoose";
import { IUser } from "../../types/schema";

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dp: { type: String, required: true },
    password: { type: String },
    profileImage: { type: String, required: true },
    provider: { type: Object },
    verified: { type: Boolean, required: true, default: false },
    role: { type: String, enum: ["admin", "member"], required: true },
    membershipTier: {
      type: String,
      enum: ["basic", "premium", "vip"],
      required: true,
    },
    walletBalance: { type: Number, required: true },
    loyaltyPoints: { type: Number, required: true },
    rfidTag: { type: String },
    biometricData: { type: Object },
    stripeAccountId: { type: String },
    stripeCustomerId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    preferences: { type: Object, required: true },
    status: {
      type: String,
      enum: ["active", "suspended", "blocked"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.verifyPassword = async function (
  password: string
): Promise<boolean> {
  // Implement password verification logic based on your criteria
  return true; // Placeholder return value
};

export default model<IUser>("User", UserSchema);
