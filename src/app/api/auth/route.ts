
import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, GetObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_CONFIG } from '@/app/lib/s3-client';

/**
 * API for AWS S3-based User Registry
 */

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { action, userType, userData } = await req.json();

    if (action === 'register') {
      const id = userType === 'student' 
        ? userData.studentId.toUpperCase().trim() 
        : userData.email.toLowerCase().replace(/[@.]/g, '_');
      const key = `registry/${userType}s/${id}.json`;

      // Check if user already exists
      try {
        await s3Client.send(new GetObjectCommand({
          Bucket: S3_CONFIG.bucketName,
          Key: key,
        }));
        return NextResponse.json({ error: 'User already exists in S3 Registry' }, { status: 400 });
      } catch (e: any) {
        // Proceed if not found
      }

      await s3Client.send(new PutObjectCommand({
        Bucket: S3_CONFIG.bucketName,
        Key: key,
        Body: JSON.stringify(userData),
        ContentType: 'application/json',
      }));

      return NextResponse.json({ success: true });
    }

    if (action === 'login') {
      const id = userType === 'student' 
        ? userData.id.toUpperCase().trim() 
        : userData.email.toLowerCase().replace(/[@.]/g, '_');
      const key = `registry/${userType}s/${id}.json`;

      try {
        const response = await s3Client.send(new GetObjectCommand({
          Bucket: S3_CONFIG.bucketName,
          Key: key,
        }));

        const bodyContents = await response.Body?.transformToString();
        const storedUser = JSON.parse(bodyContents || '{}');

        if (storedUser.password === userData.password) {
          return NextResponse.json({ success: true, user: storedUser });
        } else {
          return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }
      } catch (e: any) {
        if (e.name === 'NoSuchKey' || e.name === 'NotFound') {
          return NextResponse.json({ error: 'User profile not found. Have you registered yet?' }, { status: 404 });
        }
        return NextResponse.json({ error: `AWS Registry Error: ${e.name}` }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth API Global Exception:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
