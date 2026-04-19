
import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_CONFIG } from '@/app/lib/s3-client';

/**
 * API for AWS S3-based User Registry
 * This acts as a simple database for Student and Teacher profiles.
 */

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { action, userType, userData } = await req.json();

    if (action === 'register') {
      const id = userType === 'student' ? userData.studentId : userData.email.toLowerCase().replace(/[@.]/g, '_');
      const key = `registry/${userType}s/${id}.json`;

      // Check if user already exists
      try {
        await s3Client.send(new GetObjectCommand({
          Bucket: S3_CONFIG.bucketName,
          Key: key,
        }));
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      } catch (e: any) {
        // Handle region mismatch errors specifically
        if (e.name === 'PermanentRedirect' || e.message?.includes('endpoint')) {
          return NextResponse.json({ 
            error: 'AWS Region Mismatch: Please ensure your AWS_REGION environment variable matches your S3 bucket location.' 
          }, { status: 500 });
        }
        // User doesn't exist, proceed to register
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
      const id = userType === 'student' ? userData.id.toUpperCase() : userData.email.toLowerCase().replace(/[@.]/g, '_');
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
        if (e.name === 'PermanentRedirect' || e.message?.includes('endpoint')) {
          return NextResponse.json({ 
            error: 'AWS Region Mismatch: Please check your S3 bucket region configuration.' 
          }, { status: 500 });
        }
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
