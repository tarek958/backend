import mongoose from 'mongoose';

const CondidatureSchema = new mongoose.Schema({
  cvUpload: {
    type: String, // Store Base64-encoded PDF data here
    required: true,
  },
  titleSelect: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: { type: String, required: true },
  comments: { type: String, required: true },
});

export default mongoose.models.Condidature || mongoose.model('Condidature', CondidatureSchema);
