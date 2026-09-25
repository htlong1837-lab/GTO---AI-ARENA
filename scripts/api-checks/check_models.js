import fs from 'node:fs';

const env = fs.readFileSync('.env', 'utf-8');
const match = env.match(/GEMINI_API_KEY\s*=\s*(.+)/);
if (!match || !match[1]) {
  console.log('No GEMINI_API_KEY found in .env');
  process.exit(0);
}
const key = match[1].trim().replace(/^['"]|['"]$/g, '');
console.log('Found key starting with:', key.slice(0, 6));

async function main() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    if (data.error) {
      console.log('API Error:', data.error);
      return;
    }
    const models = data.models || [];
    console.log(`Found ${models.length} models:`);
    models.forEach(m => {
      console.log(` - ${m.name}: [${(m.supportedGenerationMethods || []).join(', ')}]`);
    });
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
main();

