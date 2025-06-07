import mongoose from 'mongoose';

export interface IDocumentRequest extends mongoose.Document {
  case: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId;
  requestedFrom: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate?: Date;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  documents: {
    name: string;
    url: string;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
    size: number;
    type: string;
  }[];
  messages: {
    content: string;
    sentBy: mongoose.Types.ObjectId;
    sentAt: Date;
    attachments?: {
      name: string;
      url: string;
      size: number;
      type: string;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentRequestSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: [true, 'Please specify the case'],
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who requested the document'],
  },
  requestedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Please specify who needs to submit the document'],
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the request'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the requested document'],
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'approved', 'rejected'],
    default: 'pending',
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
  }],
  messages: [{
    content: String,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sentAt: {
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
}, {
  timestamps: true,
});

export default mongoose.models.DocumentRequest || mongoose.model<IDocumentRequest>('DocumentRequest', DocumentRequestSchema); 