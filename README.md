
# Student Assignment Submission Portal (AWS Production Ready)

A full-stack enterprise portal for academic assignment management using Next.js, AWS S3, and AWS Lambda.

## 🚀 Deployment Overview

This project is architected for the **AWS Cloud**. While it can be previewed locally or on Firebase, its "Source of Truth" is the AWS environment.

### 1. Storage & Database (AWS S3)
- **Files:** All assignments are stored in S3 using a strict metadata-encoded naming convention.
- **Registry:** User profiles, assignment lists, and submission history are stored as persistent JSON objects in the `registry/` folder of your S3 bucket.

### 2. Processing (AWS Lambda)
- **Metadata Extraction:** Triggered by S3 events to log submission details.
- **SSR Runtime:** The frontend API routes act as serverless functions (hosting on AWS Amplify uses Lambda @ Edge).

### 3. Environment Configuration
Update your `.env` for production:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your_bucket_name
```

## 📂 Architecture Diagram

```
[ Frontend (Amplify/NextJS) ] 
      |
      |-- [ Auth & Data Registry ] --> AWS S3 (registry/data/*.json)
      |-- [ File Uploads ] ----------> AWS S3 (Bucket Root)
                                         |
                                         V
                                   [ AWS Lambda ] (Metadata Processor)
```

## 🛠️ Verification Checklist
1. **Multi-User Sync:** Post an assignment as a Teacher and verify it appears instantly on the Student's dashboard (filtered by Year).
2. **Cloud Persistence:** Log out, clear local storage, and log back in—your data should restore from S3 via the "Sync Cloud" button.
3. **Naming Convention:** Verify uploaded files follow the `STUID_SUBJ_TS_NAME` format in your S3 console.

## 🔐 Security 
User data is secured via S3 IAM policies and Server-Side API routes. For high-security production, migration to AWS Cognito and DynamoDB is recommended.
