import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { generatePresignedUrl, deleteFile } from '@/lib/s3-utils';

// Schema for file upload request
const uploadRequestSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
});

// Schema for file deletion request
const deleteRequestSchema = z.object({
  attachmentId: z.string().uuid(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate task ID
    const taskId = params.taskId;
    const task = await prisma.developerTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Validate request body
    const body = await req.json();
    const validatedData = uploadRequestSchema.parse(body);

    // Get developer ID
    const developer = await prisma.developer.findUnique({
      where: { email: session.user.email },
    });

    if (!developer) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    // Generate presigned URL
    const { uploadUrl, key } = await generatePresignedUrl(
      taskId,
      validatedData.fileName,
      validatedData.fileType
    );

    // Create attachment record
    const attachment = await prisma.taskAttachment.create({
      data: {
        taskId,
        fileName: validatedData.fileName,
        fileType: validatedData.fileType,
        fileSize: validatedData.fileSize,
        s3Key: key,
        uploadedBy: developer.id,
      },
    });

    return NextResponse.json({
      uploadUrl,
      attachment,
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate request body
    const body = await req.json();
    const validatedData = deleteRequestSchema.parse(body);

    // Get the attachment
    const attachment = await prisma.taskAttachment.findFirst({
      where: {
        id: validatedData.attachmentId,
        taskId: params.taskId,
      },
    });

    if (!attachment) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      );
    }

    // Delete from S3
    await deleteFile(attachment.s3Key);

    // Delete from database
    await prisma.taskAttachment.delete({
      where: { id: attachment.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling file deletion:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all attachments for the task
    const attachments = await prisma.taskAttachment.findMany({
      where: { taskId: params.taskId },
      include: {
        uploadedByDeveloper: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(attachments);
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 