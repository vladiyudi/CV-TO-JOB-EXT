const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  jobDescription: String,
  cvText: String,
  selectedTemplate: { type: String, default: 'cleanDesign' }
});

module.exports = mongoose.model('User', userSchema);