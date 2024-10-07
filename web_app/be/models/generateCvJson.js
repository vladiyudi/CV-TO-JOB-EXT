const OpenAI = require('openai');
const JSONtemplate = require('../cvTemplates/cvJSON.js');
const cleanJsonString = require('./clearJsonString.js')

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function generateCvJson(cvRaw) {

    try {
        const prompt = `Restructure CV written as raw text into JSON format. Here is the raw CV:\n\n${cvRaw}. Here is example of JSON format:\n\n${JSON.stringify(JSONtemplate)}.  Omit preambule and postambule. The output should be only valid JSON`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',  
            messages: [
              {"role": "user", "content": prompt}
            ]
          });

          const cvJSON = cleanJsonString(response.choices[0].message.content.trim());
          return cvJSON

    } catch (error) {
        console.error('Error:', error);
    }

 
}

module.exports = generateCvJson