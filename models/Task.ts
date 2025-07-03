import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  tags: string[];
  description: string;
  testCases: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  tags: [{
    type: String,
    required: true,
    trim: true,
  }],
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  testCases: [{
    type: String,
    required: true,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Add indexes for better query performance
TaskSchema.index({ tags: 1 });
TaskSchema.index({ createdAt: -1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);