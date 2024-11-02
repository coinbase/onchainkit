import type { Mocks } from '../../types';

export const initializeMockFetch = (mocks: Mocks) => {
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;

    window.fetch = async function mockFetch(resource, options = {}) {
      try {
        const url = resource instanceof Request ? resource.url : resource;
        console.log('fetch request:', url);

        // look for matching url in mocks map
        for (const [pattern, { matchParams, response }] of mocks) {
          if (pattern.test(url.toString())) {
            // check for any additional match params
            if (
              !matchParams?.body ||
              matchParams?.body.test(options.body as string)
            ) {
              console.log(`returning mock response for: ${pattern}`, response.json);
              if (response.delay) {
                await new Promise(resolve => setTimeout(resolve, response.delay));
              }
              return new Response(JSON.stringify(response.json), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
              });
            }
          }
        }

        // no match found, use original fetch
        return originalFetch(resource, options);
      } catch (error) {
        console.error('mock fetch error, returning original fetch', error);
        return originalFetch(resource, options);
      }
    };
  }
};
