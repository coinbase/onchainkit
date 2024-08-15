/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      swcPlugins: [
        ['next-superjson-plugin', {}]
      ]
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.target = 'es2020';
      }
      return config;
    }
  };
  
  export default nextConfig;