
# Classroom Hub: Deployment Guide

## 🔐 Environment Variables
This project no longer uses hardcoded keys. You must set these variables in your hosting provider (e.g., AWS Amplify):

1. **AWS_ACCESS_KEY_ID**: Your IAM user access key.
2. **AWS_SECRET_ACCESS_KEY**: Your IAM user secret key.
3. **AWS_REGION**: `ap-south-1`
4. **AWS_S3_BUCKET**: `my-assignment-portal-2024`
5. **GOOGLE_GENAI_API_KEY**: Your Gemini API key.

## 🔑 AWS Permission Setup
Ensure your IAM User has the `AmazonS3FullAccess` policy attached directly.

## 🛠️ Required S3 CORS Configuration
Paste this into the **CORS** section of your S3 Bucket Permissions:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

## 🚀 Deployment
1. Set the variables above in the **AWS Amplify Console** -> **Environment Variables**.
2. Trigger a new build.
