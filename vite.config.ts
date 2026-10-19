import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: './',
  build: {
    rolldownOptions: {
      input: { app: 'index.html', 'design-system': 'design-system.html' },
    },
  },
})
