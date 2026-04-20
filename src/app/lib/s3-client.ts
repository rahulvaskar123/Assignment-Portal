import { S3Client } from "@aws-sdk/client-s3";

/**
 * AWS S3 Client configuration - Hardcoded for immediate deployment.
 * Region and credentials are set directly to bypass environment variable propagation issues.
 */
const region = "ap-south-1";

export const s3Client = new S3Client({
  region: region,
  credentials: {
    // PASTE YOUR ACTUAL ACCESS KEY HERE
    accessKeyId: "YOUR_ACCESS_KEY_HERE",
    // PASTE YOUR ACTUAL SECRET KEY HERE
    secretAccessKey: "YOUR_SECRET_KEY_HERE",
  },
});

export const S3_CONFIG = {
  region: region,
  bucketName: "my-assignment-portal-2024",
};
