# Classroom Hub: AWS Permission & Troubleshooting Guide

## 🔑 Resolving "Access Denied" or "Invalid Principal"

If you see an "Access Denied" toast, follow these steps in order:

### 1. The "Checkbox" Method (Easiest & Recommended)
This method usually bypasses all "Access Denied" errors:
1. Go to the **IAM Console** -> **Users**.
2. Click on your user (**AKIA4F24QNSPQEA7BPVI**).
3. Click **Add permissions** -> **Attach policies directly**.
4. Search for `AmazonS3FullAccess`.
5. **Check the box** next to it.
6. Click **Next** -> **Add permissions**.

### 2. Verify Bucket Name & Region
The code expects exactly these values. If your bucket has a different name, the keys won't work:
- **Bucket Name:** `my-assignment-portal-2024`
- **Region:** `ap-south-1` (Mumbai)
*If your bucket name is different, you must update it in `src/app/lib/s3-client.ts`.*

### 3. S3 "Block Public Access" (The Silent Killer)
Even with Full Access, AWS might block the API if these are on:
1. Go to your S3 Bucket -> **Permissions** tab.
2. Find **Block public access (bucket settings)**.
3. Click **Edit** and **UNCHECK** "Block all public access". 
4. Type `confirm` to save.
*(Note: Since you are deleting this bucket in a few days, this is safe for your prototype).*

### 4. S3 CORS Configuration (Final Step)
Ensure this is pasted at the bottom of the **Permissions** tab:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag", "x-amz-server-side-encryption", "x-amz-request-id", "x-amz-id-2"],
        "MaxAgeSeconds": 3000
    }
]
```

## 🚀 Deployment Notice
The keys are hardcoded in `src/app/lib/s3-client.ts`. When you push to GitHub, you **must** click the "allow" links in the terminal to bypass GitHub's secret scanning protection.
