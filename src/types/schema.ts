import { Document } from "mongoose";

export type UnixTimestamp = number;
export type Currency = number;
export type Percentage = number;
export type Providers = "email" | "google";

// Auth Provider service
export interface IAuthProvider {
  provider: Providers;
  id?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

// User service
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  profileImage: string;
  provider?: IAuthProvider;
  verified: boolean;
  stripeAccountId?: string;
  stripeCustomerId?: string;
  lastLogin: Date;
  status: "active" | "suspended" | "blocked";
}

export interface IEmailVerificationToken extends Document {
  user: IUser;
  token: string;
  createdAt: Date;
}
