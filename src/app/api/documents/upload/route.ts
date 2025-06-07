import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import DocumentRequest from '@/models/DocumentRequest';
import { getUploadUrl, generateFileName } from '@/utils/fileUpload';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { requestId, fileName, fileType } = await req.json();

    await connectDB();

    // Generate a unique file name
    const uniqueFileName = generateFileName(fileName);

    // Get upload URL
    const uploadUrl = await getUploadUrl(uniqueFileName, fileType);

    // Update document request with the new document
    await DocumentRequest.findByIdAndUpdate(requestId, {
      $push: {
        documents: {
          name: fileName,
          url: uniqueFileName,
          uploadedBy: session.user.id,
          size: 0, // Will be updated after upload
          type: fileType,
        },
      },
    });

    return NextResponse.json({ uploadUrl, fileName: uniqueFileName });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Error generating upload URL' },
      { status: 500 }
    );
  }
} 