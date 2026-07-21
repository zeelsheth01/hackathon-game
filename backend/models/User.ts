import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  hackerId?: string;
  githubId?: string;
  githubToken?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  emailVerified: { type: Date },
  image: { type: String },
  password: { type: String },
  hackerId: { type: String },
  githubId: { type: String, unique: true, sparse: true },
  githubToken: { type: String }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
