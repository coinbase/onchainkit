import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        ],
      },
    }),
    tailwindcss(),
    {
      name: 'manifest-proxy',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // handler to duplicate the cli express server implementation for development
          if (req.url?.startsWith('/api/fetch-manifest')) {
            const url = new URL(req.url, 'http://localhost');
            const domain = url.searchParams.get('domain');
            if (!domain) {
              res.statusCode = 400;
              res.statusMessage = 'Missing domain parameter';
              res.end(JSON.stringify({ error: 'Missing domain parameter' }));
              return;
            }

            fetch(`https://${domain}/.well-known/farcaster.json`)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then((data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              })
              .catch(() => {
                res.statusCode = 500;
                res.statusMessage = 'Failed to fetch manifest';
                res.end('Failed to fetch manifest');
              });
            return;
          }
          next();
        });
      },
    },
  ],
  build: {
    emptyOutDir: true,
  },
  logLevel: 'info',
});
