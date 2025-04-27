import mongoose, { Schema, Document } from 'mongoose';
import { IAuthProvider } from '../../types/schema';

const authProviderSchema: Schema = new Schema({
  provider: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: false,
  },
  accessToken: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
    required: false,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
});

const AuthProviderModel = mongoose.model<IAuthProvider & Document>('AuthProvider', authProviderSchema);

export default AuthProviderModel;
