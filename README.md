
# 🚀 Classroom Hub: Workstation Setup Guide

To make the application work on your local workstation, follow these exact steps.

## 🔐 Step 1: Create a Clean IAM User
1. Open **AWS IAM Console**.
2. Click **Users** -> **Create user**. Name it `classroom-hub-local`.
3. **Permissions**: Select **Attach policies directly**.
4. Search for **`AmazonS3FullAccess`** and check the box.
5. Finish creation and go to the **Security credentials** tab for this user.
6. Scroll to **Access keys** -> **Create access key**.
7. Choose **Application running outside AWS**.
8. **SAVE THESE KEYS**: Copy the `Access Key ID` and `Secret Access Key`.

## 📂 Step 2: Configure S3 Bucket
1. Go to your S3 Bucket -> **Permissions**.
2. **Block Public Access**: Ensure it is turned **OFF** (Uncheck all).
3. **CORS Configuration**: Click Edit and paste this:
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
4. **Bucket Policy**: If you have a policy that mentions your OLD user, **DELETE IT**. Your IAM user doesn't need a bucket policy if it has `FullAccess` attached.

## 🛠️ Step 3: Local Environment
1. Open the `.env` file in your project.
2. Replace the placeholders with your **NEW** keys and bucket name.
3. Restart your dev server (`npm run dev`).

## 📂 Deployment to Amplify
1. Push to GitHub using `sh git-push-shortcut.sh`.
2. In Amplify Console, add the same 5 keys to **Hosting -> Environment variables**.
3. Redeploy.
