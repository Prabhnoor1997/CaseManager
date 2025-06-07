import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import DocumentRequest from '@/models/DocumentRequest';
import Case from '@/models/Case';
import { getUploadUrl, getFileUrl, generateFileName } from '@/utils/fileUpload';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { caseId, title, description, dueDate } = await req.json();

    await connectDB();

    // Create document request
    const documentRequest = await DocumentRequest.create({
      case: caseId,
      requestedBy: session.user.id,
      title,
      description,
      dueDate,
    });

    // Update case with document request
    await Case.findByIdAndUpdate(caseId, {
      $push: { documentRequests: documentRequest._id },
    });

    return NextResponse.json(documentRequest);
  } catch (error) {
    console.error('Error creating document request:', error);
    return NextResponse.json(
      { error: 'Error creating document request' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('caseId');

    await connectDB();

    const documentRequests = await DocumentRequest.find({ case: caseId })
      .populate('requestedBy', 'name')
      .populate('requestedFrom', 'firstName lastName')
      .sort({ createdAt: -1 });

    return NextResponse.json(documentRequests);
  } catch (error) {
    console.error('Error fetching document requests:', error);
    return NextResponse.json(
      { error: 'Error fetching document requests' },
      { status: 500 }
    );
  }
} 