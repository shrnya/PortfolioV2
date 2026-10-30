import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  build: { inlineStylesheets: 'always' },
  redirects: { '/work/sld/': '/work/smartsense/' },
});
