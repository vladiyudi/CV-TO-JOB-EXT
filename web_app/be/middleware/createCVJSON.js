const User = require('../models/User');
const generateCvJson = require('../models/generateCvJson');
const capitalizeWords = require('../models/helpers.js').capitalizeWords;

async function createCV(req, res) {
  try {
    let { cvRaw } = res.locals;  
    if (!cvRaw) cvRaw = req.body.cvRaw;

    const cvJSON = await generateCvJson(cvRaw);
    const cvJSONObject = JSON.parse(cvJSON);
    const name = capitalizeWords(cvJSONObject.personalInfo.name);
    const title = capitalizeWords(cvJSONObject.personalInfo.title);
    const jsonString = JSON.stringify(cvJSON);

    console.log('User ID:', req.user.id);
    console.log('CV JSON to be saved:', jsonString);

    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the cvJSON field
    user.cvJSON = jsonString;

    // Save the updated user document
    await user.save();

    console.log('Updated user:', user);
    
    res.json({ cvJSON: jsonString, nameTitle: { name, title } });

  } catch (error) {
    console.error('Error in createCV:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.', details: error.message });
  }
}

module.exports = { createCV };