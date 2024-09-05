const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const postSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4 }, 
  contract: { type: String, required: true },
  agence: { type: String, required: true },
  ville: { type: String, required: true },
  region: { type: String, required: true },
  descriptionDuPoste: { type: String, required: true },
  conditionsEtAvantages: { type: String, required: true },
  presentationDeLEntreprise: { type: String, required: true },
  validate: {
    type: String,
    enum: ['hide', 'approved'], 
    default: 'hide'
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
