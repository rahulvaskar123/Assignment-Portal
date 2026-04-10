# Student Assignment Submission Portal

A full-stack portal for academic assignment management using Next.js and AWS S3.

## 🚀 Local Setup Instructions

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **AWS CLI Setup**:
    Ensure your AWS credentials are configured locally with access to the `ap-south-1` (Mumbai) region.
    ```bash
    aws configure
    ```
3.  **Environment Variables**:
    Create a `.env.local` file and fill in these values from the AWS Console:
    ```env
    AWS_ACCESS_KEY_ID=your_access_key
    AWS_SECRET_ACCESS_KEY=your_secret_key
    AWS_REGION=ap-south-1
    S3_BUCKET_NAME=assignment-uploads
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## ☁️ AWS Deployment & Verification Guide

### 1. Verify S3 Bucket & Region
- Go to the [S3 Console](https://s3.console.aws.amazon.com/s3/home).
- **Find Bucket Name:** Look at the "Name" column. This is your `S3_BUCKET_NAME`.
- **Find Region:** Look at the "AWS Region" column next to your bucket. Use the short code (e.g., `ap-south-1`) for `AWS_REGION`.
- **Important (CORS):** Click your bucket -> **Permissions** -> **CORS**. Click Edit and paste:
  ```json
  [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["PUT", "GET"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": []
    }
  ]
  ```

### 2. Verify IAM User (Credentials)
- Go to [IAM Users](https://console.aws.amazon.com/iam/home#/users).
- Click your user -> **Security credentials** tab.
- If you haven't saved your Secret Key, you must delete the old one and click **Create access key** again.

### 3. AWS Lambda Setup
- Go to [Lambda Console](https://console.aws.amazon.com/lambda/home).
- Create function -> Node.js 18+.
- **Trigger:** Click "Add trigger", select S3, select your bucket, and "All object create events".
- **Code:** Paste the logic from `src/lambda/handler.js` into the Lambda editor.

### 📁 S3 Naming Convention
Files are renamed automatically: `studentID_subject_timestamp_originalfilename.ext`
