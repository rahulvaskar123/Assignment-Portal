import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_CONFIG } from '@/app/lib/s3-client';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.MY_AWS_S3_BUCKET_NAME) {
      return NextResponse.json({ error: 'S3 Configuration missing' }, { status: 500 });
    }

    const { fileName, contentType, studentId, subject, operation } = await req.json();

    if (operation === 'get') {
      const command = new GetObjectCommand({
        Bucket: S3_CONFIG.bucketName,
        Key: fileName,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return NextResponse.json({ url });
    }

    const timestamp = Date.now();
    const key = `${studentId}_${subject.replace(/\s+/g, '-')}_${timestamp}_${fileName}`;

    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });

    return NextResponse.json({ url, key });
  } catch (error: any) {
    console.error('S3 Presigned Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
