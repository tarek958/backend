const mongoose = require('mongoose');

// Define the schema for education
const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true }
}, { _id: false });

// Define the schema for experience
const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true }
}, { _id: false });

// Define the main schema
const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  title: { type: String },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  comments: { type: String },
  fileUrl: { type: String },
  company: { type: String },
  cvUpload: { type: Buffer },  // Stores binary data
  education: [educationSchema], // Array of education objects
  experience: [experienceSchema] // Array of experience objects
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;
