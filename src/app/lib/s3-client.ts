
import { S3Client } from "@aws-sdk/client-s3";

/**
 * AWS S3 Client configuration using environment variables.
 * These must be set in your AWS Amplify Environment Variables console.
 */
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const S3_CONFIG = {
  region: process.env.AWS_REGION || "ap-south-1",
  bucketName: process.env.AWS_S3_BUCKET || "my-assignment-portal-2024",
};
