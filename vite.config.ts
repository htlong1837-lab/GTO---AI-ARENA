import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'save-model-middleware',
      configureServer(server) {
        server.middlewares.use('/api/save-model', (req, res) => {
          if (req.method === 'POST') {
            const parsedUrl = new URL(req.url || '', 'http://localhost');
            const fileName = parsedUrl.searchParams.get('name') || 'model.glb';
            const chunks: Buffer[] = [];
            req.on('data', (c) => chunks.push(c));
            req.on('end', () => {
              const buffer = Buffer.concat(chunks);
              const targetPath = path.resolve(process.cwd(), 'public/models', fileName);
              fs.writeFileSync(targetPath, buffer);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, file: fileName, size: buffer.length }));
            });
          } else {
            res.statusCode = 404;
            res.end();
          }
        });
      }
    }
  ],
})

