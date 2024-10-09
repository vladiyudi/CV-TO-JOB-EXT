const User = require('../models/User');
const generateCvJson = require('../models/generateCvJson');
const capitalizeWords = require('../models/helpers.js').capitalizeWords;
const { CVHTMLfromTemp } = require('../models/CVHTMLfromTemp.js');

async function createCV(req, res) {
  try {
    let { cvRaw } = res.locals;  
    if (!cvRaw) cvRaw = req.body.cvRaw;

    const cvJSON = await generateCvJson(cvRaw);
    const cvJSONObject = JSON.parse(cvJSON);
    const name = capitalizeWords(cvJSONObject.personalInfo.name);
    const title = capitalizeWords(cvJSONObject.personalInfo.title);
    const jsonString = JSON.stringify(cvJSON);

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the cvJSON field
    user.cvJSON = jsonString;
    let cvToShow = user.cvJSON;
    cvToShow = typeof cvToShow === 'string' ? JSON.parse(cvToShow) : cvToShow;

    let cvHTML = await CVHTMLfromTemp(cvJSON, user.selectedTemplate);

    // Save the updated user document
    await user.save();

    
    
    res.json({ cvJSON: jsonString, nameTitle: { name, title }, cvHTML });

  } catch (error) {
    console.error('Error in createCV:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.', details: error.message });
  }
}

module.exports = { createCV };