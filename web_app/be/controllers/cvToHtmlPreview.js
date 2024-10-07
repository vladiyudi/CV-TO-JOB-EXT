const { CVHTMLfromTemp } = require('../models/CVHTMLfromTemp.js');
const User = require('../models/User');
const generateCvJson = require('../models/generateCvJson');

async function cvToHtmlPreview(req, res) {
    try {
       
        let templateName = req.body.templateName;
        let cvJSON = req.body.cvJSON;

        cvJSON = JSON.parse(cvJSON);
        const cvHTML = await CVHTMLfromTemp(cvJSON, templateName);
       
        res.json({ cvHTML });
    } catch (error) {
        console.error('Error in cvToHtmlPreview:', error);
        res.status(500).json({ error: 'An error occurred while processing your request', details: error.message });
    }
}

module.exports = cvToHtmlPreview;