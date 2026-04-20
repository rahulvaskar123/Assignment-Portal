
# Classroom Hub: AWS Deployment & IAM Guide

## 🚀 Step 1: Create a New IAM User (Recommended)
Since your previous keys were quarantined by AWS, follow these steps to create a clean user:

1.  **Open AWS Console**: Navigate to the **IAM** (Identity and Access Management) dashboard.
2.  **Create User**: Click **Users** -> **Create user**.
3.  **Name**: Call it `assignment-portal-new`.
4.  **Permissions**:
    *   Choose **Attach policies directly**.
    *   Search for **`AmazonS3FullAccess`** and click the checkbox next to it.
5.  **Finish**: Click **Next** -> **Create user**.
6.  **Generate Keys**:
    *   Click on your new user name.
    *   Go to the **Security credentials** tab.
    *   Scroll down to **Access keys** and click **Create access key**.
    *   Choose **Application running outside AWS**.
    *   **CRITICAL**: Copy the **Access Key ID** and **Secret Access Key**. You will not see the Secret Key again!

## 🔐 Step 2: Set Environment Variables in Amplify
Go to your **AWS Amplify Console** (Hosting -> Environment variables) and update these:

1.  **AWS_ACCESS_KEY_ID**: (Your new Access Key)
2.  **AWS_SECRET_ACCESS_KEY**: (Your new Secret Key)
3.  **AWS_REGION**: `ap-south-1`
4.  **AWS_S3_BUCKET**: `my-assignment-portal-2024`
5.  **GOOGLE_GENAI_API_KEY**: (Your Gemini API key)

## 🛠️ Step 3: Required S3 CORS Configuration
Go to your S3 Bucket -> **Permissions** -> **CORS** and paste this:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

## 📂 Deployment
1.  Run `sh git-push-shortcut.sh` to push code to GitHub.
2.  Amplify will automatically trigger a build using the new keys.
