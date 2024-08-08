const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const File = require('../models/File');

const pdfParse = require('pdf-parse');
const uploadDir = path.join(__dirname, '../public/uploads');

exports.uploadFile = async (req, res) => {
    try {
        // Construct the file path
        const filePath = path.join(uploadDir, req.file.filename);

        

       
        const newFile = new File({
            originalName: req.file.originalname,
            filename: req.body.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            title: req.body.titleSelect, 
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            phone: req.body.phone,
            email: req.body.email,
            comments: req.body.comments,
            company:req.body.company,
            education: JSON.parse(req.body.education), 
            experience: JSON.parse(req.body.experience), 
            fileUrl: `http://localhost:5000/uploads/${req.body.filename}`,
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