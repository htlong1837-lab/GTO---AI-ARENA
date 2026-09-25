import fs from 'node:fs';

const env = fs.readFileSync('.env', 'utf-8');
const match = env.match(/GEMINI_API_KEY\s*=\s*(.+)/);
const key = match[1].trim().replace(/^['"]|['"]$/g, '');

async function testText(model) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello! Respond with "OK"' }] }]
      })
    });
    const data = await res.json();
    console.log(model, res.status, data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error?.message);
  } catch (e) {
    console.log(model, 'error:', e.message);
  }
}

async function run() {
  await testText('gemini-3.6-flash');
  await testText('gemini-flash-latest');
  await testText('gemini-3.5-flash');
}
run();

