
import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, GetObjectCommand, NoSuchKey } from '@aws-sdk/client-s3';
import { s3Client, S3_CONFIG } from '@/app/lib/s3-client';

/**
 * API for managing a global registry of Assignments and Submissions in S3.
 */

export const dynamic = 'force-dynamic';

const ASSIGNMENTS_KEY = 'registry/data/assignments.json';
const SUBMISSIONS_KEY = 'registry/data/submissions.json';

async function getS3Data(key: string) {
  try {
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: S3_CONFIG.bucketName,
      Key: key,
    }));
    const bodyContents = await response.Body?.transformToString();
    return JSON.parse(bodyContents || '[]');
  } catch (e: any) {
    if (e instanceof NoSuchKey || (e.name === 'NoSuchKey')) return [];
    throw e;
  }
}

async function saveS3Data(key: string, data: any) {
  await s3Client.send(new PutObjectCommand({
    Bucket: S3_CONFIG.bucketName,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  }));
}

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get('type');
    const key = type === 'submissions' ? SUBMISSIONS_KEY : ASSIGNMENTS_KEY;
    const data = await getS3Data(key);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Assignments GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    if (action === 'save-assignment') {
      const assignments = await getS3Data(ASSIGNMENTS_KEY);
      const updated = [...assignments, data];
      await saveS3Data(ASSIGNMENTS_KEY, updated);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete-assignment') {
      const assignments = await getS3Data(ASSIGNMENTS_KEY);
      const updated = assignments.filter((a: any) => a.id !== data.id);
      await saveS3Data(ASSIGNMENTS_KEY, updated);
      return NextResponse.json({ success: true });
    }

    if (action === 'save-submission') {
      const submissions = await getS3Data(SUBMISSIONS_KEY);
      const updated = [data, ...submissions];
      await saveS3Data(SUBMISSIONS_KEY, updated);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete-submission') {
      const submissions = await getS3Data(SUBMISSIONS_KEY);
      const updated = submissions.filter((s: any) => s.id !== data.id);
      await saveS3Data(SUBMISSIONS_KEY, updated);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Assignments POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
