// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://aisafetytuebingen.com',
  base: '/',
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/.direnv/**']
      }
    }
  }
});
