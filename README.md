# Classroom Hub: AWS Production Ready

A full-stack enterprise portal for academic assignment management using Next.js, AWS S3, and AWS Lambda.

## 🚀 AWS Free Tier Deployment Guide

This project is architected to run entirely within the **AWS Free Tier**. Follow these steps to move from local development to the live AWS Cloud.

### 1. Source Code Setup (Direct from Terminal)
1. Create a new, empty repository on your GitHub account.
2. Open the terminal in this editor.
3. Run `sh git-push-shortcut.sh`.
4. When prompted for a password, **paste your Personal Access Token (PAT)**.
5. Once complete, your code is live on GitHub.

### 2. AWS Amplify Hosting (Frontend & API)
- Go to the **AWS Management Console** and search for **AWS Amplify**.
- Click **"Create new app"** -> **"Host web app"**.
- Connect your GitHub repository and select the `main` branch.
- Amplify will detect Next.js 15.
- **Environment Variables:** In the Amplify sidebar, go to **"Environment variables"** and add:
  - `AWS_ACCESS_KEY_ID`: Your IAM user access key.
  - `AWS_SECRET_ACCESS_KEY`: Your IAM user secret key.
  - `AWS_REGION`: e.g., `ap-south-1`.
  - `S3_BUCKET_NAME`: The name of your S3 bucket.
- Click **"Save and deploy"**.

### 3. AWS S3 Configuration (Storage)
- Create a bucket in S3 (e.g., `my-classroom-hub-bucket`).
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

### 4. AWS Lambda Setup (Background Processing)
- Create a Lambda function named `AssignmentMetadataProcessor` (Node.js 20.x).
- Paste code from `src/lambda/handler.js`.
- Add an **S3 Trigger** for your bucket on "All object create events".

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

## 🛠️ Verification
1. **Cloud Sync:** Log in and click "Sync Cloud" to fetch data from S3.
2. **Lambda Logs:** Check CloudWatch Logs to see real-time metadata extraction.
