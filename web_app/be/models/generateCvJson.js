const OpenAI = require('openai');
const JSONtemplate = require('../cvTemplates/cvJSON.js');
const cleanJsonString = require('./clearJsonString.js')

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function generateCvJson(cvRaw) {

    try {

      
      const prompt = `
      /*
      Convert the input CV into a structured JSON format. 
    
      Steps
    
      1. Identify Key Sections: Read through the CV to identify key sections such as Personal Information, Work Experience, Education, Skills, and any other relevant parts.
      2. Extract Information: Extract specific details from each section such as names, dates, locations, positions, degrees, skills, etc.
      3. Organize into JSON: Structure the extracted information into a JSON format with appropriate key-value pairs, ensuring each section is clearly organized.
    
      Include details of personal information, a professional summary, work experience, education, and skills in the JSON object. Adhere closely to the structure and completeness of the example provided.
    
      Steps
    
      1. Personal Information:
         - Include \`name\`, \`title\`, \`email\`, \`phone\`, and \`location\`.
    
      2. Professional Summary:
         - Craft a concise summary highlighting years of experience, areas of expertise, and key strengths.
    
      3. Work Experience:
         - List positions in chronological order with \`jobTitle\`, \`company\`, \`startDate\`, \`endDate\`, and \`responsibilities\`.
         - Each job should include multiple responsibilities to reflect contributions and achievements accurately.
    
      4. Education:
         - List educational qualifications with \`degree\`, \`institution\`, and \`graduationDate\`.
    
      5. Skills:
         - Categorize skills into different domains, such as programming languages, frameworks, and tools, with a list of specific skills under each category.
    
      Output Format
    
      The output should be structured in JSON format.
      Ensure all fields are present and filled as indicated in the example.
      Maintain accuracy and clarity in representing each section as specified.
    
      Output Structure (follow it precisely):
    
      {
        "personalInfo": {
          "name": "[Name]",
          "title": "[Title]",
          "email": "[email@example.com]",
          "phone": "[phone number]",
          "location": "[Location]"
        },
        "professionalSummary": "[Summary of experience and expertise]",
        "workExperience": [
          {
            "jobTitle": "[Job Title]",
            "company": "[Company Name]",
            "startDate": "[Start Date]",
            "endDate": "[End Date]",
            "responsibilities": [
              "[Responsibility 1]",
              "[Responsibility 2]",
              "[Responsibility 3]"
            ]
          }
          // More work experience objects as needed
        ],
        "education": [
          {
            "degree": "[Degree]",
            "institution": "[Institution Name]",
            "graduationDate": "[Graduation Date]"
          }
          // More education objects as needed
        ],
        "skills": [
          {
            "category": "[Category]",
            "list": ["[Skill 1]", "[Skill 2]"]
          }
          // More skill categories as needed
        ]
      }
    
      Notes:
    
      - Filled fields are mandatory. If certain information is not applicable, use placeholders or descriptive alternatives.
      - Customize and expand each section according to individual data provided.
    
      Input CV: ${cvRaw}
      */
      `;

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