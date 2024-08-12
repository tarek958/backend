const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
    default: 'No Company',
  },
  role:{
    type: String,
    default: 'user',
  },
  confirmationToken: {type: String},
  confirmed: { type: Boolean, default: false }, // To track email confirmation status
  resetPasswordToken: {type:String},
  resetPasswordExpires: {type:Date},
});

module.exports = mongoose.model('User', UserSchema);
