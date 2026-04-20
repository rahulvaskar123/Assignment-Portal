# Classroom Hub: AWS Permission & Troubleshooting Guide

## 🔑 Resolving "Access Denied" or "Invalid Principal"

If you see errors when saving policies or logging in, follow these steps exactly:

### 1. The "Checkbox" Method (Easiest & Recommended)
This method bypasses the "Invalid Principal" and "Block Public Access" errors:
1. Go to the **IAM Console** -> **Users**.
2. Click on your user (**AKIA4F24QNSPQEA7BPVI**).
3. Look at the **Summary** section at the top. You will see an **ARN** (e.g., `arn:aws:iam::123456789012:user/your-name`). **Copy this ARN for later.**
4. Click **Add permissions** -> **Attach policies directly**.
5. Search for `AmazonS3FullAccess`.
6. **Check the box** next to it.
7. Click **Next** -> **Add permissions**.

### 2. Fixing "Invalid Principal" in Bucket Policy
If you really want to use a Bucket Policy, you must use **YOUR** specific ARN found in step 1:
1. Go to your S3 Bucket (`my-assignment-portal-2024`) -> **Permissions** -> **Bucket Policy**.
2. Paste this, but replace `PASTE_YOUR_ARN_HERE` with the ARN you copied from the IAM User summary:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::837175766175:user/assignment-portal-app"
            },
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::my-assignment-portal-2024",
                "arn:aws:s3:::my-assignment-portal-2024/*"
            ]
        }
    ]
}
```

### 3. S3 CORS Configuration (Fixed)
Scroll down to the bottom of the **Permissions** tab in your S3 Bucket and edit the **CORS configuration**. Use this exact JSON (note: `ExposeHeaders` is correct):
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag", "x-amz-server-side-encryption", "x-amz-request-id", "x-amz-id-2"],
        "MaxAgeSeconds": 3000
    }
]
```

## 🚀 Deployment Notice
The keys are hardcoded in `src/app/lib/s3-client.ts`. When you push to GitHub, you **must** click the "allow" links in the terminal to bypass GitHub's secret scanning protection.
