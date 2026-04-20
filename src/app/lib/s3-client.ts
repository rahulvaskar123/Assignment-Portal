
import { S3Client } from "@aws-sdk/client-s3";

/**
 * AWS S3 Client configuration for the Workstation.
 * Uses custom prefixes (NEW_AWS_) to avoid Lambda/Amplify reserved variable conflicts.
 */
const region = (process.env.NEW_AWS_REGION || "ap-south-1").trim();
const accessKeyId = (process.env.NEW_AWS_ACCESS_KEY_ID || "").trim();
const secretAccessKey = (process.env.NEW_AWS_SECRET_ACCESS_KEY || "").trim();

if (!accessKeyId || !secretAccessKey) {
  console.warn("⚠️ AWS Credentials missing in workstation .env file! Ensure NEW_AWS_... variables are set.");
}

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const S3_CONFIG = {
  region,
  bucketName: (process.env.NEW_AWS_S3_BUCKET || "my-assignment-portal-2024").trim(),
};
