const Handlebars = require('handlebars');
const fs = require('fs').promises;

async function CVHTMLfromTemp(cvJSON) {
    const source = await fs.readFile('./cvTemplates/cleanDesign.hbs', 'utf8');
    const template = Handlebars.compile(source);
    const cv = template(JSON.parse(cvJSON));
    return cv;
}

module.exports = { CVHTMLfromTemp }