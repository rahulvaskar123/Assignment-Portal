import { S3Client } from "@aws-sdk/client-s3";

/**
 * AWS S3 Client configuration
 * Uses custom environment variable names to avoid AWS Amplify reserved prefix conflict.
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
  bucketName: process.env.MY_AWS_S3_BUCKET_NAME || "",
};
