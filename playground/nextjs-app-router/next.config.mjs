import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';
 
export default (phase, { defaultConfig }) => {
  console.log('\n\n\n\n\n\n\n')
  console.log('-------- YO 4 --------------');
  console.log('phase', phase);
  console.log('env', process.env);
  console.log('env.yo', defaultConfig.env);
  console.log('\n\n\n\n\n\n\n')
  const isProd = phase === PHASE_PRODUCTION_BUILD;
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
