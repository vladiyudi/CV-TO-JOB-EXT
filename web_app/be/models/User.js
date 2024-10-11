const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  jobDescription: String,
  cvText: String,
  cvJSON: String,  
  selectedTemplate: { type: String, default: 'cleanDesign' },
  dailyLimit: { type: Number, default: null },
  generationsToday: { type: Number, default: 0 },
  lastResetDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
