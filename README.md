
# 🚀 Fixing the "Access Denied" AWS Error

If you see the error: **"Cannot access bucket... Check region and IAM permissions"**, follow these exact steps to fix it on your local workstation.

## 🛠️ Step 1: Create a FRESH IAM User (Recommended)
AWS likely blocked your old keys because they were uploaded to GitHub.
1. Go to **AWS IAM Console** -> **Users** -> **Create user**.
2. Name it `portal-final-fix`.
3. **Permissions**: Select **Attach policies directly** -> Search and check **`AmazonS3FullAccess`**.
4. Finish creation, go to the **Security credentials** tab.
5. Scroll to **Access keys** -> **Create access key**.
6. Choose **Application running outside AWS**.
7. **COPY THE NEW KEYS**.

## 📂 Step 2: Configure S3 Bucket (CRITICAL)
1. Go to your S3 Bucket -> **Permissions**.
2. **Block Public Access**: Click Edit -> **Uncheck ALL boxes** -> Save. (This allows the API to talk to the bucket).
3. **CORS Configuration**: Click Edit and paste this EXACTLY:
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

## 📝 Step 3: Update Local Environment
1. Open the `.env` file in this project.
2. Replace the placeholders with your **NEW** keys.
3. **IMPORTANT**: Check your bucket's region in the AWS Console (e.g., `us-east-1` or `ap-south-1`) and make sure it matches the `AWS_REGION` in `.env`.
4. Restart your workstation server (`npm run dev`).

## 🌐 Step 4: AWS Amplify (Deployment)
1. Push to GitHub using `sh git-push-shortcut.sh`.
2. In Amplify Console, go to **Hosting -> Environment variables**.
3. Update the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `AWS_S3_BUCKET` with the new values.
4. **Redeploy**.

---
**Why this works:** New keys bypass the "Quarantine" block, and disabling "Block Public Access" ensures the S3 API doesn't reject your workstation's request.
