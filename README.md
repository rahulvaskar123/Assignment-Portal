
# 🚀 Fixing the "SignatureDoesNotMatch" AWS Error

If you see "SignatureDoesNotMatch", it means the Secret Key you pasted doesn't match the Access Key ID. 

## 🛠️ Step 1: Fix the .env file (Most Likely Cause)
1. Open your `.env` file.
2. Ensure there are **NO SPACES** around the `=` sign.
3. Ensure there are **NO QUOTES** around the keys.
4. **WRONG:** `AWS_SECRET_ACCESS_KEY = " abcde123 "`
5. **RIGHT:** `AWS_SECRET_ACCESS_KEY=abcde123`

## 📂 Step 2: Create a NEW Key (If Step 1 fails)
If you are sure there are no spaces, your current key might be corrupted.
1. Go to **AWS IAM Console** -> **Users** -> Select your user.
2. Go to **Security credentials**.
3. Deactivate and **Delete** the old access key.
4. Click **Create access key** -> **Application running outside AWS**.
5. **CRITICAL:** Copy the Secret Access Key immediately. You cannot see it again.

## 📝 Step 3: S3 Bucket Permissions
Ensure your bucket allows the API to talk to it:
1. Go to your S3 Bucket -> **Permissions**.
2. **Block Public Access**: Click Edit -> **Uncheck ALL boxes** -> Save.
3. **CORS Configuration**: Paste this:
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

## 🌐 Local Workstation Setup
1. Update `.env` with the **NEW** keys.
2. **RESTART your terminal**: Close the terminal where `npm run dev` is running.
3. Start it again: `npm run dev`.

---
**Why restart?** Environment variables are only loaded when the server starts. If you change the `.env` file, you MUST restart the process.
