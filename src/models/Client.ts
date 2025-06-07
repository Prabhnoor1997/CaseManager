import mongoose from 'mongoose';

export interface IClient extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  company?: {
    name: string;
    position: string;
  };
  type: 'individual' | 'business' | 'organization';
  status: 'active' | 'inactive' | 'prospect';
  notes?: string;
  preferredContactMethod: 'email' | 'phone' | 'mail';
  billingInfo: {
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod?: 'credit_card' | 'bank_transfer' | 'check';
    paymentTerms?: string;
    taxId?: string;
  };
  customFields: {
    [key: string]: any;
  };
  cases: mongoose.Types.ObjectId[];
  contacts: {
    name: string;
    relationship: string;
    email: string;
    phone: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    maxlength: [50, 'First name cannot be more than 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    maxlength: [50, 'Last name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  mobile: {
    type: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  company: {
    name: String,
    position: String,
  },
  type: {
    type: String,
    enum: ['individual', 'business', 'organization'],
    default: 'individual',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'prospect'],
    default: 'active',
  },
  notes: {
    type: String,
  },
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'mail'],
    default: 'email',
  },
  billingInfo: {
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'check'],
    },
    paymentTerms: String,
    taxId: String,
  },
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  cases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
  }],
  contacts: [{
    name: String,
    relationship: String,
    email: String,
    phone: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema); 