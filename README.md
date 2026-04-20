
# 🚀 University Portal - Workstation Guide

If the login stops working, follow these emergency steps in this order:

## 🛠️ Step 1: Check the Terminal
Look at the terminal window running `npm run dev`. I have added detailed logs. 
- If you see `AccessDenied`, your keys have been blocked (Quarantined) by AWS.
- If you see `SignatureDoesNotMatch`, there is a typo in your `.env` file.

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
4. **CORS:** Ensure the JSON block from the previous step is still in the Permissions tab.

## 📦 Deployment to Amplify
Once it works here:
1. Run `sh git-push-shortcut.sh`.
2. Add these same variables to **Amplify Console -> Hosting -> Environment variables**.
3. Redeploy.
