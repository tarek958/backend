const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    titleSelect: { type: String },
    lastName: { type: String },
    firstName: { type: String },
    phone: { type: String },
    email: { type: String },
    comments: { type: String },
    fileUrl: { type: String },
    company:{type:String,default:'No Company'},
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;
