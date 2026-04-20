# Classroom Hub: AWS Deployment Guide

## 🚀 Final Configuration Steps

Amplify reserves the `AWS_` prefix. You **must** use these exact names in the Amplify Console under **App Settings > Environment Variables**:

- `MY_AWS_ACCESS_KEY_ID`: (Your IAM Access Key)
- `MY_AWS_SECRET_ACCESS_KEY`: (Your IAM Secret Key)
- `MY_AWS_REGION`: `ap-south-1`
- `MY_AWS_S3_BUCKET_NAME`: `my-assignment-portal-2024`
- `GEMINI_API_KEY`: `AIzaSyB4UWUcTreh6y4PemKvyxNIQakbQtq6iWQ`

## 🛠 Deployment Fixes
1. **Push Changes:** Run `sh git-push-shortcut.sh` to update GitHub with the new `MY_AWS_` code.
2. **Update Amplify Console:** Rename your variables in Amplify to match the list above (specifically ensure `MY_AWS_S3_BUCKET_NAME` is used).
3. **Redeploy:** In the Amplify Console, click **"Redeploy this version"**.

## 🛡 S3 Permissions
Ensure your bucket has this CORS configuration:
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
