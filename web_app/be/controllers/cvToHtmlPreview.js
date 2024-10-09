const { CVHTMLfromTemp } = require('../models/CVHTMLfromTemp.js');
const User = require('../models/User');


async function cvToHtmlPreview(req, res) {
    try {
        let templateName = req.body.templateName;
        let cvJSON = req.body.cvJSON;

        if (!cvJSON) {
            const user = await User.findById(req.user.id);
            if (user && user.cvJSON) {
                cvJSON = user.cvJSON;
            } else {
                throw new Error('No CV data available');
            }
        }

        cvJSON = typeof cvJSON === 'string' ? JSON.parse(cvJSON) : cvJSON;
        const cvHTML = await CVHTMLfromTemp(cvJSON, templateName);
       
        res.json({ cvHTML });
    } catch (error) {
        console.error('Error in cvToHtmlPreview:', error);
        res.status(500).json({ error: 'An error occurred while processing your request', details: error.message });
    }
}

module.exports = cvToHtmlPreview;