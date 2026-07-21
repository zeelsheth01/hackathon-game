import mongoose, { Schema, Document } from 'mongoose';

export interface IProblemStatement extends Document {
  title: string;
  description: string;
  stack: string;
  pace: string;
}

const ProblemStatementSchema = new Schema<IProblemStatement>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stack: { type: String, required: true },
  pace: { type: String, required: true },
});

export const ProblemStatement = mongoose.models.ProblemStatement || mongoose.model<IProblemStatement>('ProblemStatement', ProblemStatementSchema);

export interface IGameSession extends Document {
  userId: mongoose.Types.ObjectId | string;
  stack: string;
  pace: string;
  problemId?: mongoose.Types.ObjectId | string;
  githubRepoUrl?: string;
  githubRepoName?: string;
  currentScore: number;
  analysisResult?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const GameSessionSchema = new Schema<IGameSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stack: { type: String, required: true },
  pace: { type: String, required: true },
  problemId: { type: Schema.Types.ObjectId, ref: 'ProblemStatement' },
  githubRepoUrl: { type: String },
  githubRepoName: { type: String },
  currentScore: { type: Number, default: 0 },
  analysisResult: { type: String },
  status: { type: String, default: 'IN_PROGRESS' },
}, { timestamps: true });

export default mongoose.models.GameSession || mongoose.model<IGameSession>('GameSession', GameSessionSchema);
