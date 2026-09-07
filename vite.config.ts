import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [
    vinext(),
    nitro(),
  ],
});