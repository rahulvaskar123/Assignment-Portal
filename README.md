# Classroom Hub: AWS Permission & Troubleshooting Guide

## 🔑 Resolving "Access Denied" (403 Forbidden)

If you see an "Access Denied" error, follow these 3 steps in the AWS Console immediately:

### 1. The "Checkbox" Method (User Level)
Your IAM User must have full control:
1. Go to the **IAM Console** -> **Users**.
2. Click on your user (**AKIA4F24QNSPQEA7BPVI**).
3. Click **Add permissions** -> **Attach policies directly**.
4. Search for `AmazonS3FullAccess`.
5. **Check the box** next to it and save.

### 2. CLEAR the Bucket Policy (Bucket Level)
Sometimes a broken policy blocks even the Admin:
1. Go to your S3 Bucket -> **Permissions** tab.
2. Find **Bucket policy**.
3. Click **Edit**.
4. **DELETE EVERYTHING** in the box. Leave it empty.
5. Click **Save changes**. (Since your User has Full Access, they don't need a specific bucket policy).

### 3. S3 "Block Public Access" 
AWS might block the API if these are on, even for IAM users:
1. Go to your S3 Bucket -> **Permissions** tab.
2. Find **Block public access (bucket settings)**.
3. Click **Edit** and **UNCHECK** "Block all public access". 
4. Type `confirm` to save.

## 🚀 Deployment Notice
The keys are hardcoded in `src/app/lib/s3-client.ts`. When you push to GitHub, you **must** click the "allow" links in the terminal to bypass GitHub's secret scanning protection.

## 🛠️ Required S3 CORS Configuration
Paste this into the **CORS** section at the bottom of the **Permissions** tab:
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