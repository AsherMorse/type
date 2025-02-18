import icon from "astro-icon";
import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),

  integrations: [icon()],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        }
      }
    }
  },

  markdown: {
    syntaxHighlight: false,
  },

  redirects: {
    // Example note
    '/example': '/note/example',

    // External redirects
    '/git': 'https://github.com/ashermorse/type'

  },

  devToolbar: {
    enabled: false
  },
});