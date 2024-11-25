import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';

export default (phase) => {
  const isProdBuild = phase === PHASE_PRODUCTION_BUILD;
  const isVercelProd = process.env.VERCEL_ENV === 'production';
  const assetPrefix =
    isProdBuild && isVercelProd ? 'https://onchainkit.xyz/playground' : '';
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    assetPrefix,
    typescript: {
      ignoreBuildErrors: true,
    },

    // Silence warnings
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    webpack: (config) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');

      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/(?!@coinbase/onchainkit)/**'],
      };

      return config;
    },
  };
  return nextConfig;
};
