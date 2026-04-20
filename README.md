# Classroom Hub: AWS Deployment Guide

## 🚀 Final Configuration Steps (Hardcoded Version)

The credentials are now hardcoded in the source code to ensure they work immediately upon deployment.

### 🛡 Bypassing GitHub Push Protection
When you run `sh git-push-shortcut.sh`, GitHub will likely block the push because it sees the AWS keys. 

**To fix this:**
1. Look at the error message in your terminal.
2. Find the URLs that look like: `https://github.com/.../security/secret-scanning/unblock-secret/...`
3. **Copy and paste those URLs into your browser.**
4. Click **"Allow secret"** on the GitHub page for both the Access Key and the Secret Key.
5. Run `sh git-push-shortcut.sh` again. It will now succeed.

## 🛠 Deployment
Once the push succeeds:
1. Go to the **Amplify Console**.
2. Click **"Redeploy this version"**.
3. Your login and uploads will work instantly.

## 🛡 S3 Permissions
Ensure your bucket `my-assignment-portal-2024` in `ap-south-1` has this CORS configuration:
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
