# Classroom Hub: AWS Deployment Guide

This project is optimized for deployment on AWS Amplify using S3 for storage and Auth.

## 🚀 Deployment Steps

### 1. Update Environment Variables in Amplify
Amplify reserves the `AWS_` prefix. You **must** use these exact names in the Amplify Console under **App Settings > Environment Variables**:

- `MY_AWS_ACCESS_KEY_ID`: Your IAM User Access Key
- `MY_AWS_SECRET_ACCESS_KEY`: Your IAM User Secret Key
- `MY_AWS_REGION`: Your S3 bucket region (e.g., `ap-south-1`)
- `S3_BUCKET_NAME`: `my-assignment-portal-2024`
- `GEMINI_API_KEY`: `AIzaSyB4UWUcTreh6y4PemKvyxNIQakbQtq6iWQ`

### 2. Push Changes to GitHub
Run the following command in the terminal to sync these code changes with your repository:
```bash
sh git-push-shortcut.sh
```

### 3. Redeploy in Amplify
After pushing, go to the Amplify Console and click **"Redeploy this version"** to apply the new environment variable logic.

### 4. S3 Bucket Permissions (CORS)
Ensure your S3 bucket has the following CORS configuration:
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

### 🛠 Troubleshooting Connection Errors
If you see an "Endpoint" or "Region Mismatch" error:
1. Verify `MY_AWS_REGION` in Amplify matches your bucket's physical location (e.g., `ap-south-1`).
2. Ensure the IAM user has `s3:PutObject`, `s3:GetObject`, and `s3:ListBucket` permissions.
