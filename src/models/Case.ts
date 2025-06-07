import mongoose from 'mongoose';

export interface ICase extends mongoose.Document {
  caseNumber: string;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'pending' | 'archived';
  practiceArea: string;
  client: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId[];
  responsibleAttorney: mongoose.Types.ObjectId;
  openDate: Date;
  closeDate?: Date;
  billingMethod: 'hourly' | 'flat' | 'contingency' | 'other';
  billingRate?: number;
  estimatedValue?: number;
  actualValue?: number;
  documents: {
    name: string;
    url: string;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
    size: number;
    type: string;
    category: string;
    description?: string;
    version?: number;
  }[];
  documentRequests: mongoose.Types.ObjectId[];
  notes: {
    content: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    attachments?: {
      name: string;
      url: string;
      size: number;
      type: string;
    }[];
  }[];
  tasks: mongoose.Types.ObjectId[];
  events: mongoose.Types.ObjectId[];
  contacts: {
    name: string;
    role: string;
    email: string;
    phone: string;
  }[];
  customFields: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: [true, 'Please provide a case number'],
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a case title'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a case description'],
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'pending', 'archived'],
    default: 'open',
  },
  practiceArea: {
    type: String,
    required: [true, 'Please specify the practice area'],
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Please specify the client'],
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  responsibleAttorney: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify the responsible attorney'],
  },
  openDate: {
    type: Date,
    default: Date.now,
  },
  closeDate: {
    type: Date,
  },
  billingMethod: {
    type: String,
    enum: ['hourly', 'flat', 'contingency', 'other'],
    required: [true, 'Please specify the billing method'],
  },
  billingRate: {
    type: Number,
  },
  estimatedValue: {
    type: Number,
  },
  actualValue: {
    type: Number,
  },
  documents: [{
    name: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    size: Number,
    type: String,
    category: String,
    description: String,
    version: Number,
  }],
  documentRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentRequest',
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
    attachments: [{
      name: String,
      url: String,
      size: Number,
      type: String,
    }],
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  contacts: [{
    name: String,
    role: String,
    email: String,
    phone: String,
  }],
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema); 