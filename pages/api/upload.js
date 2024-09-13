import { google } from 'googleapis';
import fileUpload from 'express-fileupload';
import { Readable } from 'stream';

// Disable Next.js's default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize the express-fileupload middleware
const fileUploadMiddleware = fileUpload();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Apply the file upload middleware
    fileUploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: `Error processing file upload: ${err.message}` });
      }

      // Ensure a file is uploaded
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
      }

      // Get the uploaded file
      const uploadedFile = req.files.file;

      try {
        // Initialize Google Drive API with Service Account credentials
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/drive.file'], // Access to Google Drive
        });

        // Initialize Google Drive client
        const drive = google.drive({ version: 'v3', auth });

        // Convert the uploaded file's buffer to a readable stream
        const bufferStream = new Readable();
        bufferStream.push(uploadedFile.data); // Push file buffer into the stream
        bufferStream.push(null); // No more data

        // Upload the file to Google Drive
        const fileMetadata = {
          name: uploadedFile.name,
        };

        const media = {
          mimeType: uploadedFile.mimetype,
          body: bufferStream, // Use the readable stream here
        };

        const file = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id',
        });

        // Make the file public (if needed)
        await drive.permissions.create({
          fileId: file.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });

        // Generate the public URL
        const publicUrl = `https://drive.google.com/thumbnail?id=${file.data.id}&sz=w1000`;

        // Send the public URL in response
        res.status(200).json({ fileUrl: publicUrl });
      } catch (error) {
        console.log(error);
        // Catch any error and send a response
        res.status(500).json({ error: `Error uploading file: ${error.message}` });
      }
    });
  } else {
    // Method not allowed
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
