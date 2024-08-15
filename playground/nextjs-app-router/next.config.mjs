/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.target = 'es2020';
      }
      return config;
    }
  };
  
  export default nextConfig;