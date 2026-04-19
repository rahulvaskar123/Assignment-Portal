# Classroom Hub: AWS Production Ready

A full-stack enterprise portal for academic assignment management using Next.js, AWS S3, and AWS Lambda.

## 🚀 AWS Free Tier Deployment Guide

This project is architected to run entirely within the **AWS Free Tier**. Follow these steps to move from local development to the live AWS Cloud.

### 1. Source Code Setup
- Push this entire project to a private repository on **GitHub**, **GitLab**, or **Bitbucket**.
- You can use the `git-push-shortcut.sh` script in the root directory to do this quickly from the terminal.

### 2. AWS Amplify Hosting (Frontend & API)
- Go to the **AWS Management Console** and search for **AWS Amplify**.
- Click **"Create new app"** -> **"Host web app"**.
- Connect your repository and select the branch (usually `main`).
- Amplify will detect Next.js 15. In the **"Build settings"**, it will use the `amplify.yml` included in this project.
- **IMPORTANT:** Go to **"Environment variables"** in the Amplify sidebar and add:
  - `AWS_ACCESS_KEY_ID`: Your IAM user access key.
  - `AWS_SECRET_ACCESS_KEY`: Your IAM user secret key.
  - `AWS_REGION`: e.g., `ap-south-1`.
  - `S3_BUCKET_NAME`: The name of your S3 bucket.
- Click **"Save and deploy"**. Once finished, Amplify will provide a `https://master.xxx.amplifyapp.com` URL.

### 3. AWS S3 Configuration (Storage)
- Create a bucket in S3 (e.g., `my-classroom-hub-bucket`).
- **Permissions:** Ensure the IAM user associated with your Access Keys has `AmazonS3FullAccess` policy attached.
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
*(Note: In production, replace `"*"` in AllowedOrigins with your Amplify URL).*

### 4. AWS Lambda Setup (Background Processing)
- Go to **AWS Lambda** and click **"Create function"**.
- Name it `AssignmentMetadataProcessor`, use **Node.js 20.x**.
- Paste the code from `src/lambda/handler.js` into the Lambda code editor.
- Click **"Add trigger"** -> select **S3**.
- Select your bucket and set Event type to **"All object create events"**.
- Ensure the Lambda's Execution Role has permissions to read from S3.

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
1. **Cloud Sync:** Log in and click "Sync Cloud". If successful, your dashboard will populate from the `registry/` folder in S3.
2. **Lambda Logs:** After uploading a file, check **CloudWatch Logs** for your Lambda to see the extracted metadata in real-time.

## 🔐 Security 
For maximum security, ensure your IAM user follows the principle of least privilege. Use the Mumbai University IT Engineering curriculum as the default structure for all classroom data.
