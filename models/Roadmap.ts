
import mongoose, { Schema, Model } from "mongoose";

export interface IDailyTask {
  day: number;
  title: string;
  description: string;

  // Specific tasks
  aptitudeTask: string;
  dsaTask: string;
  coreTask: string;

  isCompleted: boolean;
  dateCompleted?: Date;

  resources?: string[]; // Links to tutorials etc
}

export interface IWeeklyPlan {
  week: number;
  theme: string;
  goals: string[];
  dailyTasks: IDailyTask[];
}

export interface IRoadmap {
  userId: mongoose.Schema.Types.ObjectId;
  role: string;
  generatedAt: Date;
  months: {
    month: number;
    weeks: IWeeklyPlan[];
  }[];
  status: 'active' | 'completed' | 'archived';
}

const RoadmapSchema = new Schema<IRoadmap>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
  months: [{
    month: { type: Number, required: true },
    weeks: [{
      week: { type: Number, required: true },
      theme: { type: String },
      goals: [String],
      dailyTasks: [{
        day: { type: Number },
        title: { type: String },
        description: { type: String },
        aptitudeTask: { type: String },
        dsaTask: { type: String },
        coreTask: { type: String },
        isCompleted: { type: Boolean, default: false },
        dateCompleted: { type: Date },
        resources: [String]
      }]
    }]
  }],
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' }
});

export const Roadmap: Model<IRoadmap> = mongoose.models?.Roadmap || mongoose.model<IRoadmap>("Roadmap", RoadmapSchema);
