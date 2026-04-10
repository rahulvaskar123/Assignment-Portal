# Student Assignment Submission Portal

A full-stack portal for academic assignment management using Next.js, AWS S3, and AWS Lambda.

## 🚀 AWS Cloud Setup (The "Baby Steps" Guide)

Follow these steps to connect your app to the cloud:

### 1. Create S3 Bucket (The Storage)
- Go to [S3 Console](https://s3.console.aws.amazon.com/s3/home).
- Click **Create bucket**.
- **Name:** Choose a unique name (e.g., `my-assignment-bucket-xyz`). This is your `S3_BUCKET_NAME`.
- **Region:** Select **ap-south-1** (Mumbai). This is your `AWS_REGION`.
- Click **Create bucket**.

### 2. Configure S3 CORS (CRITICAL)
Without this, your browser will block the upload.
- Click your bucket name -> **Permissions** tab -> **CORS** section -> **Edit**.
- Paste this JSON:
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

### 3. Create Lambda Function (The Brain)
- Go to [Lambda Console](https://console.aws.amazon.com/lambda/home).
- Click **Create function** -> Node.js 18+.
- **Add Trigger:** Click "+ Add trigger", select **S3**, select your bucket name.
- **Event Type:** "All object create events".
- **Code:** Copy the code from `src/lambda/handler.js` in this project and paste it into the Lambda code editor. Click **Deploy**.

### 4. Set Environment Variables
Update your `.env` file in the root directory:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your_bucket_name
```

## 📂 How to Access & Verify Your Data

Once a student uploads a file, here is how you check it:

### 1. Where are the Files? (S3)
- Go to the [S3 Console](https://s3.console.aws.amazon.com/s3/home).
- Click on your bucket name.
- You will see a list of files named like: `STU123_Blockchain_171543210_report.pdf`.
- **To Download:** Click the checkbox next to a file and click the **Download** button.

### 2. Where is the Metadata? (CloudWatch Logs)
Every time a file is uploaded, your Lambda function "wakes up" and extracts the Student ID and Subject.
- Go to the [Lambda Console](https://console.aws.amazon.com/lambda/home).
- Click on your function name (e.g., `process-assignment-upload`).
- Click the **Monitor** tab at the top.
- Click **View CloudWatch logs**.
- Click the latest **Log Stream**.
- You will see a formatted log that looks like this:
  ```
  --- Submission Metadata Extracted ---
  Student ID: STU12345
  Subject: Blockchain
  Time of Upload: 5/12/2024, 10:30:00 AM
  Original File Name: my_final_report.pdf
  ------------------------------------
  ```

## 🛠️ Verification Steps
1. Login as a student and upload a file.
2. Check your **S3 Bucket** -> The file should appear instantly.
3. Check your **Lambda Logs** -> The metadata should be printed in the console!
