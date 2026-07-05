const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('No GEMINI_API_KEY found');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Available Models:');
      if (parsed.models) {
        parsed.models.forEach(model => {
          console.log(`- ${model.name} (${model.displayName})`);
          console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
        });
      } else {
        console.log(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log(data);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching models:', err);
});
