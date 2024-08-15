import { PHASE_PRODUCTION_SERVER } from 'next/constants.js';
 
export default (phase, { defaultConfig }) => {
  console.log('\n\n\n\n\n\n\n')
  console.log('-------- YO --------------');
  console.log('phase', phase);
  console.log('defaultConfig', defaultConfig);
  console.log('\n\n\n\n\n\n\n')
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
