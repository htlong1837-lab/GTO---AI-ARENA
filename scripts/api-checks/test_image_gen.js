import fs from 'node:fs';

const env = fs.readFileSync('.env', 'utf-8');
const match = env.match(/GEMINI_API_KEY\s*=\s*(.+)/);
const key = match[1].trim().replace(/^['"]|['"]$/g, '');

async function testGenerate(model) {
  console.log(`Testing model ${model}...`);
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'A photorealistic portrait of a Vietnamese woman wearing red traditional Ao Dai' }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ["IMAGE", "TEXT"]
        }
      })
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(`Model ${model} error:`, JSON.stringify(data));
      return false;
    }
    console.log(`Model ${model} success:`, JSON.stringify(data, null, 2).slice(0, 500));
    const candidates = data.candidates?.[0]?.content?.parts || [];
    for (const part of candidates) {
      if (part.inlineData) {
        console.log(`GOT IMAGE! mimeType: ${part.inlineData.mimeType}, data length: ${part.inlineData.data.length}`);
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error(`Error with ${model}:`, e);
    return false;
  }
}

async function run() {
  const models = [
    'models/gemini-2.5-flash-image',
    'models/gemini-3-pro-image-preview',
    'models/gemini-3-pro-image',
    'models/nano-banana-pro-preview',
    'models/gemini-3.1-flash-image-preview',
    'models/gemini-3.1-flash-image',
    'models/gemini-3.1-flash-lite-image'
  ];
  for (const m of models) {
    const ok = await testGenerate(m);
    if (ok) {
      console.log(`Successfully generated image with ${m}!`);
      break;
    }
  }
}
run();

