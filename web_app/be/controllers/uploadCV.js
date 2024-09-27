const pdfParse = require('pdf-parse')

async function uploadCVController(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
    
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Invalid file type. Please upload a PDF.' });
      }
    
      try {
        const pdfData = await pdfParse(req.file.buffer);
        res.json({ extractedText: pdfData.text });
      } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Error processing PDF' });
      }
}

module.exports = uploadCVController