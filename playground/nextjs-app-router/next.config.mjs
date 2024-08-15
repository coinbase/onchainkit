import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';
 
export default (phase) => {
  const isDev = phase === PHASE_PRODUCTION_BUILD;
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    assetPrefix: isDev ? undefined : 'https://onchainkit.xyz/playground',
    typescript: {
      ignoreBuildErrors: true,
    }
  }
  return nextConfig
}
