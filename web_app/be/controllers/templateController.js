const fs = require('fs').promises;
const path = require('path');

exports.getTemplates = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '..', 'cvTemplates');
    const files = await fs.readdir(templatesDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    const templates = await Promise.all(htmlFiles.map(async (file) => {
      const content = await fs.readFile(path.join(templatesDir, file), 'utf-8');
      return {
        name: file.replace('.html', ''),
        content: content
      };
    }));

    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};