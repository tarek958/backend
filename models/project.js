const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
