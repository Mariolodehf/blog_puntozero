// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://puntozero.dev',
  integrations: [tailwind()],
  output: 'server',
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  }
});
