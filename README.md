# 🚀 University Portal - Deployment Guide

This application is configured to work in the Cloud using AWS S3 and AWS Amplify. Follow these steps to ensure a successful deployment.

## 🛠️ Step 1: AWS Console Configuration
Before the app can talk to your bucket, ensure these settings are correct in your AWS S3 Console:

1.  **Bucket Name:** `my-assignment-portal-2024`
2.  **Region:** `ap-south-1`
3.  **Permissions Tab -> Block Public Access:** Must be **OFF** (Unchecked).
4.  **Permissions Tab -> CORS:** Copy and paste this JSON block:
    ```json
    [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposedHeaders": ["ETag"]
        }
    ]
    ```

## 🛠️ Step 2: Deployment to AWS Amplify
When you connect your GitHub repository to AWS Amplify, you **MUST** add these environment variables. Amplify blocks variables starting with `AWS_`, so we use the `NEW_` prefix:

1.  Go to **Amplify Console -> Hosting -> Environment variables**.
2.  Add these exactly as named:
    *   `GOOGLE_GENAI_API_KEY`
    *   `NEW_AWS_ACCESS_KEY_ID`
    *   `NEW_AWS_SECRET_ACCESS_KEY`
    *   `NEW_AWS_REGION`
    *   `NEW_AWS_S3_BUCKET`
3.  Click **Save**, then go to **Build Settings** and ensure your app triggers a redeploy.

## 🛠️ Step 3: Local Workstation Verification
To test it here in the workstation:
1.  Check that your `.env` file matches the variables above.
2.  Stop the server (Press `Ctrl+C` in the terminal).
3.  Run `npm run dev`.
4.  If you get "Access Denied", double-check that your IAM user has `AmazonS3FullAccess` and no "Quarantine" policies attached.

## 📦 GitHub Push
If GitHub blocks your push, it means you have credentials inside your code. This version has moved everything to environment variables to prevent this. Run:
`sh git-push-shortcut.sh`
