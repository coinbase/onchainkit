import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/core/index.ts',
    './src/farcaster/index.ts',
    './src/frame/index.ts',
    './src/identity/index.ts',
    './src/swap/index.ts',
    './src/token/index.ts',
    './src/wallet/index.ts',
    './src/xmtp/index.ts',
  ],
  format: ['esm'],
  clean: true,
  splitting: true,
  dts: true,
});
