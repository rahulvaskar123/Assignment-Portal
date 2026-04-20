
# 🚀 University Portal - Workstation Guide

If the login stops working, follow these emergency steps in this order:

## 🛠️ Step 1: Update Environment Variables
AWS Lambda and Amplify do not allow you to set custom variables starting with `AWS_`. We now use `NEW_AWS_` prefixes.

Update your environment variables in Amplify and your local `.env`:
1.  `NEW_AWS_ACCESS_KEY_ID`
2.  `NEW_AWS_SECRET_ACCESS_KEY`
3.  `NEW_AWS_REGION`
4.  `NEW_AWS_S3_BUCKET`

## 🛠️ Step 2: The "Double Refresh"
1. **Stop the server:** Press `Ctrl+C` in the terminal.
2. **Verify `.env`:** Make sure there are no spaces or quotes around your keys.
3. **Start the server:** Run `npm run dev`.
4. **Hard Refresh:** Press `Ctrl+Shift+R` in your browser.

## 🛠️ Step 3: AWS Console Verification
Ensure these match your AWS S3 settings:
1. **Bucket Name:** `my-assignment-portal-2024`
2. **Region:** `ap-south-1`
3. **Block Public Access:** Must be **OFF** (Unchecked).
4. **CORS:** Ensure the JSON block is correctly configured in the Permissions tab.

## 📦 Deployment to Amplify
Once it works here:
1. Run `sh git-push-shortcut.sh`.
2. Add these same `NEW_AWS_...` variables to **Amplify Console -> Hosting -> Environment variables**.
3. Redeploy.
