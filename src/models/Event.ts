import mongoose from 'mongoose';

export interface IEvent extends mongoose.Document {
  title: string;
  description?: string;
  case?: mongoose.Types.ObjectId;
  client?: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  location?: string;
  type: 'court_date' | 'meeting' | 'appointment' | 'deadline' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  participants: {
    user: mongoose.Types.ObjectId;
    role: string;
    status: 'accepted' | 'declined' | 'tentative' | 'pending';
  }[];
  reminders: {
    minutesBefore: number;
    sent: boolean;
  }[];
  notes: {
    content: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    exceptions?: Date[];
  };
  customFields: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
  },
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide a start time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time'],
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
  },
  type: {
    type: String,
    enum: ['court_date', 'meeting', 'appointment', 'deadline', 'other'],
    default: 'meeting',
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: String,
    status: {
      type: String,
      enum: ['accepted', 'declined', 'tentative', 'pending'],
      default: 'pending',
    },
  }],
  reminders: [{
    minutesBefore: {
      type: Number,
      required: true,
    },
    sent: {
      type: Boolean,
      default: false,
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
  recurrence: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    interval: {
      type: Number,
      default: 1,
    },
    endDate: Date,
    exceptions: [Date],
  },
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema); 