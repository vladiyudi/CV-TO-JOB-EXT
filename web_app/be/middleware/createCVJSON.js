const User = require('../models/User');
const generateCvJson = require('../models/generateCvJson');
const capitalizeWords = require('../models/helpers.js').capitalizeWords;

async function createCV(req, res, next) {
  try {
    let { cvRaw } = res.locals;  
    if (!cvRaw) cvRaw = req.body.cvRaw;

  
      const cvJSON = await generateCvJson(cvRaw);
      const cvJSONObject = JSON.parse(cvJSON);
      const name = capitalizeWords(cvJSONObject.personalInfo.name);
      const title = capitalizeWords(cvJSONObject.personalInfo.title);
      const jsonString = JSON.stringify(cvJSON);

    
      // await User.findByIdAndUpdate(req.user.id, { cvJSON: jsonString });
      res.json({ cvJSON: jsonString, nameTitle: { name, title } });


  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

module.exports = { createCV };