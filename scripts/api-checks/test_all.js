import fs from 'node:fs';

const env = fs.readFileSync('.env', 'utf-8');
const match = env.match(/GEMINI_API_KEY\s*=\s*(.+)/);
const key = match[1].trim().replace(/^['"]|['"]$/g, '');

const testModels = [
  'gemini-3.1-flash-lite-image',
  'gemini-3.1-flash-image-preview',
  'nano-banana-pro-preview',
  'gemini-2.5-flash'
];

async function run() {
  for (const model of testModels) {
    console.log(`Checking ${model}...`);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello, are you ready?' }] }]
        })
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(`❌ ${model} [${res.status}]:`, data?.error?.message?.slice(0, 200));
      } else {
        console.log(`✅ ${model} OK!`);
      }
    } catch (e) {
      console.log(`Error ${model}:`, e.message);
    }
  }
}
run();

