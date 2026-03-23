import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',
    port: 5173,
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, '../certs/localhost+2-key.pem'),
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, '../certs/localhost+2.pem'),
      ),
    },
  },
});
