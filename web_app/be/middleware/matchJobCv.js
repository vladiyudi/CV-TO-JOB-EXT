const OpenAI = require('openai');

const openai = new OpenAI( {apiKey: process.env.OPENAI_API_KEY});

async function matchJobCvRaw(req, res, next) {
  try {
    const { job, cv } = req.body;

    const prompt = `Take this job description and CV. Rewrite CV to match Job description:\n\nJob Description:\n${job}\n\nCV:\n${cv}.\n Make sure profile is short, job title is clear, there are 6 categories of skills. Put only hard skills in the list. \n Omit preambule and postambule. The output should be only raw CV.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {"role": "user", "content": prompt}
    ]
    });

    const rewrittenCV = response.choices[0].message.content.trim();
    res.locals.cvRaw = rewrittenCV;

    next();
   
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}

module.exports = { matchJobCvRaw };