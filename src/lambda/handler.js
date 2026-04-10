/**
 * AWS Lambda Function
 * Trigger: S3 ObjectCreated
 * Purpose: Extract metadata from the uploaded filename and log it.
 */
exports.handler = async (event) => {
    // Get bucket name and file key from the event
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    console.log(`New assignment detected in S3: ${key} (Bucket: ${bucket})`);
    
    // Naming Convention: studentID_subject_timestamp_originalfilename.ext
    const parts = key.split('_');
    
    if (parts.length >= 4) {
        const metadata = {
            studentId: parts[0],
            subject: parts[1],
            timestamp: new Date(parseInt(parts[2])).toLocaleString(),
            fileName: parts.slice(3).join('_')
        };
        
        console.log('--- Submission Metadata ---');
        console.log(`Student ID: ${metadata.studentId}`);
        console.log(`Subject: ${metadata.subject}`);
        console.log(`Time of Upload: ${metadata.timestamp}`);
        console.log(`Original File: ${metadata.fileName}`);
        console.log('---------------------------');
    } else {
        console.log('File uploaded does not follow naming convention, skipping metadata extraction.');
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Lambda processed S3 event successfully' }),
    };
};
