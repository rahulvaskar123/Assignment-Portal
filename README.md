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
    Create a `.env.local` file:
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

## ☁️ AWS Deployment Guide (Free Tier)

### 1. Create S3 Bucket
- Go to S3 Console -> Create Bucket.
- Name: `assignment-uploads`.
- Region: `ap-south-1`.
- Block all public access (Private bucket).

### 2. Create IAM User
- Create a user with `AmazonS3FullAccess`.
- Save the Access Key and Secret Key for deployment.

### 3. AWS Lambda Setup
- Create a new Lambda function.
- Trigger: S3 `All object create events` on your bucket.
- Runtime: Node.js 18+.
- Code: Use the provided `src/lambda/handler.js` logic to log metadata.

### 4. Hosting (EC2)
- Launch a `t2.micro` (Free Tier eligible) instance.
- Region: `ap-south-1`.
- Security Group: Allow HTTP (80) and Port 3000 (if running Next.js directly).
- Install Node.js, clone repo, build and start.

## 📁 S3 Naming Convention
Files are renamed automatically: `studentID_subject_timestamp_originalfilename.ext`
