import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'lawyer' | 'staff' | 'paralegal';
  contactInfo: {
    phone: string;
    mobile: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  practiceAreas: string[];
  permissions: {
    canViewAllCases: boolean;
    canEditAllCases: boolean;
    canManageUsers: boolean;
    canManageBilling: boolean;
  };
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
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
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'lawyer', 'staff', 'paralegal'],
    default: 'staff',
  },
  contactInfo: {
    phone: String,
    mobile: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
  },
  practiceAreas: [{
    type: String,
  }],
  permissions: {
    canViewAllCases: { type: Boolean, default: false },
    canEditAllCases: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    canManageBilling: { type: Boolean, default: false },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 