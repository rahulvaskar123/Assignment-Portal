
# 🚀 Final Deployment Guide (Amplify + GitHub)

Your workstation login is successful! Follow these steps to move to Production (Amplify).

## 🛠️ Step 1: GitHub Push (Secret Protection)
1. Ensure your `.env` file contains your keys. 
2. Run `sh git-push-shortcut.sh` in the terminal.
3. **If GitHub blocks the push:** Click the link in the error message to "Allow" the secrets, then run the script again.

## 🌐 Step 2: AWS Amplify Setup
Once your code is on GitHub and connected to Amplify, you **MUST** add these variables in the **Amplify Console** under **Hosting -> Environment variables**:

| Variable Name | Value |
|---------------|-------|
| `AWS_ACCESS_KEY_ID` | (Your New Access Key) |
| `AWS_SECRET_ACCESS_KEY` | (Your New Secret Key) |
| `AWS_REGION` | `ap-south-1` (or your bucket region) |
| `AWS_S3_BUCKET` | `my-assignment-portal-2024` |
| `GOOGLE_GENAI_API_KEY` | (Your Gemini API Key) |

## 📂 Step 3: S3 Bucket Permissions (The "Access Denied" Fix)
Ensure these settings match in your AWS S3 Console:
1. **Block Public Access**: Click Edit -> **Uncheck ALL boxes** -> Save.
2. **CORS Configuration**: Paste this exactly:
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

## 📝 Troubleshooting Signature Errors
If you see "SignatureDoesNotMatch" on Amplify:
- Ensure there are **no spaces** or **quotes** in the Amplify Environment Variable values.
- **Redeploy** the app after changing variables.
