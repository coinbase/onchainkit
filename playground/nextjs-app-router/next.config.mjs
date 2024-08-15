import { PHASE_PRODUCTION_SERVER } from 'next/constants.js';
 
export default (phase) => {
  const isProd = phase === PHASE_PRODUCTION_SERVER;
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    assetPrefix: isProd ? 'https://onchainkit.xyz/playground' : undefined,
    typescript: {
      ignoreBuildErrors: true,
    }
  }
  return nextConfig
}
