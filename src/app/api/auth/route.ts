import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_CONFIG } from '@/app/lib/s3-client';

/**
 * API for AWS S3-based User Registry - Hardcoded Logic
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
        // If not found, proceed
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
        console.error('S3 Auth Error Details:', {
          name: e.name,
          message: e.message,
          bucket: S3_CONFIG.bucketName,
          key: key
        });

        if (e.name === 'NoSuchKey' || e.name === 'NotFound') {
          return NextResponse.json({ error: 'User profile not found. Please register first.' }, { status: 404 });
        }
        
        if (e.name === 'AccessDenied' || e.name === 'Forbidden') {
          return NextResponse.json({ 
            error: `AWS Access Denied. Ensure IAM User has S3FullAccess and Bucket '${S3_CONFIG.bucketName}' allows access.` 
          }, { status: 403 });
        }

        return NextResponse.json({ error: `AWS Connection Error: ${e.name}` }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth API Global Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
