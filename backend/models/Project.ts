import mongoose, { Schema, Document } from 'mongoose';

export interface ITechSelection {
  techId: string;
}

export interface IFeature {
  title: string;
  description: string;
  effort: number;
  impact: number;
}

export interface ISimulationRun {
  innovation: number;
  execution: number;
  design: number;
  pitch: number;
  bonus: number;
  totalScore: number;
  aiFeedback: string;
}

export interface IProject extends Document {
  title: string;
  description: string;
  difficulty: string;
  userId: mongoose.Types.ObjectId | string;
  techSelections: ITechSelection[];
  features: IFeature[];
  simulationRun?: ISimulationRun;
  createdAt: Date;
}

const TechSelectionSchema = new Schema<ITechSelection>({
  techId: { type: String, required: true },
});

const FeatureSchema = new Schema<IFeature>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  effort: { type: Number, required: true },
  impact: { type: Number, required: true },
});

const SimulationRunSchema = new Schema<ISimulationRun>({
  innovation: { type: Number, required: true },
  execution: { type: Number, required: true },
  design: { type: Number, required: true },
  pitch: { type: Number, required: true },
  bonus: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  aiFeedback: { type: String, required: true },
});

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  techSelections: [TechSelectionSchema],
  features: [FeatureSchema],
  simulationRun: SimulationRunSchema,
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
