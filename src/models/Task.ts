import mongoose from 'mongoose';

export interface ITask extends mongoose.Document {
  title: string;
  description?: string;
  case: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  timeEntries: {
    user: mongoose.Types.ObjectId;
    startTime: Date;
    endTime?: Date;
    duration?: number; // in minutes
    description?: string;
    billable: boolean;
  }[];
  notes: {
    content: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  reminders: {
    date: Date;
    sent: boolean;
  }[];
  customFields: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
  },
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: [true, 'Please specify the associated case'],
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who the task is assigned to'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who created the task'],
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  category: {
    type: String,
  },
  timeEntries: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number,
    },
    description: String,
    billable: {
      type: Boolean,
      default: true,
    },
  }],
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  reminders: [{
    date: Date,
    sent: {
      type: Boolean,
      default: false,
    },
  }],
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema); 