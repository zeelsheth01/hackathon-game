import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  userId: mongoose.Types.ObjectId | string;
  score: number;
  rank?: number;
  createdAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  rank: { type: Number },
}, { timestamps: true });

export default mongoose.models.Leaderboard || mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
