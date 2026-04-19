
# Classroom Hub: AWS Production Ready

A full-stack enterprise portal for academic assignment management using Next.js, AWS S3, and AWS Lambda.

## 🚀 AWS Free Tier Deployment Guide

This project is architected to run entirely within the **AWS Free Tier**. Follow these steps to move from local development to the live AWS Cloud.

### 1. Source Code Setup (Direct from Terminal)
1. Create a new, empty repository on your GitHub account.
2. Open the terminal in this editor.
3. Run `sh git-push-shortcut.sh`.
4. When prompted for your PAT, **paste the token you generated**.
5. Once complete, your code is live on GitHub.

### 2. AWS Amplify Hosting (Frontend & API)
- Go to the **AWS Management Console** and search for **AWS Amplify**.
- Click **"Create new app"** -> **"Host web app"**.
- Connect your GitHub repository and select the `main` branch.
- Amplify will detect Next.js.
- **Environment Variables (CRITICAL):** In the Amplify sidebar, go to **"App settings"** -> **"Environment variables"** and add:
  - `AWS_ACCESS_KEY_ID`: Your IAM user access key.
  - `AWS_SECRET_ACCESS_KEY`: Your IAM user secret key.
  - `AWS_REGION`: The region where your S3 bucket is located (e.g., `us-east-1`). **MUST MATCH BUCKET REGION.**
  - `S3_BUCKET_NAME`: The name of your S3 bucket.
- Click **"Save and deploy"**.

### 3. Troubleshooting Login Failures
If the app loads but you cannot login:
1. **Check Environment Variables:** Ensure the names in Amplify match the list above exactly.
2. **Region Check:** Go to your S3 bucket in the AWS console, look at the "Properties" tab, and verify the "AWS Region" (e.g., US East (N. Virginia) is `us-east-1`).
3. **IAM Permissions:** Ensure your IAM User has a policy attached that allows `s3:GetObject` and `s3:PutObject` for the bucket `arn:aws:s3:::your-bucket-name/*`.
4. **Logs:** In Amplify, go to "Monitoring" -> "CloudWatch Logs" to see specific server-side error messages from the API.

### 4. AWS S3 Configuration (Storage)
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

## 📂 Architecture Overview
```
[ Frontend (AWS Amplify) ] 
      |
      |-- [ Auth & Data Registry ] --> AWS S3 (registry/*.json)
      |-- [ File Uploads ] ----------> AWS S3 (Bucket Root)
                                         |
                                         V (S3 Event Trigger)
                                   [ AWS Lambda ] (Metadata Logger)
```
