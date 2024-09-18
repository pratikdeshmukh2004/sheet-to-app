import fileUpload from "express-fileupload";

// Disable Next.js's default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize the express-fileupload middleware
const fileUploadMiddleware = fileUpload();

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Apply the file upload middleware
    fileUploadMiddleware(req, res, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: `Error processing file upload: ${err.message}` });
      }

      // Ensure a file is uploaded
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "No files were uploaded." });
      }

      // Get the uploaded file
      const uploadedFile = req.files.file;

      try {
        // Convert the file buffer to base64 (fileData)
        const fileData = `data:${uploadedFile.mimetype};base64,${uploadedFile.data.toString('base64')}`;
        const fileName = uploadedFile.name;
        const mimeType = uploadedFile.mimetype;

        // Make the API call to Google Apps Script
        const response = await fetch(process.env.GOOGLE_SCRIPT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileData: fileData,
            fileName: fileName,
            mimeType: mimeType,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to call API: ${response.statusText}`);
        }

        const result = await response.json();

        // Send the result back to the client
        res.status(200).json(result);
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
