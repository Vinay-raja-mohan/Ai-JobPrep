
import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string; // Optional if using OAuth later, but mandatory for Credentials
  image?: string;

  // Profile Data
  targetRole?: string;
  coreSkill?: string;
  currentLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  dailyStudyTime?: number; // in minutes
  goalTimeline?: '3 months' | '6 months';

  // Progress Tracking
  streak: number;
  shields: number;
  longestStreak: number;
  lastActiveDate: Date;
  lastStreakIncrement?: Date;

  // Gamification
  badges: string[];
  points: number;

  // Stats
  totalStudyTime: {
    aptitude: number;
    dsa: number;
    core: number;
  };

  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  image: { type: String },

  targetRole: { type: String },
  coreSkill: { type: String },
  currentLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  dailyStudyTime: { type: Number, default: 60 },
  goalTimeline: { type: String },

  streak: { type: Number, default: 0 },
  shields: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  lastStreakIncrement: { type: Date },

  badges: { type: [String], default: [] },
  points: { type: Number, default: 0 },

  totalStudyTime: {
    aptitude: { type: Number, default: 0 },
    dsa: { type: Number, default: 0 },
    core: { type: Number, default: 0 },
  },

  createdAt: { type: Date, default: Date.now },
});

export const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);
