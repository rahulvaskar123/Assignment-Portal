import { S3Client } from "@aws-sdk/client-s3";

/**
 * AWS S3 Client configuration.
 * Uses environment variables to bypass GitHub Push Protection and ensure security.
 * Ensure these are set in the Amplify Console with the 'MY_AWS_' prefix.
 */
const region = process.env.MY_AWS_REGION || "ap-south-1";

export const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || "",
  },
});

export const S3_CONFIG = {
  region: region,
  bucketName: process.env.MY_AWS_S3_BUCKET_NAME || "my-assignment-portal-2024",
};
