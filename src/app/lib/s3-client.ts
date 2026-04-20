
import { S3Client } from "@aws-sdk/client-s3";

/**
 * AWS S3 Client configuration.
 * Automatically trims whitespace from environment variables to prevent "SignatureDoesNotMatch" errors.
 */
const region = (process.env.AWS_REGION || "ap-south-1").trim();
const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || "").trim();
const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || "").trim();

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const S3_CONFIG = {
  region,
  bucketName: (process.env.AWS_S3_BUCKET || "my-assignment-portal-2024").trim(),
};
