const User = require('../models/User');
const generateCvJson = require('../models/generateCvJson');

async function createCV(req, res, next) {
  try {
    let { cvRaw } = res.locals;  
    if (!cvRaw) cvRaw = req.body.cvRaw;

  
      const cvJSON = await generateCvJson(cvRaw);
      const jsonString = JSON.stringify(cvJSON);

    
      // await User.findByIdAndUpdate(req.user.id, { cvJSON: jsonString });
      res.json({ cvJSON: jsonString });


  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

module.exports = { createCV };