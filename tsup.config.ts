import { defineConfig } from 'tsup';

export default defineConfig({
  //   entry: {
  //     index: 'src/index.ts',
  //     'api/index': 'src/api/index.ts',
  //     'checkout/index': 'src/checkout/index.ts',
  //     'core/index': 'src/core/index.ts',
  //     'frame/index': 'src/frame/index.ts',
  //     'fund/index': 'src/fund/index.ts',
  //     'identity/index': 'src/identity/index.ts',
  //     'nft/index': 'src/nft/index.ts',
  //     'nft/view/index': 'src/nft/components/view/index.ts',
  //     'nft/mint/index': 'src/nft/components/mint/index.ts',
  //     'swap/index': 'src/swap/index.ts',
  //     'token/index': 'src/token/index.ts',
  //     'transaction/index': 'src/transaction/index.ts',
  //     'wallet/index': 'src/wallet/index.ts',
  //     'farcaster/index': 'src/farcaster/index.ts',
  //     'xmtp/index': 'src/xmtp/index.ts',
  //     theme: 'src/styles/theme.ts',
  //   },
  entry: ['src/**/index.ts', 'src/**/theme.ts'],

  format: 'esm',
  minify: false, // Disable minification during development
  splitting: false, // Disable code splitting during development
  sourcemap: true,
  treeshake: false, // Disable tree shaking during development
  outDir: 'esm',
  dts: true,
});
