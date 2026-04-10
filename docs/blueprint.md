# **App Name**: Student Assignment Submission Portal

## Core Features:

- User Authentication: Secure login for students and teachers with basic validation, maintaining separate access flows. Credentials are handled securely via server-side environment variables or Next.js configurations, respecting the 'no database' constraint.
- Student Assignment Upload UI: A responsive Next.js page where students can input their name, ID, select a subject from a predefined list (Cloud Computing, Data Science, Web Development), and upload assignment files (PDF, DOCX, ZIP only). Client-side validation for file types and maximum size (10MB) is performed.
- S3-backed Assignment Submission Logic: A Next.js API route that processes uploaded assignments: validates file type and size, renames files to 'studentID_subject_timestamp_originalfilename.ext' for uniqueness and organization, checks against a hardcoded submission deadline, and securely uploads the file to the 'assignment-uploads' AWS S3 bucket. Prevents overwriting existing files.
- Assignment Detail Verification Assistant: An AI tool integrated into the student upload flow, leveraging a minimal Next.js serverless function. This tool offers suggestions or highlights potential mismatches between the student's selected subject and any additional free-text descriptions provided, helping ensure accurate assignment categorization.
- Teacher Assignment Dashboard: A protected Next.js interface for teachers to view all submitted assignments. This dashboard dynamically fetches and displays assignment metadata (Student ID, Subject, File name, Upload time) by parsing S3 object keys or custom S3 metadata, allowing for grouping, filtering by subject, and showing total submission counts.
- Secure Assignment Download for Teachers: A feature on the teacher dashboard allowing secure download of individual assignments. Clicking a 'Download' button triggers a Next.js API route that generates a temporary, time-limited, pre-signed URL from AWS S3, providing direct and secure access to the assignment file without exposing the S3 bucket's private access.
- Lambda-based Submission Logging and Metadata Enrichment: An AWS Lambda function configured to trigger automatically on new S3 object uploads to the 'assignment-uploads' bucket. Its primary role is to log upload events and, optionally, extract and persist essential metadata (like student ID, subject, upload timestamp) as small JSON files directly back into S3 for simplified retrieval by the teacher dashboard, adhering strictly to 'no database cost' rules.

## Style Guidelines:

- Primary color: A balanced, professional deep blue (#2D5D9A) to evoke reliability and academic focus, providing sufficient contrast for readability on light backgrounds.
- Background color: A very subtle, almost neutral pale blue (#EAF0F6), promoting a clean and focused user experience appropriate for an academic platform.
- Accent color: A vibrant, clear cyan (#4DC8D1) chosen for its analogous harmony with the primary blue. This color will highlight interactive elements like buttons and crucial information, providing visual pop.
- Body and headline font: 'Inter' (sans-serif) for its modern, clean, and objective aesthetic, ensuring high readability across all interface elements for both textual content and data tables.
- Use a set of minimalistic, outline-style icons that visually communicate actions such as upload, download, and subject categories, maintaining a clean and academic aesthetic.
- A mobile-responsive layout featuring clean, centered forms and structured data displays for easy navigation. Ample whitespace will ensure clarity, particularly on dashboards and submission forms.
- Subtle, non-intrusive animations will provide visual feedback on user actions, such as form submissions, file uploads, and dashboard data refreshes, enhancing the user experience without being distracting.