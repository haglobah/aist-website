// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://haglobah.github.io',
  base: '/aist-website/',
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/.direnv/**']
      }
    }
  }
});
