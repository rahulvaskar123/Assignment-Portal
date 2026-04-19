
import { S3Client } from "@aws-sdk/client-s3";

/**
 * AWS S3 Client configuration
 * Uses environment variables for security.
 * Ensure AWS_REGION matches your bucket's actual region.
 */
const region = process.env.AWS_REGION || "ap-south-1";

export const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const S3_CONFIG = {
  region: region,
  bucketName: process.env.S3_BUCKET_NAME || "assignment-uploads",
};
