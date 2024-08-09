const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  contract : {type:String,required:true},
  agence: { type: String, required: true },
  ville: { type: String, required: true },
  region: { type: String, required: true },
  descriptionDuPoste: { type: String, required: true },
  conditionsEtAvantages: { type: String, required: true },
  presentationDeLEntreprise: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
