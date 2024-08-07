const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const File = require('../models/File');

const pdfParse = require('pdf-parse');
const uploadDir = path.join(__dirname, '../public/uploads');
const removeEmailFromPdf = async (filePath) => {
    try {
        // Read the PDF file
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pages = pdfDoc.getPages();
        
        // Example email regex (adapt as needed)
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /\+?[0-9]{10,15}/g; // Simple phone regex (adapt as needed)

        // Cover the text in each page
        for (const page of pages) {
            const { width, height } = page.getSize();
            const text = pdfData.text; // Extracted text from the PDF

            // Process the text to find email and phone numbers
            const emailMatches = text.match(emailRegex) || [];
            const phoneMatches = text.match(phoneRegex) || [];

            // Example logic to cover text (needs adaptation based on actual coordinates)
            for (const email of emailMatches) {
                // Find the position of the text and cover it
                // You need to implement logic to cover the text based on its position
                page.drawRectangle({
                    x: 50, // Example position, needs adjustment
                    y: height - 100, // Example position, needs adjustment
                    width: 200, // Example size, needs adjustment
                    height: 20, // Example size, needs adjustment
                    color: rgb(1, 1, 1), // White color to cover text
                });
            }

            for (const phone of phoneMatches) {
                // Similar logic to cover phone numbers
                page.drawRectangle({
                    x: 50, // Example position, needs adjustment
                    y: height - 150, // Example position, needs adjustment
                    width: 200, // Example size, needs adjustment
                    height: 20, // Example size, needs adjustment
                    color: rgb(1, 1, 1), // White color to cover text
                });
            }
        }

        const modifiedPdfBytes = await pdfDoc.save();
        fs.writeFileSync(filePath, modifiedPdfBytes);
        console.log('PDF processed and sensitive information covered.');
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw error;
    }
};
exports.uploadFile = async (req, res) => {
    try {
        // Construct the file path
        const filePath = path.join(uploadDir, req.file.filename);

        // Call your function to remove email from PDF (assuming this function is defined elsewhere)
        await removeEmailFromPdf(filePath);

        // Create a new file object with all relevant information
        const newFile = new File({
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            title: req.body.titleSelect, // Adjusted field names
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            phone: req.body.phone,
            email: req.body.email,
            comments: req.body.comments,
            education: JSON.parse(req.body.education), // Assuming education is passed as JSON string
            experience: JSON.parse(req.body.experience), // Assuming experience is passed as JSON string
            fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
        });

        // Save the new file record to the database
        await newFile.save();

        // Send a success response
        res.status(200).json({ message: 'File uploaded and processed successfully', file: req.file, formData: req.body });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload and process file' });
    }
};

exports.getAllFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
       
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
};
exports.deletePostById = async (req, res) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params.id);
      if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.removeFile = async (req, res) => {
    try {
        const deletedFile = await File.findByIdAndDelete(req.params.id);
        if (!deletedFile) return res.status(404).json({ message: 'File not found' });
        res.status(200).json({ message: 'Condidature deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
   
};


exports.editFile = (req, res) => {
    const { oldFilename, newFilename } = req.body;
    const oldFilePath = path.join(uploadDir, oldFilename);
    const newFilePath = path.join(uploadDir, newFilename);

    fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to rename file' });
        }
        res.status(200).json({ message: 'File renamed successfully' });
    });
};