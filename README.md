
# Classroom Hub: AWS Production Ready

A full-stack enterprise portal for academic assignment management using Next.js, AWS S3, and AWS Lambda.

## 🚀 AWS Free Tier Deployment Guide

This project is architected to run entirely within the **AWS Free Tier**. Follow these steps to move from local development to the live AWS Cloud.

### 1. Source Code Setup (Direct from Terminal)
1. Create a new, empty repository on your GitHub account.
2. Open the terminal in this editor.
3. Run `sh git-push-shortcut.sh`.
4. When prompted, provide your GitHub URL and Personal Access Token (PAT).

### 2. AWS Amplify Hosting (Frontend & API)
- Go to the **AWS Management Console** and search for **AWS Amplify**.
- Click **"Create new app"** -> **"Host web app"**.
- Connect your GitHub repository and select the `main` branch.
- **Environment Variables (CRITICAL):** In the Amplify sidebar, go to **"App settings"** -> **"Environment variables"**. 
- **NOTE:** Amplify reserves the `AWS_` prefix. You MUST use these exact names:
  - `MY_AWS_ACCESS_KEY_ID`: Your IAM user access key.
  - `MY_AWS_SECRET_ACCESS_KEY`: Your IAM user secret key.
  - `MY_AWS_REGION`: The region of your S3 bucket (e.g., `ap-south-1`).
  - `S3_BUCKET_NAME`: The name of your S3 bucket.
  - `GEMINI_API_KEY`: Your Google Gemini AI API key.
- Click **"Save and deploy"**.

### 3. AWS S3 Configuration (Storage)
- Create a bucket in S3.
- **CORS:** Go to the bucket's **Permissions** tab -> **CORS** and paste:
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

### 4. Troubleshooting Login Failures
1. **Reserved Prefix Error:** Ensure you used `MY_AWS_ACCESS_KEY_ID` and NOT `AWS_ACCESS_KEY_ID`.
2. **Redeploy:** If you update variables, you must click "Redeploy this version" in Amplify.
3. **Region Check:** Ensure `MY_AWS_REGION` matches the "AWS Region" shown in your S3 Bucket properties.

## 🗑️ Managing Your Deployment
- To delete the app, go to the **AWS Amplify** dashboard, click **"Actions"** -> **"Delete app"**.
