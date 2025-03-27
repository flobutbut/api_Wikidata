import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/wikidata': {
        target: 'https://query.wikidata.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wikidata/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'WikidataPeriods/1.0');
          });
          proxy.on('error', (err: Error, req, res) => {
            // Log uniquement les erreurs critiques
            if ((err as any).code !== 'ECONNRESET') {
              process.stderr.write(`Proxy Error: ${err.message}\n`);
            }
          });
        }
      }
    }
  }
})
