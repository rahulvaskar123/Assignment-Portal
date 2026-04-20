
# Classroom Hub: Deployment Guide

## 🔐 Environment Variables
This project uses Environment Variables for security. You **must** set these in your AWS Amplify Console (Hosting -> Environment variables) for the app to work:

1. **AWS_ACCESS_KEY_ID**: Your IAM user access key.
2. **AWS_SECRET_ACCESS_KEY**: Your IAM user secret key.
3. **AWS_REGION**: `ap-south-1`
4. **AWS_S3_BUCKET**: `my-assignment-portal-2024`
5. **GOOGLE_GENAI_API_KEY**: Your Gemini API key.

## 🔑 IAM User Setup (assignment-portal-app)
Based on the current IAM configuration, ensure the following:

1. **Policies**: The user must have `AmazonS3FullAccess` attached directly.
2. **⚠️ IMPORTANT (Quarantine Policy)**: If you see `AWSCompromisedKeyQuarantineV3` in your console (as shown in your screenshot), AWS has blocked your current keys because they were exposed.
   - **Action**: Delete your current Access Keys in the "Security credentials" tab.
   - **Action**: Create **NEW** Access Keys.
   - **Action**: Request AWS Support to remove the Quarantine policy, or create a new IAM user entirely if access persists as Denied.
   - **Action**: Update your Amplify Environment Variables with the **NEW** keys.

## 🛠️ Required S3 CORS Configuration
Paste this into the **CORS** section of your S3 Bucket Permissions to allow file uploads from the browser:
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
1. Run `sh git-push-shortcut.sh` to push your code to GitHub.
2. Go to **AWS Amplify Console**.
3. Set the variables mentioned above.
4. Trigger a new build/redeploy.
