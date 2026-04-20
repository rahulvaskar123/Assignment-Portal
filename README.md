# 🚀 University Portal - Deployment Guide

This application is configured to work in the Cloud using AWS S3 and AWS Amplify. Follow these steps to ensure a successful deployment.

## 🛠️ Step 1: AWS Console Configuration
Before the app can talk to your bucket, ensure these settings are correct in your AWS S3 Console:

1.  **Bucket Name:** `my-assignment-portal-2024`
2.  **Verify Region:** Look at your bucket list in S3. Note the exact region (e.g., `us-east-1` or `ap-south-1`).
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
2.  Add these exactly as named (Ensure NO leading or trailing spaces):
    *   `GOOGLE_GENAI_API_KEY`
    *   `NEW_AWS_ACCESS_KEY_ID`
    *   `NEW_AWS_SECRET_ACCESS_KEY`
    *   `NEW_AWS_REGION` (Must match the bucket's region exactly)
    *   `NEW_AWS_S3_BUCKET`
3.  Click **Save**, then go to **Build Settings** and ensure your app triggers a redeploy.

## ⚠️ Troubleshooting: "AuthorizationHeaderMalformed"
If you see this error on Amplify but NOT on the workstation:

1.  **Region Check:** The region in your Amplify Environment Variables (`NEW_AWS_REGION`) **MUST** match the physical location of the bucket. If the bucket is in `us-east-1` and your variable says `ap-south-1`, it will fail with this error.
2.  **Invisible Spaces:** When copying keys into the Amplify UI, sometimes an invisible space or newline is added at the end. Delete the variable in Amplify and re-type it manually to be sure.
3.  **IAM Quota:** Ensure the IAM user has `AmazonS3FullAccess` and no "Quarantine" policies attached.

## 🛠️ Step 3: Local Workstation Verification
To test it here in the workstation:
1.  Check that your `.env` file matches the variables above.
2.  Stop the server (Press `Ctrl+C` in the terminal).
3.  Run `npm run dev`.
