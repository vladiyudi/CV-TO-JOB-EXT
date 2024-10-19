const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { capitalizeWords } = require('../models/helpers.js');

async function cvToHtml(req, res) {
    try {
        const { cvHTML } = req.body;
        const dom = new JSDOM(cvHTML);
        const name = dom.window.document.querySelector('.title-name').textContent.trim();
        const jobTitle = dom.window.document.querySelector('.job-title').textContent.trim();

        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

        const page = await browser.newPage();
        await page.setContent(cvHTML, { waitUntil: 'networkidle0', timeout: 60000 });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0.7cm', right: '1cm', bottom: '0.3cm', left: '1cm' }
        });

        await browser.close();

        // Generate a filename using the extracted name if not provided
        const pdfFilename =`${name.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}`;

        // Ensure headers are set correctly
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${capitalizeWords(pdfFilename)}.pdf`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send the PDF buffer
        res.send(Buffer.from(pdfBuffer));


    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}

module.exports = { cvToHtml };