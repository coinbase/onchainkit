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
        server.middlewares.use(async (req, res, next) => {
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

          // New endpoint to fetch frame metadata
          if (req.url?.startsWith('/api/fetch-frame-meta')) {
            const url = new URL(req.url, 'http://localhost');
            const domain = url.searchParams.get('domain');
            if (!domain) {
              res.statusCode = 400;
              res.statusMessage = 'Missing domain parameter';
              res.end('Missing domain parameter');
              return;
            }

            try {
              const response = await fetch(domain);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const html = await response.text();

              const metaRegex =
                /<meta[^>]*name=["']fc:frame["'][^>]*content=["']([^"']+)["'][^>]*>/;
              const match = html.match(metaRegex);

              if (!match) {
                res.statusCode = 404;
                res.statusMessage = 'No frame metadata found';
                res.end('No frame metadata found');
                return;
              }

              try {
                // Parse the HTML-encoded JSON content
                const content = match[1].replace(/&quot;/g, '"');
                const frameMetadata = JSON.parse(content);

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(frameMetadata));
              } catch {
                res.statusCode = 500;
                res.statusMessage = 'Failed to parse frame metadata';
                res.end('Failed to parse frame metadata');
              }
            } catch {
              res.statusCode = 500;
              res.statusMessage = 'Failed to fetch frame metadata';
              res.end('Failed to fetch frame metadata');
            }
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
