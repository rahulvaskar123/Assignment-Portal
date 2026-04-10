
# Student Assignment Submission Portal (AWS Cloud Ready)

A full-stack portal for academic assignment management using Next.js and AWS (S3 & Lambda).

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
    "AllowedMethods": ["PUT", "GET", "POST"],
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

## 📂 Cloud Storage Structure

Your data is organized inside your S3 bucket as follows:
- `registry/students/`: Contains JSON files for every registered student.
- `registry/teachers/`: Contains JSON files for every registered teacher.
- `STUDENTID_SUBJECT_TIMESTAMP_FILENAME.EXT`: These are the actual assignment files.

## 🛠️ Verification Checklist
1. **Login:** Does the login work from different browsers? (If yes, S3 Auth is working!)
2. **Upload:** Check your **S3 Bucket** -> The file should appear instantly with the naming convention.
3. **Logs:** Check your **Lambda Logs** in CloudWatch -> You should see the metadata extraction in action.

## 🔐 Security Note
For this prototype, user passwords are saved in plain text within the S3 registry JSON files. In a production environment, you should hash passwords before saving them or use a dedicated service like **AWS Cognito**.
