import { defineConfig } from 'vite';

// Spike 0: Vite wraps the existing global-script app without touching logic.
// - root is the project root (where index.html lives)
// - No framework plugin, no aliases, no code-splitting yet.
// - Plain <script src="..."> tags are served as-is so existing globals work.
export default defineConfig({
  root: '.',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Spike 0: keep build simple. Don't inline the 2.7MB of data files yet.
    assetsInlineLimit: 0
  }
});
