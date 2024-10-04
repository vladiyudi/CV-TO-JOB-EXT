const Handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

async function CVHTMLfromTemp(cvJSON, templateName = 'cleanDesign') {
    const templatePath = path.join(__dirname, '..', 'cvTemplates', `${templateName}.hbs`);
    try {
        const source = await fs.readFile(templatePath, 'utf8');
        const template = Handlebars.compile(source);
        const cv = template(JSON.parse(cvJSON));
        return cv;
    } catch (error) {
        console.error(`Error reading template file: ${error.message}`);
        // Fallback to cleanDesign if the specified template doesn't exist
        const fallbackPath = path.join(__dirname, '..', 'cvTemplates', 'cleanDesign.hbs');
        const fallbackSource = await fs.readFile(fallbackPath, 'utf8');
        const fallbackTemplate = Handlebars.compile(fallbackSource);
        return fallbackTemplate(JSON.parse(cvJSON));
    }
}

module.exports = { CVHTMLfromTemp }