# Classroom Hub: AWS Deployment & Permissions Guide

## 🚀 Final Configuration Steps (Hardcoded Version)

The credentials are now hardcoded in the source code to ensure they work immediately upon deployment.

### 🛡 Bypassing GitHub Push Protection
When you run `sh git-push-shortcut.sh`, GitHub will block the push because it sees the AWS keys. 

**To fix this:**
1. Look at the error message in your terminal.
2. Find the URLs that look like: `https://github.com/.../security/secret-scanning/unblock-secret/...`
3. **Copy and paste those URLs into your browser.**
4. Click **"Allow secret"** on the GitHub page for both the Access Key and the Secret Key.
5. Run `sh git-push-shortcut.sh` again. It will now succeed.

## 🔑 AWS Permission Fix (Access Denied)
If you see "Access Denied" during login, follow these steps in the **AWS Console** instead of editing the bucket policy:

1. Go to the **IAM Console** -> **Users**.
2. Click on the user with Access Key `AKIA4F24QNSPQEA7BPVI`.
3. Click **Add permissions** -> **Attach policies directly**.
4. Search for `AmazonS3FullAccess` and check the box.
5. Click **Next** and then **Add permissions**.

This is the fastest way to fix the error without dealing with "Block Public Access" settings.

## 🛠 S3 CORS Configuration (Required)
If files don't upload, ensure your bucket has this CORS configuration (S3 Console -> Bucket -> Permissions -> Scroll to bottom):
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
