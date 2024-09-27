const Handlebars = require('handlebars');
const fs = require('fs');
const pdf = require('html-pdf')

const source = fs.readFileSync('./cvTemplates/cleanSimple.hbs', 'utf8');
const template = Handlebars.compile(source);

const cvJSON = require('../cvTemplates/cvJSON.js');

const cv = template(cvJSON);
console.log(cv);

pdf.create(cv).toFile('cv.pdf', (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
})

