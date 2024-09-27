const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs').promises;

async function cvToHtml(req, res) {
    try {
     
        const { cvHTML } = req.body;

        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

        const page = await browser.newPage();
        await page.setContent(cvHTML, { waitUntil: 'networkidle0', timeout: 60000 });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
        });

        await browser.close();

        // Ensure headers are set correctly
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=matched_cv.pdf');
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send the PDF buffer
        res.send(Buffer.from(pdfBuffer));

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}

module.exports = { cvToHtml };
