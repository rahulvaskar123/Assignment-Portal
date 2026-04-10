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

## 📂 S3 Naming Convention
Files are renamed automatically by the app for the Lambda to process: 
`studentID_subject_timestamp_originalfilename.ext`
Example: `STU123_Blockchain_171543210_report.pdf`

## 🛠️ Verification
1. Upload a file as a student.
2. Go to your **S3 Bucket** -> You should see the file there.
3. Go to your **Lambda Function** -> Click **Monitor** tab -> **View logs in CloudWatch**. 
4. You will see the extracted Student ID and Subject logged there!
