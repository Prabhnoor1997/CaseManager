import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Case from '../src/models/Case';
import Client from '../src/models/Client';
import DocumentRequest from '../src/models/DocumentRequest';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Case-manager';

async function initDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Case.deleteMany({});
    await Client.deleteMany({});
    await DocumentRequest.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',  // The password will be hashed by the User model's pre-save hook
      role: 'admin',
      contactInfo: {
        phone: '123-456-7890',
        address: '123 Admin St',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
      },
      practiceAreas: ['General Practice'],
      permissions: {
        canViewAllCases: true,
        canEditAllCases: true,
        canManageUsers: true,
        canManageBilling: true,
      },
    });

    console.log('Created admin user:', admin.email);

    // Create a lawyer
    const lawyer = await User.create({
      name: 'John Lawyer',
      email: 'lawyer@example.com',
      password: 'admin123',  // The password will be hashed by the User model's pre-save hook
      role: 'lawyer',
      contactInfo: {
        phone: '123-456-7891',
        address: '456 Lawyer Ave',
        city: 'Lawyer City',
        state: 'Lawyer State',
        zipCode: '12346',
      },
      practiceAreas: ['Criminal Law', 'Family Law'],
      permissions: {
        canViewAllCases: true,
        canEditAllCases: true,
        canManageUsers: false,
        canManageBilling: true,
      },
    });

    console.log('Created lawyer user:', lawyer.email);

    // Create a client
    const client = await Client.create({
      firstName: 'Jane',
      lastName: 'Client',
      email: 'client@example.com',
      phone: '123-456-7892',
      address: {
        street: '789 Client Blvd',
        city: 'Client City',
        state: 'Client State',
        zipCode: '12347',
        country: 'USA',
      },
      type: 'individual',
      status: 'active',
      preferredContactMethod: 'email',
    });

    console.log('Created client:', client.email);

    // Create a case
    const case_ = await Case.create({
      caseNumber: '2023-001',
      title: 'Sample Case',
      description: 'This is a sample case for testing purposes',
      status: 'open',
      practiceArea: 'Criminal Law',
      client: client._id,
      assignedTo: [lawyer._id],
      responsibleAttorney: lawyer._id,
      billingMethod: 'hourly',
      billingRate: 250,
    });

    console.log('Created case:', case_.caseNumber);

    // Create a document request
    const docRequest = await DocumentRequest.create({
      case: case_._id,
      requestedBy: lawyer._id,
      requestedFrom: client._id,
      title: 'Initial Documents',
      description: 'Please provide the following documents: ID, proof of address, and any relevant contracts.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'pending',
    });

    console.log('Created document request:', docRequest.title);

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDB(); 