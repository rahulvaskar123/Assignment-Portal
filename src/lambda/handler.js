/**
 * AWS Lambda Function
 * Trigger: S3 ObjectCreated
 */
exports.handler = async (event) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    console.log(`New assignment uploaded: ${key} in bucket ${bucket}`);
    
    // Logic to extract metadata from filename
    // Format: studentID_subject_timestamp_original.ext
    const parts = key.split('_');
    if (parts.length >= 3) {
        const metadata = {
            studentId: parts[0],
            subject: parts[1],
            timestamp: parts[2],
            originalName: parts.slice(3).join('_')
        };
        console.log('Parsed Metadata:', metadata);
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify('Logging complete'),
    };
};
