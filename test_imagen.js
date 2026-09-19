import fs from 'node:fs';

const env = fs.readFileSync('.env', 'utf-8');
const match = env.match(/GEMINI_API_KEY\s*=\s*(.+)/);
const key = match[1].trim().replace(/^['"]|['"]$/g, '');

async function testEndpoint(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(url, res.status, data?.error?.message || (data.models ? `Found ${data.models.length} models` : JSON.stringify(data).slice(0, 100)));
  } catch (e) {
    console.log(url, 'error:', e.message);
  }
}

async function run() {
  await testEndpoint(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
  await testEndpoint(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002?key=${key}`);
  await testEndpoint(`https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-002?key=${key}`);
}
run();

