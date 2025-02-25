import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const taskId = formData.get('taskId') as string;

    if (!file || !type || !taskId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${taskId}/${type}/${timestamp}-${file.name}`;

    // Upload to S3
    const buffer = Buffer.from(await file.arrayBuffer());
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || 'developer-portal-attachments',
      Key: filename,
      Body: buffer,
      ContentType: file.type
    }));

    // Create attachment record in database
    const attachment = await prisma.task_attachments.create({
      data: {
        task_id: taskId,
        type,
        url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`,
        title: file.name,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('Error handling attachment:', error);
    return NextResponse.json(
      { error: 'Failed to upload attachment' },
      { status: 500 }
    );
  }
} 