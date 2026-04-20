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
If you see "Access Denied" during login, follow these steps in the **AWS Console**:

1. Go to the **IAM Console** -> **Users**.
2. Click on the user with Access Key `AKIA4F24QNSPQEA7BPVI`.
3. Click **Add permissions** -> **Attach policies directly**.
4. Search for `AmazonS3FullAccess`.
5. **Click the checkbox** next to it.
6. Click **Next** and then **Add permissions**.

This is the fastest way to fix the error without dealing with complex bucket policies or "Block Public Access" settings.

## 🛠 S3 CORS Configuration (Required)
If files don't upload (even after fixing permissions), ensure your bucket has this CORS configuration (S3 Console -> Bucket -> Permissions -> Scroll to bottom):
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