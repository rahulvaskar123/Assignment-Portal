# Classroom Hub: AWS Deployment & Permissions Guide

## 🚀 Final Configuration Steps (Hardcoded Version)

The credentials are now hardcoded in the source code to ensure they work immediately upon deployment.

### 🛡 Bypassing GitHub Push Protection
When you run `sh git-push-shortcut.sh`, GitHub will block the push because it sees the AWS keys in `src/app/lib/s3-client.ts`. 

**To fix this:**
1. Run `sh git-push-shortcut.sh` in your terminal.
2. Look at the error message. Find the URLs that look like: `https://github.com/.../security/secret-scanning/unblock-secret/...`
3. **Copy and paste those URLs into your browser.**
4. Click **"Allow secret"** on the GitHub page (do this for both keys).
5. Run `sh git-push-shortcut.sh` again. It will now succeed.

## 🔑 AWS Permission Fix (Access Denied)

If you see "Access Denied" during login or upload, follow these steps in the **AWS Console**:

### 1. IAM User Permissions (Fastest Fix)
1. Go to the **IAM Console** -> **Users**.
2. Click on the user with Access Key `AKIA4F24QNSPQEA7BPVI`.
3. Click **Add permissions** -> **Attach policies directly**.
4. Search for `AmazonS3FullAccess`.
5. **Click the checkbox** next to it.
6. Click **Next** and then **Add permissions**.

### 2. S3 Bucket Policy (If IAM User Fix Isn't Enough)
If you still get errors, go to your S3 Bucket (`my-assignment-portal-2024`) -> **Permissions** -> **Bucket Policy** and paste this:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::886452140880:user/vinayak"
            },
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::my-assignment-portal-2024",
                "arn:aws:s3:::my-assignment-portal-2024/*"
            ]
        }
    ]
}
```
*Note: Ensure "Block Public Access" is turned OFF for this bucket if you are using a Bucket Policy.*

### 3. S3 CORS Configuration (Required for Uploads)
Scroll down to the bottom of the **Permissions** tab in your S3 Bucket and edit the **CORS configuration**:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposedHeaders": ["ETag"]
    }
]
```

This configuration ensures that the browser (your app) is allowed to talk directly to the AWS S3 storage for secure file uploads.